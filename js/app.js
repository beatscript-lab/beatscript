import { runnerDoc } from './runner.js';

const $ = (id) => document.getElementById(id);
const els = {
  list: $('lessonList'), track: $('trackName'),
  title: $('lTitle'), intro: $('lIntro'), task: $('lTask'),
  code: $('code'), run: $('run'), reset: $('reset'), share: $('share'),
  hint: $('hint'), hintText: $('hintText'),
  status: $('status'), notice: $('notice'), stageHost: $('stageHost'),
};

let lessons = [];
let current = null;
let stageFrame = null;

/* ---------- small helpers ---------- */

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage may be blocked */ } },
};

function toB64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url}`);
  return res.json();
}

// Text with `backticks` becomes <code> elements. Never uses innerHTML.
function fillInline(parent, text) {
  text.split('`').forEach((part, i) => {
    if (!part) return;
    if (i % 2) {
      const c = document.createElement('code');
      c.textContent = part;
      parent.append(c);
    } else {
      parent.append(part);
    }
  });
}

function setStatus(message, bad = false) {
  els.status.textContent = message;
  els.status.classList.toggle('bad', bad);
}

/* ---------- stage (sandboxed runner) ---------- */

function mountStage(code) {
  const frame = document.createElement('iframe');
  frame.title = 'Result of your code';
  frame.setAttribute('sandbox', 'allow-scripts');   // no same-origin access
  frame.setAttribute('allow', 'autoplay');
  frame.srcdoc = runnerDoc(code);
  els.stageHost.replaceChildren(frame);
  stageFrame = frame;
}

window.addEventListener('message', (e) => {
  if (!stageFrame || e.source !== stageFrame.contentWindow) return;
  const data = e.data || {};
  if (data.type === 'error') setStatus('Oops: ' + data.message, true);
});

/* ---------- lessons ---------- */

async function loadLessons() {
  const index = await getJson('lessons/index.json');
  els.track.textContent = index.track;
  lessons = await Promise.all(
    index.lessons.map(async (id) => ({ id, ...(await getJson(`lessons/${id}.json`)) }))
  );
}

function renderRail() {
  els.list.replaceChildren(
    ...lessons.map((lesson) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = lesson.title;
      btn.dataset.id = lesson.id;
      btn.addEventListener('click', () => openLesson(lesson.id));
      li.append(btn);
      return li;
    })
  );
}

function markActive() {
  els.list.querySelectorAll('button').forEach((btn) => {
    if (btn.dataset.id === current.id) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  });
}

function openLesson(id, sharedCode = null) {
  current = lessons.find((l) => l.id === id) || lessons[0];

  els.title.textContent = current.title;
  els.intro.replaceChildren(
    ...current.intro.map((line) => {
      const p = document.createElement('p');
      fillInline(p, line);
      return p;
    })
  );
  els.task.replaceChildren();
  fillInline(els.task, current.task);

  const saved = store.get('beatscript:code:' + current.id);
  els.code.value = sharedCode ?? saved ?? current.code;

  els.hintText.hidden = true;
  els.hint.textContent = 'Show hint';
  els.notice.hidden = sharedCode === null;
  setStatus('');
  history.replaceState(null, '', '?l=' + encodeURIComponent(current.id));

  markActive();
  mountStage('');
}

/* ---------- actions ---------- */

function run() {
  els.notice.hidden = true;
  setStatus('');
  mountStage(els.code.value);
}

function startOver() {
  els.code.value = current.code;
  store.set('beatscript:code:' + current.id, current.code);
  setStatus('Back to the starting code.');
  mountStage('');
}

function toggleHint() {
  const show = els.hintText.hidden;
  els.hintText.replaceChildren();
  fillInline(els.hintText, current.hint);
  els.hintText.hidden = !show;
  els.hint.textContent = show ? 'Hide hint' : 'Show hint';
}

async function shareLink() {
  const url = `${location.origin}${location.pathname}?l=${encodeURIComponent(current.id)}#c=${toB64(els.code.value)}`;
  if (url.length > 6000) {
    setStatus('This code is too long for a share link. Try a shorter version.', true);
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    setStatus('Link copied. Anyone who opens it sees your code and can run it.');
  } catch {
    window.prompt('Copy this link:', url);
  }
}

/* ---------- editor behaviour ---------- */

let tabTrap = true;
els.code.addEventListener('blur', () => { tabTrap = true; });
els.code.addEventListener('input', () => {
  if (current) store.set('beatscript:code:' + current.id, els.code.value);
});
els.code.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    run();
    return;
  }
  if (e.key === 'Escape') { tabTrap = false; return; }
  if (e.key === 'Tab' && tabTrap && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    const { selectionStart: s, selectionEnd: end, value } = els.code;
    els.code.value = value.slice(0, s) + '  ' + value.slice(end);
    els.code.selectionStart = els.code.selectionEnd = s + 2;
    els.code.dispatchEvent(new Event('input'));
  }
});

els.run.addEventListener('click', run);
els.reset.addEventListener('click', startOver);
els.share.addEventListener('click', shareLink);
els.hint.addEventListener('click', toggleHint);

/* ---------- start ---------- */

(async function init() {
  try {
    await loadLessons();
  } catch (err) {
    els.title.textContent = 'Lessons could not load';
    els.intro.textContent = 'Open this page from a web server (see README), not directly from a file.';
    return;
  }
  renderRail();

  const params = new URLSearchParams(location.search);
  let shared = null;
  if (location.hash.startsWith('#c=')) {
    try { shared = fromB64(location.hash.slice(3)); } catch { shared = null; }
  }
  openLesson(params.get('l') || lessons[0].id, shared);
})();
