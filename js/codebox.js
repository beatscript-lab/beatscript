// A reusable code editor + Run button + result panel, used by lessons, practice and tests.
import { h, icon } from './dom.js';
import { t } from './i18n.js';
import { LANGUAGES } from './content.js';
import { buildDoc } from './runner.js';
import { runRemote, server } from './remote.js';
import { evaluate, frameList, needsFrame } from './checks.js';

const FILES = { html: 'index.html', css: 'style.css', js: 'script.js', php: 'main.php', java: 'Main.java', cpp: 'main.cpp' };

// options: { lang, code, view, scaffold, checks, readOnly, autoRun, runLabel, onRun(result) }
// result: { ok, output, code, changed, checkResults, error }
export function createCodeBox(options) {
  const { lang, view = 'text', scaffold, checks = [], readOnly = false, autoRun = false } = options;
  const starter = String(options.code ?? '');
  const isServer = LANGUAGES[lang].where === 'server';
  let running = false;
  let current = null;

  const gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
  const ta = h('textarea', {
    class: 'code', spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', wrap: 'off',
    readonly: readOnly, 'aria-label': t('ws.code'),
  });
  const statusEl = h('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
  const resultBody = h('div', { class: 'result__body' });
  const runBtn = h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => run() });
  const actions = h('div', { class: 'editor__actions' }, runBtn);

  ta.value = starter;
  function updateGutter() {
    gutter.textContent = Array.from({ length: ta.value.split('\n').length }, (_, i) => i + 1).join('\n');
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight, 90) + 'px';
  }
  function setRunLabel() {
    runBtn.replaceChildren(icon('play', 18), ' ', running ? t('ws.running') : (options.runLabel || t('ws.run')));
    runBtn.disabled = running;
  }
  function setStatus(text, bad = false) {
    statusEl.textContent = text;
    statusEl.classList.toggle('is-bad', bad);
  }
  function emptyResult() { resultBody.replaceChildren(h('p', { class: 'result__empty' }, t('ws.resultEmpty'))); }

  /* ----- running in the browser (sandboxed frame) ----- */
  function runBrowser(code) {
    return new Promise((resolve) => {
      const frameChecks = frameList(checks);
      const wantChecks = needsFrame(checks);
      const frame = h('iframe', { class: 'frame frame--' + view, title: t('ws.frameTitle'), sandbox: 'allow-scripts', allow: 'autoplay' });
      frame.srcdoc = buildDoc({ lang, code, view, scaffold, checks: frameChecks });
      const st = { frame, error: null, output: '', ready: false, frameResults: null, settled: false };
      const finish = () => {
        if (st.settled) return;
        st.settled = true;
        resolve({ error: st.error, output: st.output, frame: st.frameResults });
      };
      const tryFinish = () => {
        if (!st.ready) return;
        if (st.error || !wantChecks || st.frameResults) finish();
      };
      st.tryFinish = tryFinish;
      st.markReady = () => { st.ready = true; tryFinish(); };
      current = st;
      if (lang === 'html' || lang === 'css') frame.addEventListener('load', () => st.markReady());
      resultBody.replaceChildren(frame);
      setTimeout(finish, 6000);
    });
  }

  function onMessage(e) {
    if (!current || e.source !== current.frame.contentWindow) return;
    const d = e.data || {};
    if (d.type === 'error') {
      current.error = d.message;
      setStatus(t('ws.oops', { msg: d.message }), true);
      current.ready = true; current.tryFinish();
    } else if (d.type === 'done') {
      current.output = String(d.output || '');
      current.markReady();
    } else if (d.type === 'checks') {
      current.frameResults = d.results || {};
      current.tryFinish();
    }
  }
  window.addEventListener('message', onMessage);

  /* ----- running on the server (PHP, Java, C++) ----- */
  function showServer(res) {
    if (res.error) {
      const key = { rate: 'ws.rate', busy: 'ws.busy', too_large: 'ws.tooBig', net: 'ws.netError' }[res.error] || 'ws.serverDown';
      resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, t(key)));
      return { error: res.error, output: '' };
    }
    if (res.phase === 'compile') {
      resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, t('ws.compileError')), h('pre', { class: 'out out--err' }, res.output || ''));
      return { error: 'compile', output: '' };
    }
    const parts = [];
    if (res.signal) parts.push(h('p', { class: 'result__msg is-bad' }, t('ws.timeout')));
    if (res.stdout) parts.push(h('pre', { class: 'out' }, res.stdout));
    if (res.stderr) parts.push(h('p', { class: 'result__msg is-bad' }, t('ws.stderr')), h('pre', { class: 'out out--err' }, res.stderr));
    if (!parts.length) parts.push(h('p', { class: 'result__msg' }, t('ws.noOutput')));
    resultBody.replaceChildren(...parts);
    return { error: res.ok ? null : 'run', output: res.stdout || '' };
  }

  async function run() {
    if (running) return null;
    running = true; setRunLabel(); setStatus('');
    const code = ta.value;
    let raw;
    try {
      if (!isServer) raw = await runBrowser(code);
      else if (!server.languages.includes(lang)) {
        resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, t('ws.serverDown')));
        raw = { error: 'down', output: '' };
      } else {
        resultBody.replaceChildren(h('p', { class: 'result__msg' }, t('ws.running')));
        raw = showServer(await runRemote(lang, code));
      }
    } finally { running = false; setRunLabel(); }
    const result = {
      ok: !raw.error, error: raw.error, output: raw.output, code,
      changed: code.trim() !== starter.trim(),
      checkResults: evaluate(checks, { code, output: raw.output, frame: raw.frame }),
    };
    if (options.onRun) options.onRun(result);
    return result;
  }

  /* ----- editor behaviour ----- */
  let tabTrap = true;
  ta.addEventListener('blur', () => { tabTrap = true; });
  ta.addEventListener('input', () => { updateGutter(); if (options.onInput) options.onInput(ta.value); });
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (e.key === 'Escape') { tabTrap = false; return; }
    if (e.key === 'Tab' && tabTrap && !readOnly && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end, value } = ta;
      ta.value = value.slice(0, s) + '  ' + value.slice(end);
      ta.selectionStart = ta.selectionEnd = s + 2;
      ta.dispatchEvent(new Event('input'));
    }
  });

  const el = h('div', { class: 'codebox' },
    h('section', { class: 'editor', 'aria-label': t('ws.code') },
      h('div', { class: 'editor__bar' }, h('span', {}, FILES[lang]), h('span', {}, LANGUAGES[lang].name)),
      h('div', { class: 'editor__body' }, gutter, ta),
      actions),
    statusEl,
    h('section', { class: 'result', 'aria-label': t('ws.result') },
      h('div', { class: 'result__bar' }, t('ws.result')),
      resultBody));

  updateGutter(); setRunLabel(); emptyResult();
  if (autoRun) queueMicrotask(() => run());

  return {
    el,
    run,
    addAction(node) { actions.append(node); },
    getCode: () => ta.value,
    setCode(code) { ta.value = code; updateGutter(); },
    setStatus,
    resize: updateGutter,
    destroy() { window.removeEventListener('message', onMessage); },
  };
}
