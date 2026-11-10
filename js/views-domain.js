import { h, icon, starsRow } from './dom.js';
import { t, pick } from './i18n.js';
import { domainById, projectsOf, languagesOf, LANGUAGES } from './content.js';
import { getPref, starsFor } from './store.js';

export function notFoundView() {
  return {
    el: h('section', { class: 'stack' },
      h('h1', {}, t('notfound.title')),
      h('p', {}, h('a', { class: 'btn', href: '#/' }, t('notfound.back')))),
  };
}

export function domainView(domainId) {
  const d = domainById(domainId);
  if (!d) return notFoundView();
  const age = getPref('age', 'kids');
  const list = projectsOf(d.id).slice()
    .sort((a, b) => Number(b.levels.includes(age)) - Number(a.levels.includes(age)));

  const cards = list.map((p) => {
    const stars = starsFor(p);
    const mine = p.levels.includes(age);
    return h('a', { class: 'project-card', href: '#/p/' + p.id },
      mine ? h('span', { class: 'badge' }, t('domain.recommended')) : null,
      h('span', { class: 'project-card__title' }, pick(p.title)),
      h('span', { class: 'project-card__sum' }, pick(p.summary)),
      h('span', { class: 'project-card__langs' }, languagesOf(p).map((l) => h('span', { class: 'tag' }, LANGUAGES[l].name))),
      h('span', { class: 'project-card__stars', role: 'img', 'aria-label': t('stars.label', { n: stars }) }, starsRow(stars, 22)));
  });

  const el = h('div', { class: 'stack-lg' },
    h('a', { class: 'back', href: '#/create' }, '‹ ', t('domain.all')),
    h('section', { class: 'domain-head', style: 'background:' + d.color },
      h('span', { class: 'domain-card__icon' }, icon(d.icon, 36)),
      h('div', {},
        h('h1', {}, pick(d.title)),
        h('p', { class: 'lead' }, pick(d.blurb)))),
    h('section', { 'aria-label': t('domain.projects') },
      h('div', { class: 'grid-projects' }, cards)));

  return { el };
}
