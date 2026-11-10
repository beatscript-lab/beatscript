import { h, icon, starsRow } from './dom.js';
import { t, pick } from './i18n.js';
import { projectById, domainById, languagesOf, LANGUAGES } from './content.js';
import { getCode, setCode, recordRun, starsFor } from './store.js';
import { buildDoc } from './runner.js';
import { runRemote, server, onServerChange } from './remote.js';
import { toB64, fromB64 } from './util.js';
import { config } from './config.js';
import { notFoundView } from './views-domain.js';

export function workspaceView(projectId, query) {
  const project = projectById(projectId);
  if (!project) return notFoundView();
  const domain = domainById(project.domain);
  const langs = languagesOf(project);

  let lang = langs.includes(query.get('l')) ? query.get('l') : langs[0];
  let sharedCode = null;
  if (query.get('c')) { try { sharedCode = fromB64(query.get('c')); } catch { sharedCode = null; } }

  let running = false;
  let helpOpen = false;
  let current = null; // { frame, error, finish }
  const variant = () => project.variants[lang];
  const isServer = () => LANGUAGES[lang].where === 'server';

  /* ---------- pieces ---------- */
  const noticeEl = h('p', { class: 'notice', hidden: sharedCode === null }, t('ws.sharedNotice'));
  const statusEl = h('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
  const helpEl = h('p', { class: 'helpbox', hidden: true }, pick(project.hint));
  const gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
  const ta = h('textarea', {
    class: 'code', spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', wrap: 'off',
    'aria-label': t('ws.code'),
  });
  const fileLabel = h('span', {});
  const langLabel = h('span', {});
  const resultBody = h('div', { class: 'result__body' });
  const noteEl = h('p', { class: 'fine' });
  const starsHolder = h('span', { class: 'stars-wrap', role: 'img' });
  const tabsEl = h('div', { class: 'tabs', role: 'group', 'aria-label': t('ws.sameProject') });
  const runBtn = h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => run() });
  const helpBtn = h('button', { type: 'button', class: 'btn btn--lg', onclick: () => toggleHelp() }, t('ws.help'));

  function setStatus(text, bad = false) {
    statusEl.textContent = text;
    statusEl.classList.toggle('is-bad', bad);
  }
  function setRunLabel() {
    runBtn.replaceChildren(icon('play', 18), ' ', running ? t('ws.running') : t('ws.run'));
    runBtn.disabled = running;
  }
  function updateStars() {
    const n = starsFor(project);
    starsHolder.replaceChildren(starsRow(n, 32));
    starsHolder.setAttribute('aria-label', t('stars.label', { n }));
    return n;
  }
  function updateGutter() {
    const lines = ta.value.split('\n').length;
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight, 200) + 'px';
  }
  function emptyResult() {
    resultBody.replaceChildren(h('p', { class: 'result__empty' }, t('ws.resultEmpty')));
  }
  const unavailable = () => isServer() && !server.languages.includes(lang);
  function updateNote() {
    noteEl.textContent = unavailable() ? t('ws.soonLang') : isServer() ? t('ws.serverNote') : t('ws.browserNote');
  }
  function renderTabs() {
    tabsEl.replaceChildren(...langs.map((key) => {
      const info = LANGUAGES[key];
      const down = info.where === 'server' && !server.languages.includes(key);
      const sub = info.where === 'server' ? (down ? t('common.soon') : t('where.server.short')) : t('where.browser.short');
      return h('button', {
        type: 'button', class: 'tab' + (key === lang ? ' is-on' : ''), 'aria-pressed': String(key === lang),
        onclick: () => setLang(key),
      }, h('span', { class: 'tab__name' }, info.name), h('span', { class: 'tab__sub' }, sub));
    }));
  }
  function loadCode(useShared) {
    const v = variant();
    ta.value = (useShared && sharedCode !== null) ? sharedCode : (getCode(project.id, lang) ?? v.code);
    fileLabel.textContent = ({ html: 'index.html', css: 'style.css', js: 'script.js', php: 'main.php', java: 'Main.java', cpp: 'main.cpp' })[lang];
    langLabel.textContent = LANGUAGES[lang].name;
    updateGutter();
  }
  function setLang(next) {
    if (next === lang) return;
    lang = next;
    helpOpen = false; helpEl.hidden = true; helpBtn.textContent = t('ws.help');
    loadCode(false);
    renderTabs(); updateNote(); emptyResult(); setStatus('');
  }
  function toggleHelp() {
    helpOpen = !helpOpen;
    helpEl.hidden = !helpOpen;
    helpBtn.textContent = helpOpen ? t('ws.helpHide') : t('ws.help');
  }

  /* ---------- results ---------- */
  function showPre(text, cls = '') { return h('pre', { class: 'out ' + cls }, text); }

  function showServerResult(res) {
    if (res.error) {
      const key = { rate: 'ws.rate', busy: 'ws.busy', too_large: 'ws.tooBig', net: 'ws.netError' }[res.error] || 'ws.serverDown';
      resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, t(key)));
      return false;
    }
    if (res.phase === 'compile') {
      resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, t('ws.compileError')), showPre(res.output || '', 'out--err'));
      return false;
    }
    const parts = [];
    if (res.signal) parts.push(h('p', { class: 'result__msg is-bad' }, t('ws.timeout')));
    if (res.stdout) parts.push(showPre(res.stdout));
    if (res.stderr) parts.push(h('p', { class: 'result__msg is-bad' }, t('ws.stderr')), showPre(res.stderr, 'out--err'));
    if (!parts.length) parts.push(h('p', { class: 'result__msg' }, t('ws.noOutput')));
    resultBody.replaceChildren(...parts);
    return Boolean(res.ok);
  }

  function runBrowser(v, code) {
    return new Promise((resolve) => {
      const frame = h('iframe', {
        class: 'frame frame--' + v.view, title: t('ws.frameTitle'),
        sandbox: 'allow-scripts', allow: 'autoplay',
      });
      frame.srcdoc = buildDoc({ lang, code, view: v.view, scaffold: v.scaffold });
      let settled = false;
      const finish = (ok) => { if (!settled) { settled = true; resolve(ok); } };
      current = { frame, error: null, finish };
      if (lang === 'html' || lang === 'css') frame.addEventListener('load', () => finish(true));
      resultBody.replaceChildren(frame);
      setTimeout(() => finish(false), 8000);
    });
  }

  async function run() {
    if (running) return;
    running = true; setRunLabel(); setStatus('');
    noticeEl.hidden = true;
    const v = variant();
    const code = ta.value;
    const edited = code.trim() !== v.code.trim();
    let ok = false;
    try {
      if (!isServer()) ok = await runBrowser(v, code);
      else if (!server.languages.includes(lang)) {
        resultBody.replaceChildren(h('p', { class: 'result__msg is-bad' }, config.runnerUrl ? t('ws.serverDown') : t('ws.soonLang')));
      } else {
        resultBody.replaceChildren(h('p', { class: 'result__msg' }, t('ws.running')));
        ok = showServerResult(await runRemote(lang, code));
      }
    } finally {
      running = false; setRunLabel();
    }
    const before = starsFor(project);
    recordRun(project.id, lang, { edited, ok });
    const after = updateStars();
    if (ok && after > before) setStatus(t('ws.starWon'));
  }

  function onMessage(e) {
    if (!current || e.source !== current.frame.contentWindow) return;
    const data = e.data || {};
    if (data.type === 'error') {
      current.error = data.message;
      setStatus(t('ws.oops', { msg: data.message }), true);
      current.finish(false);
    } else if (data.type === 'done') {
      current.finish(!current.error);
    }
  }
  window.addEventListener('message', onMessage);
  const offServer = onServerChange(() => { renderTabs(); updateNote(); });

  /* ---------- editor behaviour ---------- */
  let tabTrap = true;
  ta.addEventListener('blur', () => { tabTrap = true; });
  ta.addEventListener('input', () => { setCode(project.id, lang, ta.value); updateGutter(); });
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (e.key === 'Escape') { tabTrap = false; return; }
    if (e.key === 'Tab' && tabTrap && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end, value } = ta;
      ta.value = value.slice(0, s) + '  ' + value.slice(end);
      ta.selectionStart = ta.selectionEnd = s + 2;
      ta.dispatchEvent(new Event('input'));
    }
  });

  async function share() {
    const url = `${location.origin}${location.pathname}#/p/${project.id}?l=${lang}&c=${toB64(ta.value)}`;
    if (url.length > 6000) { setStatus(t('ws.tooLong'), true); return; }
    try { await navigator.clipboard.writeText(url); setStatus(t('ws.copied')); }
    catch { window.prompt(t('ws.share'), url); }
  }
  function startOver() {
    ta.value = variant().code;
    setCode(project.id, lang, ta.value);
    updateGutter(); emptyResult(); setStatus(t('ws.resetDone'));
  }

  /* ---------- layout ---------- */
  const steps = h('ol', { class: 'steps' },
    h('li', { class: 'step is-done' }, h('span', { class: 'step__n' }, icon('check', 18, { 'stroke-width': '3' })), t('ws.steps.read')),
    h('li', { class: 'step is-now' }, h('span', { class: 'step__n' }, '2'), t('ws.steps.write')),
    h('li', { class: 'step' }, h('span', { class: 'step__n' }, '3'), t('ws.steps.run')));

  const el = h('div', { class: 'stack' },
    h('nav', { class: 'crumbs', 'aria-label': pick(domain.title) },
      h('a', { href: '#/d/' + domain.id }, pick(domain.title)),
      h('span', { 'aria-hidden': 'true' }, '›'),
      h('span', {}, pick(project.title))),
    h('div', { class: 'ws' },
      h('section', { class: 'ws__lesson' },
        h('h1', {}, pick(project.title)),
        h('p', { class: 'lead' }, pick(project.intro)),
        steps,
        h('div', { class: 'task' }, h('strong', {}, t('ws.try')), ' ', pick(project.task)),
        h('div', { class: 'starsline' }, starsHolder, h('span', {}, t('ws.starsHint')))),
      h('div', { class: 'ws__work' },
        langs.length > 1 ? h('p', { class: 'prompt' }, t('ws.sameProject')) : null,
        tabsEl,
        noticeEl,
        h('section', { class: 'editor', 'aria-label': t('ws.code') },
          h('div', { class: 'editor__bar' }, fileLabel, langLabel),
          h('div', { class: 'editor__body' }, gutter, ta),
          h('div', { class: 'editor__actions' },
            runBtn,
            h('button', { type: 'button', class: 'btn btn--lg', onclick: startOver }, t('ws.reset')),
            helpBtn,
            h('button', { type: 'button', class: 'btn btn--lg', onclick: share }, t('ws.share')))),
        h('p', { class: 'keys' }, t('ws.keys')),
        statusEl,
        helpEl,
        h('section', { class: 'result', 'aria-label': t('ws.result') },
          h('div', { class: 'result__bar' }, t('ws.result')),
          resultBody),
        noteEl)));

  loadCode(true);
  renderTabs(); updateNote(); emptyResult(); setRunLabel(); updateStars();

  return {
    el,
    destroy() {
      window.removeEventListener('message', onMessage);
      offServer();
    },
  };
}
