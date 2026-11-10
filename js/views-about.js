import { h } from './dom.js';
import { t } from './i18n.js';
import { config } from './config.js';
import { exportAll, importAll, resetAll, getPref, setPref } from './store.js';

export function aboutView() {
  const status = h('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
  const say = (text, bad = false) => { status.textContent = text; status.classList.toggle('is-bad', bad); };

  function download() {
    const blob = new Blob([JSON.stringify(exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'beatscript-progres.json' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say(t('about.exported'));
  }

  const file = h('input', { type: 'file', accept: '.json,application/json', class: 'sr', tabindex: '-1', 'aria-hidden': 'true' });
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    try {
      if (f.size > 2_000_000) throw new Error('big');
      const n = importAll(JSON.parse(await f.text()));
      if (n < 0) throw new Error('bad');
      say(t('about.imported', { n }));
      setTimeout(() => location.reload(), 900);
    } catch { say(t('about.importBad'), true); }
    file.value = '';
  });

  function wipe() {
    if (!window.confirm(t('about.resetConfirm'))) return;
    resetAll();
    say(t('about.resetDone'));
    setTimeout(() => location.reload(), 900);
  }

  const nameInput = h('input', { type: 'text', class: 'fillbox fillbox--wide', maxlength: '60', value: getPref('studentName', ''), 'aria-label': t('about.name.label'), autocomplete: 'off' });
  nameInput.addEventListener('input', () => setPref('studentName', nameInput.value.slice(0, 60)));

  const block = (key, ...extra) => h('section', { class: 'about-block' }, h('h2', {}, t(`about.${key}.t`)), h('p', {}, t(`about.${key}.d`)), ...extra);

  return {
    el: h('div', { class: 'stack' },
      h('section', { class: 'hero' }, h('h1', {}, t('about.title'))),
      h('div', { class: 'about' },
        block('what'),
        block('state'),
        block('privacy'),
        block('made'),
        block('open', h('p', {}, h('a', { class: 'btn', href: config.repoUrl }, t('about.open.link')))),
        block('feedback', h('p', {}, h('a', { class: 'btn btn--primary', href: config.feedbackUrl }, t('beta.feedback')))),
        block('name', h('p', {}, nameInput)),
        block('progress',
          h('div', { class: 'row' },
            h('button', { type: 'button', class: 'btn btn--lg', onclick: download }, t('about.export')),
            h('button', { type: 'button', class: 'btn btn--lg', onclick: () => file.click() }, t('about.import')),
            h('button', { type: 'button', class: 'btn btn--lg btn--danger', onclick: wipe }, t('about.reset')),
            file),
          status))),
  };
}
