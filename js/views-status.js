// Diagnostics for the code runner (#/status). Not in the menu: it is a tool for whoever deploys the site.
import { h, icon, inline } from './dom.js';
import { t } from './i18n.js';
import { config } from './config.js';
import { LANGUAGES } from './content.js';
import { refreshServer, runRemote, server } from './remote.js';

const SERVER_LANGS = ['php', 'java', 'cpp'];
const PROBES = {
  php: { code: '<?php\necho "probe-ok";\n', marker: 'probe-ok' },
  java: { code: 'public class Main {\n  public static void main(String[] a) {\n    System.out.println("probe-ok");\n  }\n}\n', marker: 'probe-ok' },
  cpp: { code: '#include <iostream>\nint main() {\n  std::cout << "probe-ok" << std::endl;\n  return 0;\n}\n', marker: 'probe-ok' },
};
const ERRORS = { rate: 'ws.rate', busy: 'ws.busy', too_large: 'ws.tooBig', net: 'ws.netError', runner_down: 'ws.serverDown' };

export function statusView() {
  const list = h('ol', { class: 'srows' });
  const summary = h('p', { class: 'lead', role: 'status', 'aria-live': 'polite' });
  const btn = h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => check() }, t('status.check'));

  function row(state, title, detail) {
    const mark = { ok: '✓', bad: '✗', skip: '–', work: '…' }[state];
    const li = h('li', { class: 'srow is-' + state },
      h('span', { class: 'srow__mark', 'aria-hidden': 'true' }, mark),
      h('div', {}, h('strong', {}, title), detail ? inline(h('p', { class: 'srow__detail' }), detail) : null));
    list.append(li);
    return li;
  }

  async function check() {
    if (!config.runnerUrl) {
      list.replaceChildren(); summary.textContent = t('status.notConfigured');
      return { ok: false };
    }
    btn.disabled = true; btn.textContent = t('status.checking');
    list.replaceChildren(); summary.textContent = '';
    await refreshServer();

    // 1. gateway reachable
    if (!server.reachable) {
      row('bad', t('status.s1'), t('status.h.unreachable', { err: server.error || '?' }));
      ['s2', 's3', 's4'].forEach((k) => row('skip', t('status.' + k), t('status.skipped')));
      summary.textContent = t('status.some', { langs: SERVER_LANGS.map((l) => LANGUAGES[l].name).join(', ') });
      btn.disabled = false; btn.textContent = t('status.check');
      return { ok: false };
    }
    row('ok', t('status.s1'), t('status.runner', { url: config.runnerUrl }));

    // 2. Piston answers
    if (!server.pistonUp) {
      row('bad', t('status.s2'), t('status.h.piston'));
      ['s3', 's4'].forEach((k) => row('skip', t('status.' + k), t('status.skipped')));
      summary.textContent = t('status.some', { langs: SERVER_LANGS.map((l) => LANGUAGES[l].name).join(', ') });
      btn.disabled = false; btn.textContent = t('status.check');
      return { ok: false };
    }
    row('ok', t('status.s2'));

    // 3. languages installed
    const missing = SERVER_LANGS.filter((l) => !server.languages.includes(l));
    const installedLines = SERVER_LANGS.map((l) => (server.languages.includes(l) ? t('status.langOk', { name: LANGUAGES[l].name }) : t('status.langMissing', { name: LANGUAGES[l].name })));
    row(missing.length ? 'bad' : 'ok', t('status.s3'), installedLines.join(' · ') + (missing.length ? ' ' + t('status.h.noLang', { langs: missing.map((l) => LANGUAGES[l].name).join(', ') }) : ''));

    // 4. a real program in every installed language
    const failed = [...missing];
    for (const lang of SERVER_LANGS.filter((l) => server.languages.includes(l))) {
      const name = LANGUAGES[lang].name;
      const pending = row('work', t('status.s4') + ': ' + name);
      const started = performance.now();
      const res = await runRemote(lang, PROBES[lang].code);
      const ms = Math.round(performance.now() - started);
      pending.remove();
      const good = !res.error && res.phase !== 'compile' && res.ok && String(res.stdout || '').includes(PROBES[lang].marker);
      if (good) row('ok', t('status.probeOk', { name, ms }));
      else {
        failed.push(lang);
        const why = res.error ? t(ERRORS[res.error] || 'ws.serverDown') : (res.output || res.stderr || res.stdout || '').toString().trim().slice(0, 300);
        row('bad', t('status.probeBad', { name, msg: '' }), why);
      }
    }
    summary.textContent = failed.length ? t('status.some', { langs: [...new Set(failed)].map((l) => LANGUAGES[l].name).join(', ') }) : t('status.all');
    btn.disabled = false; btn.textContent = t('status.check');
    return { ok: !failed.length };
  }

  return {
    el: h('div', { class: 'stack' },
      h('section', { class: 'hero' }, h('h1', {}, t('status.title')), h('p', { class: 'lead' }, t('status.intro')),
        h('p', { class: 'fine' }, t('status.runner', { url: config.runnerUrl }))),
      h('div', { class: 'row' }, btn),
      list, summary),
  };
}
