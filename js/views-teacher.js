// Teacher view: load the progress files students saved, see the class, print certificates.
// Everything is read in this browser. Nothing is uploaded.
import { h } from './dom.js';
import { t, pick } from './i18n.js';
import { COURSES } from './courses/index.js';
import { printCertificates } from './certificate.js';

const MAX_FILES = 200;
const MAX_SIZE = 2_000_000;
const KEY_LEARN = 'beatscript:pref:learn';
const KEY_NAME = 'beatscript:pref:studentName';

const readyCourses = COURSES.filter((c) => c.levels.length);
const allLevels = readyCourses.flatMap((course) => course.levels.map((level) => ({ course, level })));
const allLessons = allLevels.flatMap(({ level }) => level.lessons);

const clean = (s, max = 60) => String(s ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, max);

function parseJsonField(data, key, fallback) {
  try { return data[key] === undefined ? fallback : JSON.parse(data[key]); } catch { return fallback; }
}

// A student file -> { key, name, lessons: {id: true}, levels: {id: {passed, round}}, exportedAt } or null.
export function parseStudent(text, fileName) {
  let obj;
  try { obj = JSON.parse(text); } catch { return null; }
  if (!obj || obj.app !== 'beatscript' || obj.format !== 1 || typeof obj.data !== 'object' || obj.data === null) return null;
  const learn = parseJsonField(obj.data, KEY_LEARN, { lessons: {}, levels: {} });
  const name = clean(parseJsonField(obj.data, KEY_NAME, ''));
  const base = clean(String(fileName).replace(/\.json$/i, ''));
  return {
    key: (name || base).toLowerCase(),
    name: name || base,
    lessons: (learn && typeof learn.lessons === 'object' && learn.lessons) || {},
    levels: (learn && typeof learn.levels === 'object' && learn.levels) || {},
    exportedAt: String(obj.exportedAt || ''),
  };
}

const lessonsDone = (s) => allLessons.filter((l) => s.lessons[l.id] === true).length;
const levelPassed = (s, id) => Boolean(s.levels[id] && s.levels[id].passed);
const levelRounds = (s, id) => Number((s.levels[id] && s.levels[id].round) || 0);

// CSV cells that start with = + - @ could run as formulas in a spreadsheet: neutralise them.
export function csvCell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function buildCsv(students) {
  const head = ['Elev', 'Lectii terminate', 'Niveluri trecute', ...allLessons.map((l) => l.id), ...allLevels.map(({ level }) => 'test ' + level.id)];
  const rows = students.map((s) => [
    s.name, lessonsDone(s), allLevels.filter(({ level }) => levelPassed(s, level.id)).length,
    ...allLessons.map((l) => (s.lessons[l.id] === true ? 1 : 0)),
    ...allLevels.map(({ level }) => (levelPassed(s, level.id) ? 'trecut' : levelRounds(s, level.id) ? 'reluari:' + levelRounds(s, level.id) : '')),
  ]);
  return '\ufeff' + [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

export function teacherView() {
  let students = [];
  const results = h('div', { class: 'stack' });
  const status = h('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
  const teacherInput = h('input', { type: 'text', class: 'fillbox fillbox--wide', maxlength: '60', 'aria-label': t('teacher.cert.teacher') });
  const schoolInput = h('input', { type: 'text', class: 'fillbox fillbox--wide', maxlength: '80', 'aria-label': t('teacher.cert.school') });
  const file = h('input', { type: 'file', accept: '.json,application/json', multiple: true, class: 'sr', tabindex: '-1', 'aria-hidden': 'true' });

  function say(text, bad = false) { status.textContent = text; status.classList.toggle('is-bad', bad); }

  async function load(files) {
    const list = Array.from(files).slice(0, MAX_FILES);
    const bad = [];
    for (const f of list) {
      let s = null;
      if (f.size <= MAX_SIZE) s = parseStudent(await f.text(), f.name);
      if (!s) { bad.push(f.name); continue; }
      const at = students.findIndex((x) => x.key === s.key);
      if (at < 0) students.push(s);
      else if (s.exportedAt >= students[at].exportedAt) students[at] = s; // the newer export replaces the older one
    }
    students.sort((a, b) => a.name.localeCompare(b.name));
    say(bad.map((n) => t('teacher.badFile', { name: clean(n, 80) })).join(' '), bad.length > 0);
    render();
  }
  file.addEventListener('change', async () => { if (file.files && file.files.length) await load(file.files); file.value = ''; });

  function matrix() {
    const head1 = h('tr', {},
      h('th', { rowspan: '2', scope: 'col', class: 'tt-name' }, t('teacher.col.student')),
      h('th', { rowspan: '2', scope: 'col' }, t('teacher.col.done')),
      ...allLevels.map(({ course, level }) => h('th', { colspan: String(level.lessons.length + 1), scope: 'colgroup', class: 'tt-group' }, `${pick(course.title).split(':')[0]} · ${pick(level.title)}`)));
    const head2 = h('tr', {}, ...allLevels.flatMap(({ level }) => [
      ...level.lessons.map((_, i) => h('th', { scope: 'col', class: 'tt-n' }, String(i + 1))),
      h('th', { scope: 'col', class: 'tt-n', title: t('learn.test') }, '★'),
    ]));
    const body = students.map((s, idx) => h('tr', {},
      h('th', { scope: 'row', class: 'tt-name' }, s.name || t('teacher.noName', { n: idx + 1 })),
      h('td', { class: 'tt-count' }, `${lessonsDone(s)}/${allLessons.length}`),
      ...allLevels.flatMap(({ level }) => [
        ...level.lessons.map((l) => {
          const done = s.lessons[l.id] === true;
          return h('td', { class: 'tt-cell' + (done ? ' is-done' : ''), title: done ? t('teacher.cell.done') : t('teacher.cell.todo') }, done ? '✓' : '');
        }),
        (() => {
          const passed = levelPassed(s, level.id); const r = levelRounds(s, level.id);
          return h('td', { class: 'tt-cell tt-test' + (passed ? ' is-done' : r ? ' is-retry' : ''), title: passed ? t('teacher.cell.passed') : r ? t('teacher.cell.retries', { n: r }) : t('teacher.cell.notYet') }, passed ? '★' : r ? '↻' + r : '');
        })(),
      ])));
    const foot = h('tr', { class: 'tt-foot' },
      h('th', { scope: 'row', class: 'tt-name' }, t('teacher.foot')), h('td', {}, ''),
      ...allLevels.flatMap(({ level }) => [
        ...level.lessons.map((l) => h('td', { class: 'tt-cell' }, String(students.filter((s) => s.lessons[l.id] === true).length))),
        h('td', { class: 'tt-cell' }, String(students.filter((s) => levelPassed(s, level.id)).length)),
      ]));
    return h('div', { class: 'table-scroll' }, h('table', { class: 'teacher-table' }, h('thead', {}, head1, head2), h('tbody', {}, ...body), h('tfoot', {}, foot)));
  }

  function certificateItems() {
    return students.flatMap((s, idx) => allLevels
      .filter(({ level }) => levelPassed(s, level.id))
      .map(({ course, level }) => ({ name: s.name || t('teacher.noName', { n: idx + 1 }), course: pick(course.title).split(':')[0], level: pick(level.title) })));
  }

  function download() {
    const blob = new Blob([buildCsv(students)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'beatscript-clasa.csv' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function render() {
    if (!students.length) { results.replaceChildren(h('p', { class: 'fine' }, t('teacher.none'))); return; }
    const avg = students.reduce((n, s) => n + lessonsDone(s), 0) / students.length;
    const passedAny = students.filter((s) => allLevels.some(({ level }) => levelPassed(s, level.id))).length;
    const certs = certificateItems();
    results.replaceChildren(
      h('section', { class: 'about-block' }, h('h2', {}, t('teacher.summary.title')),
        h('ul', { class: 'plain' },
          h('li', {}, t('teacher.summary.students', { n: students.length })),
          h('li', {}, t('teacher.summary.avg', { n: avg.toFixed(1), m: allLessons.length })),
          h('li', {}, t('teacher.summary.passed', { n: passedAny })))),
      matrix(),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn btn--lg', onclick: download }, t('teacher.csv')),
        h('button', { type: 'button', class: 'btn btn--lg', onclick: () => { students = []; say(''); render(); } }, t('teacher.clear'))),
      h('section', { class: 'about-block' }, h('h2', {}, t('teacher.cert.title')),
        h('p', {}, t('teacher.cert.help')),
        h('div', { class: 'row' },
          h('label', { class: 'field' }, h('span', {}, t('teacher.cert.teacher')), teacherInput),
          h('label', { class: 'field' }, h('span', {}, t('teacher.cert.school')), schoolInput)),
        certs.length
          ? h('p', {}, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => printCertificates(certs, { teacher: clean(teacherInput.value), school: clean(schoolInput.value, 80) }) }, t('teacher.cert.print', { n: certs.length })))
          : h('p', { class: 'fine' }, t('teacher.cert.none'))));
  }

  render();
  const steps = [1, 2, 3].map((n) => h('div', { class: 'how-card' }, h('h3', {}, t(`teacher.step${n}.t`)), h('p', {}, t(`teacher.step${n}.d`))));
  return {
    el: h('div', { class: 'stack' },
      h('section', { class: 'hero' }, h('h1', {}, t('teacher.title')), h('p', { class: 'lead' }, t('teacher.intro'))),
      h('div', { class: 'how' }, steps),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => file.click() }, t('teacher.upload')), file),
      status, results),
  };
}
