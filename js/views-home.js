import { h, icon } from './dom.js';
import { t, pick } from './i18n.js';
import { DOMAINS, LANGUAGES, LANGUAGE_ORDER, LEVELS } from './content.js';
import { getPref, setPref } from './store.js';
import { COURSES } from './courses/index.js';
import { lessonDone } from './learn-store.js';
import { nextStep } from './views-learn.js';

export function createView() {
  let age = getPref('age', 'kids');

  const chips = LEVELS.map((level) => h('button', {
    type: 'button',
    class: 'chip' + (level === age ? ' is-on' : ''),
    'aria-pressed': String(level === age),
    onclick: () => {
      age = level;
      setPref('age', level);
      chips.forEach((c, i) => {
        const on = LEVELS[i] === level;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
    },
  }, t('home.age.' + level)));

  const domainCards = DOMAINS.map((d) => h('a', { class: 'domain-card', href: '#/d/' + d.id, style: 'background:' + d.color },
    h('span', { class: 'domain-card__icon' }, icon(d.icon, 36)),
    h('span', { class: 'domain-card__text' },
      h('span', { class: 'domain-card__title' }, pick(d.title)),
      h('span', { class: 'domain-card__blurb' }, pick(d.blurb)))));

  const langCards = LANGUAGE_ORDER.map((key) => h('div', { class: 'lang-card' },
    h('span', { class: 'lang-card__name' }, LANGUAGES[key].name),
    h('span', { class: 'lang-card__desc' }, t('lang.desc.' + key)),
    h('span', { class: 'lang-card__where' }, t('where.' + LANGUAGES[key].where))));

  const el = h('div', { class: 'stack-lg' },
    h('section', { class: 'hero' },
      h('h1', {}, t('create.title')),
      h('p', { class: 'lead' }, t('create.sub')),
      h('div', { class: 'chips', role: 'group', 'aria-label': t('home.age.label') },
        h('span', { class: 'chips__label' }, t('home.age.label')), chips)),
    h('section', { id: 'domenii', 'aria-labelledby': 'h-domains' },
      h('h2', { id: 'h-domains' }, t('home.domains.title')),
      h('div', { class: 'grid-domains' }, domainCards)),
    h('section', { id: 'limbaje', 'aria-labelledby': 'h-langs' },
      h('h2', { id: 'h-langs' }, t('home.langs.title')),
      h('p', { class: 'lead lead--narrow' }, t('home.langs.sub')),
      h('div', { class: 'grid-langs' }, langCards)),
    h('p', { class: 'fine' }, t('home.privacy')));

  return { el };
}

export function homeView() {
  // "Continue where you left off": the first course that has progress and something left to do.
  const resume = COURSES.map((c) => ({ c, step: c.levels.length ? nextStep(c) : null }))
    .find(({ c, step }) => step && c.levels.flatMap((l) => l.lessons).some((l) => lessonDone(l.id)));

  const flow = [1, 2, 3, 4].map((n) => h('div', { class: 'how-card' },
    h('h3', {}, t(`home2.flow.${n}.t`)),
    h('p', {}, t(`home2.flow.${n}.d`))));

  const el = h('div', { class: 'stack-lg' },
    h('section', { class: 'hero' },
      h('h1', {}, t('home2.title')),
      h('p', { class: 'lead' }, t('home2.sub')),
      resume ? h('p', {}, h('a', { class: 'btn btn--lg', href: resume.step.href }, t('home2.continue') + ' (' + LANGUAGES[resume.c.lang].name + ') ›')) : null),
    h('section', { class: 'grid-two', 'aria-label': t('home2.title') },
      h('a', { class: 'big-choice big-choice--learn', href: '#/learn' },
        h('span', { class: 'big-choice__icon' }, icon('book', 44)),
        h('span', { class: 'big-choice__title' }, t('home2.learn.t')),
        h('span', { class: 'big-choice__desc' }, t('home2.learn.d'))),
      h('a', { class: 'big-choice big-choice--create', href: '#/create' },
        h('span', { class: 'big-choice__icon' }, icon('shapes', 44)),
        h('span', { class: 'big-choice__title' }, t('home2.create.t')),
        h('span', { class: 'big-choice__desc' }, t('home2.create.d')))),
    h('section', { 'aria-labelledby': 'h-flow' },
      h('h2', { id: 'h-flow' }, t('home2.flow.title')),
      h('div', { class: 'how' }, flow)),
    h('p', { class: 'fine' }, t('home.privacy')));
  return { el };
}
