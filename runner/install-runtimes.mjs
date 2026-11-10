// Installs the language runtimes Beatscript needs into a running Piston instance.
// Usage (inside the gateway container):  node install-runtimes.mjs
// "gcc" provides the C++ compiler.

const PISTON = (process.env.PISTON_URL || 'http://piston:2000').replace(/\/$/, '');
const WANT = ['php', 'java', 'gcc'];

const num = (v) => String(v).split('.').map((n) => parseInt(n, 10) || 0);
function newer(a, b) {
  const x = num(a), y = num(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  return false;
}

const res = await fetch(PISTON + '/api/v2/packages');
if (!res.ok) { console.error('Cannot list packages from', PISTON, res.status); process.exit(1); }
const all = await res.json();

for (const lang of WANT) {
  const options = all.filter((p) => p.language === lang);
  if (!options.length) { console.log(lang + ': not available'); continue; }
  const best = options.reduce((m, p) => (newer(p.language_version, m.language_version) ? p : m));
  if (best.installed) { console.log(`${lang} ${best.language_version}: already installed`); continue; }
  console.log(`Installing ${lang} ${best.language_version} ...`);
  const r = await fetch(PISTON + '/api/v2/packages', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ language: lang, version: best.language_version }),
  });
  console.log(r.ok ? '  done' : '  FAILED ' + r.status + ' ' + (await r.text()));
}
