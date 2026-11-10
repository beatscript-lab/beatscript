import { h, icon } from './dom.js';
import { t, pick } from './i18n.js';
import { DOMAINS, LANGUAGES, LANGUAGE_ORDER, LEVELS } from './content.js';
import { getPref, setPref } from './store.js';

export function homeView() {
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

  const how = [1, 2, 3].map((n) => h('div', { class: 'how-card' },
    h('h3', {}, t(`home.how.${n}.t`)),
    h('p', {}, t(`home.how.${n}.d`))));

  const el = h('div', { class: 'stack-lg' },
    h('section', { class: 'hero' },
      h('h1', {}, t('home.title')),
      h('p', { class: 'lead' }, t('home.sub')),
      h('div', { class: 'chips', role: 'group', 'aria-label': t('home.age.label') },
        h('span', { class: 'chips__label' }, t('home.age.label')), chips)),
    h('section', { id: 'domenii', 'aria-labelledby': 'h-domains' },
      h('h2', { id: 'h-domains' }, t('home.domains.title')),
      h('div', { class: 'grid-domains' }, domainCards)),
    h('section', { id: 'limbaje', 'aria-labelledby': 'h-langs' },
      h('h2', { id: 'h-langs' }, t('home.langs.title')),
      h('p', { class: 'lead lead--narrow' }, t('home.langs.sub')),
      h('div', { class: 'grid-langs' }, langCards)),
    h('section', { class: 'how' }, how),
    h('p', { class: 'fine' }, t('home.privacy')));

  return { el };
}
