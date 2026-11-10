import { h, logoMark } from './dom.js';
import { initLang, setLang, getLang, t, UI_LANGS } from './i18n.js';
import { parseHash } from './util.js';
import { homeView, createView } from './views-home.js';
import { learnIndexView, courseView, lessonView, testView } from './views-learn.js';
import { domainView, notFoundView } from './views-domain.js';
import { workspaceView } from './views-workspace.js';
import { refreshServer } from './remote.js';
import { statusView } from './views-status.js';
import { aboutView } from './views-about.js';
import { teacherView } from './views-teacher.js';
import { config } from './config.js';
import { getPref, setPref } from './store.js';

const root = document.getElementById('app');
let view = null;

function header() {
  const switcher = h('div', { class: 'langswitch', role: 'group', 'aria-label': t('lang.switch') },
    UI_LANGS.map((code) => h('button', {
      type: 'button', class: code === getLang() ? 'is-on' : '', 'aria-pressed': String(code === getLang()),
      onclick: () => { setLang(code); render(); },
    }, code.toUpperCase())));

  return h('header', { class: 'top' },
    h('a', { class: 'brand', href: '#/' }, logoMark(28), 'Beatscript', h('span', { class: 'beta-tag' }, t('beta.badge'))),
    h('nav', { class: 'nav', 'aria-label': 'Menu' },
      h('a', { href: '#/learn' }, t('nav.learn')),
      h('a', { href: '#/create' }, t('nav.create')),
      h('a', { href: '#/teacher' }, t('nav.teachers')),
      h('a', { href: '#/about' }, t('nav.about'))),
    switcher);
}

function render() {
  if (view && view.destroy) view.destroy();
  const { parts, query } = parseHash(location.hash);

  if (parts[0] === 'learn' && parts[1]) view = courseView(parts[1]);
  else if (parts[0] === 'learn') view = learnIndexView();
  else if (parts[0] === 'lesson' && parts[1]) view = lessonView(parts[1]);
  else if (parts[0] === 'test' && parts[1]) view = testView(parts[1]);
  else if (parts[0] === 'create') view = createView();
  else if (parts[0] === 'status') view = statusView();
  else if (parts[0] === 'about') view = aboutView();
  else if (parts[0] === 'teacher') view = teacherView();
  else if (parts[0] === 'd' && parts[1]) view = domainView(parts[1]);
  else if (parts[0] === 'p' && parts[1]) view = workspaceView(parts[1], query);
  else if (parts.length === 0) view = homeView();
  else view = notFoundView();

  document.title = t('meta.title');
  const banner = getPref('betaSeen', false) ? null : h('div', { class: 'beta-banner', role: 'note' },
    h('span', {}, t('beta.banner'), ' ', h('a', { href: config.feedbackUrl }, t('beta.feedback'))),
    h('button', { type: 'button', class: 'btn', onclick: (e) => { setPref('betaSeen', true); e.target.closest('.beta-banner').remove(); } }, t('beta.dismiss')));
  root.replaceChildren(...[
    h('a', { class: 'skip', href: '#main-content', onclick: (e) => { e.preventDefault(); document.getElementById('main-content').focus(); } }, t('skip')),
    header(),
    banner,
    h('main', { id: 'main-content', class: 'page', tabindex: '-1' }, view.el),
    h('footer', { class: 'foot' },
      h('a', { href: '#/about' }, t('foot.about')), ' · ',
      h('a', { href: config.feedbackUrl }, t('foot.feedback')), ' · ',
      h('a', { href: config.repoUrl }, 'GitHub · AGPL-3.0'), ' · ', 'v' + config.version),
  ].filter(Boolean));

  window.scrollTo(0, 0);
}

initLang();
window.addEventListener('hashchange', render);
render();
refreshServer();
