// Everything is kept in this browser only (localStorage). Nothing is sent anywhere.
const P = 'beatscript:';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(P + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(P + key, JSON.stringify(value)); } catch { /* storage can be blocked */ }
}

export const getPref = (name, fallback) => read('pref:' + name, fallback);
export const setPref = (name, value) => write('pref:' + name, value);

export const getCode = (projectId, lang) => read(`code:${projectId}:${lang}`, null);
export const setCode = (projectId, lang, code) => write(`code:${projectId}:${lang}`, code);

const getProgress = () => read('progress', {});

export function recordRun(projectId, lang, { edited, ok }) {
  const all = getProgress();
  const p = (all[projectId] ||= {});
  const l = (p[lang] ||= { ok: false, edited: false, editedRuns: 0 });
  if (ok) {
    l.ok = true;
    if (edited) { l.edited = true; l.editedRuns += 1; }
  }
  write('progress', all);
}

// 1 star: it ran. 2 stars: it ran after you changed the code.
// 3 stars: you changed and ran it in two languages (or three times, if there is only one language).
export function starsFor(project) {
  const prog = getProgress()[project.id] || {};
  const langs = Object.keys(prog);
  if (!langs.some((l) => prog[l].ok)) return 0;
  let stars = 1;
  if (langs.some((l) => prog[l].edited)) stars = 2;
  const multi = Object.keys(project.variants).length > 1;
  const editedLangs = langs.filter((l) => prog[l].edited).length;
  const mostRuns = Math.max(0, ...langs.map((l) => prog[l].editedRuns || 0));
  if (multi ? editedLangs >= 2 : mostRuns >= 3) stars = 3;
  return stars;
}

// ----- backup of everything Beatscript keeps in this browser (progress, saved code, language) -----
export function exportAll() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(P)) data[key] = localStorage.getItem(key);
    }
  } catch { /* storage may be blocked */ }
  return { app: 'beatscript', format: 1, exportedAt: new Date().toISOString(), data };
}

// Returns the number of entries restored, or -1 if the file is not a Beatscript backup.
export function importAll(obj) {
  if (!obj || obj.app !== 'beatscript' || obj.format !== 1 || typeof obj.data !== 'object' || obj.data === null) return -1;
  const entries = Object.entries(obj.data);
  if (entries.length > 500) return -1;
  let n = 0;
  try {
    for (const [key, value] of entries) {
      if (!key.startsWith(P) || typeof value !== 'string' || value.length > 200000) continue;
      localStorage.setItem(key, value);
      n += 1;
    }
  } catch { return -1; }
  return n;
}

export function resetAll() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(P)) keys.push(k); }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}
