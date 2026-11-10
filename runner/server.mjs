// Beatscript runner gateway.
// Sits in front of a private Piston instance and exposes only what the website needs:
//   GET  /health  -> which server languages work right now
//   POST /run     -> run PHP, Java or C++ code with strict limits
// Piston itself must never be exposed to the internet.

import http from 'node:http';
import { pathToFileURL } from 'node:url';

export const LANGS = {
  php: { language: 'php', file: 'main.php' },
  java: { language: 'java', file: 'Main.java' },
  cpp: { language: 'c++', file: 'main.cpp' },
};

const OUT_LIMIT = 8000;

function cut(text) {
  const s = String(text ?? '').replace(/\/piston\/jobs\/[\w-]+\//g, '');
  return s.length > OUT_LIMIT ? s.slice(0, OUT_LIMIT) + '\n[output cut]' : s;
}

export function normalize(p) {
  const c = p && p.compile;
  const r = (p && p.run) || {};
  if (c && c.code !== 0 && c.code !== undefined && c.code !== null) {
    return { ok: false, phase: 'compile', output: cut(c.output || c.stderr || ''), exitCode: c.code };
  }
  return {
    ok: r.code === 0 && !r.signal,
    phase: 'run',
    stdout: cut(r.stdout),
    stderr: cut(r.stderr),
    exitCode: r.code ?? null,
    signal: r.signal ?? null,
  };
}

export function createGateway(options = {}) {
  const pistonUrl = (options.pistonUrl || process.env.PISTON_URL || 'http://piston:2000').replace(/\/$/, '');
  const allowed = (options.allowedOrigins || process.env.ALLOWED_ORIGINS || 'https://beatscript.labupgrade.ai')
    .toString().split(',').map((s) => s.trim()).filter(Boolean);
  const trustProxy = options.trustProxy ?? process.env.TRUST_PROXY !== '0';
  const ratePerMin = Number(options.ratePerMin || process.env.RATE_PER_MIN || 20);
  const maxParallel = Number(options.maxParallel || process.env.MAX_PARALLEL || 3);
  const maxCode = 20000;
  const maxBody = 40000;

  const hits = new Map();
  let running = 0;
  let healthCache = { at: 0, value: null };

  function clientIp(req) {
    if (trustProxy) {
      const xff = String(req.headers['x-forwarded-for'] || '');
      const last = xff.split(',').map((s) => s.trim()).filter(Boolean).pop();
      if (last) return last; // the entry added by our own proxy, not one the client can fake
    }
    return req.socket.remoteAddress || 'unknown';
  }

  function limited(ip) {
    const now = Date.now();
    const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
    if (list.length >= ratePerMin) { hits.set(ip, list); return true; }
    list.push(now);
    hits.set(ip, list);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60000)) hits.delete(k);
    return false;
  }

  function send(res, status, body) {
    res.statusCode = status;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify(body));
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on('data', (c) => {
        size += c.length;
        if (size > maxBody) { reject(new Error('too_large')); req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      req.on('error', reject);
    });
  }

  async function health() {
    if (Date.now() - healthCache.at < 30000 && healthCache.value) return healthCache.value;
    let languages = [];
    try {
      const r = await fetch(pistonUrl + '/api/v2/runtimes', { signal: AbortSignal.timeout(3000) });
      const list = await r.json();
      languages = Object.entries(LANGS)
        .filter(([, def]) => list.some((x) => x.language === def.language || (x.aliases || []).includes(def.language)))
        .map(([key]) => key);
    } catch { languages = []; }
    healthCache = { at: Date.now(), value: { ok: languages.length > 0, languages } };
    return healthCache.value;
  }

  async function run(req, res) {
    let data;
    try { data = JSON.parse(await readBody(req)); }
    catch (e) { return send(res, e.message === 'too_large' ? 413 : 400, { error: e.message === 'too_large' ? 'too_large' : 'bad_json' }); }

    const def = LANGS[data && data.language];
    if (!def) return send(res, 400, { error: 'bad_language' });
    if (typeof data.code !== 'string' || !data.code.trim()) return send(res, 400, { error: 'empty_code' });
    if (data.code.length > maxCode) return send(res, 413, { error: 'too_large' });
    const stdin = typeof data.stdin === 'string' ? data.stdin.slice(0, 1000) : '';

    if (limited(clientIp(req))) return send(res, 429, { error: 'rate' });
    if (running >= maxParallel) return send(res, 503, { error: 'busy' });

    running += 1;
    try {
      const r = await fetch(pistonUrl + '/api/v2/execute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          language: def.language,
          version: '*',
          files: [{ name: def.file, content: data.code }],
          stdin,
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: 268435456,
          run_memory_limit: 134217728,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const payload = await r.json();
      if (!r.ok) return send(res, 502, { error: 'runner_error' });
      return send(res, 200, normalize(payload));
    } catch {
      return send(res, 502, { error: 'runner_down' });
    } finally {
      running -= 1;
    }
  }

  return http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    if (origin && allowed.includes(origin)) {
      res.setHeader('access-control-allow-origin', origin);
      res.setHeader('vary', 'Origin');
    }
    res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
    res.setHeader('access-control-allow-headers', 'content-type');
    res.setHeader('access-control-max-age', '600');
    res.setHeader('x-content-type-options', 'nosniff');

    if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
    const path = (req.url || '').split('?')[0];

    if (req.method === 'GET' && path === '/health') return send(res, 200, await health());
    if (req.method === 'POST' && path === '/run') {
      if (origin && !allowed.includes(origin)) return send(res, 403, { error: 'origin' });
      return run(req, res);
    }
    return send(res, 404, { error: 'not_found' });
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const port = Number(process.env.PORT || 8080);
  createGateway().listen(port, () => console.log('Beatscript runner gateway on :' + port));
}
