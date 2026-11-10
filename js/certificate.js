// Printable certificates. Built in the page and printed with the browser's own print dialog
// (which can also save as PDF). Nothing is uploaded anywhere.
import { h, logoMark } from './dom.js';
import { t, getLang } from './i18n.js';

export function certificateEl({ name, course, level, teacher, school, date }) {
  const when = date || new Date().toLocaleDateString(getLang(), { year: 'numeric', month: 'long', day: 'numeric' });
  return h('section', { class: 'cert' },
    h('div', { class: 'cert__frame' },
      h('div', { class: 'cert__brand' }, logoMark(34), h('span', {}, 'Beatscript')),
      h('h1', {}, t('cert.title')),
      h('p', { class: 'cert__name' }, name),
      h('p', { class: 'cert__text' }, t('cert.text', { name: '', level, course }).replace(/^\s+/, '')),
      h('div', { class: 'cert__foot' },
        h('span', {}, t('cert.date', { date: when })),
        teacher ? h('span', {}, t('cert.teacher', { name: teacher })) : null,
        school ? h('span', {}, school) : null),
      h('p', { class: 'cert__tag' }, t('cert.brand'))));
}

export function printCertificates(items, opts = {}) {
  let area = document.querySelector('.print-area');
  if (!area) { area = h('div', { class: 'print-area' }); document.body.append(area); }
  area.replaceChildren(...items.map((it) => certificateEl({ ...it, teacher: opts.teacher, school: opts.school })));
  const clean = () => { area.replaceChildren(); window.removeEventListener('afterprint', clean); };
  window.addEventListener('afterprint', clean);
  window.print();
}
