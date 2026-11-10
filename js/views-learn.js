import { h, icon, inline } from './dom.js';
import { t, pick } from './i18n.js';
import { LANGUAGES } from './content.js';
import { COURSES, courseById, findLesson, findLevel } from './courses/index.js';
import { createCodeBox } from './codebox.js';
import { lessonDone, markLessonDone, levelState, setLevelState } from './learn-store.js';
import { notFoundView } from './views-domain.js';
import { getPref, setPref } from './store.js';
import { printCertificates } from './certificate.js';

const LEVEL_SIZE = 5;
const viewOf = (course) => (course.lang === 'js' ? 'text' : 'page');
const variantFor = (round, n) => round % n;
const norm = (s) => String(s).trim().replace(/\s+/g, ' ').toLowerCase();
const shuffle = (list) => { const a = list.map((v, i) => ({ v, i })); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const P = (text) => inline(h('p', {}), pick(text));

/* ---------- status helpers ---------- */
function levelUnlocked(course, levelIndex) {
  return levelIndex === 0 || levelState(course.levels[levelIndex - 1].id).passed;
}
function lessonUnlocked(course, levelIndex, level, lessonIndex) {
  if (!levelUnlocked(course, levelIndex)) return false;
  return lessonIndex === 0 || lessonDone(level.lessons[lessonIndex - 1].id);
}
const allLessonsDone = (level) => level.lessons.every((l) => lessonDone(l.id));
function courseProgress(course) {
  const done = course.levels.flatMap((l) => l.lessons).filter((l) => lessonDone(l.id)).length;
  const total = course.levels.flatMap((l) => l.lessons).length;
  return { done, total };
}
// The next thing to do in a course: { href, label key }.
export function nextStep(course) {
  for (let li = 0; li < course.levels.length; li++) {
    const level = course.levels[li];
    if (!levelUnlocked(course, li) || levelState(level.id).passed) continue;
    const idx = level.lessons.findIndex((l) => !lessonDone(l.id));
    if (idx >= 0) return { href: `#/lesson/${level.lessons[idx].id}`, started: idx > 0 || li > 0 };
    return { href: `#/test/${level.id}`, started: true };
  }
  return null;
}

/* ---------- learn index ---------- */
export function learnIndexView() {
  const cards = COURSES.map((course) => {
    const ready = course.levels.length > 0;
    const { done, total } = courseProgress(course);
    const step = ready ? nextStep(course) : null;
    const lang = LANGUAGES[course.lang];
    return h('article', { class: 'course-card' + (ready ? '' : ' is-soon') },
      course.id === 'html' ? h('span', { class: 'badge' }, t('learn.recommended')) : null,
      h('h2', {}, lang.name),
      h('p', { class: 'course-card__title' }, pick(course.title)),
      ready ? h('p', { class: 'course-card__blurb' }, pick(course.blurb)) : null,
      ready ? h('p', { class: 'fine' }, t('learn.progress', { n: done, m: total })) : h('p', { class: 'fine' }, t('learn.soon')),
      ready ? h('a', { class: 'btn btn--primary btn--lg', href: '#/learn/' + course.id }, done > 0 ? t('learn.continue') : t('learn.start')) : null);
  });
  return {
    el: h('div', { class: 'stack-lg' },
      h('section', { class: 'hero' }, h('h1', {}, t('learn.title')), h('p', { class: 'lead' }, t('learn.sub'))),
      h('section', {}, h('div', { class: 'grid-courses' }, cards))),
  };
}

/* ---------- course map ---------- */
export function courseView(courseId) {
  const course = courseById(courseId);
  if (!course || !course.levels.length) return notFoundView();

  const levels = course.levels.map((level, li) => {
    const unlocked = levelUnlocked(course, li);
    const state = levelState(level.id);
    const next = level.lessons.findIndex((l) => !lessonDone(l.id));
    const rows = level.lessons.map((lesson, i) => {
      const done = lessonDone(lesson.id);
      const open = lessonUnlocked(course, li, level, i);
      const current = open && !done && i === next;
      const inner = [
        h('span', { class: 'lrow__n' + (done ? ' is-done' : '') }, done ? icon('check', 18, { 'stroke-width': '3' }) : String(i + 1)),
        h('span', { class: 'lrow__t' }, pick(lesson.title), open ? null : h('small', {}, t('learn.locked'))),
        current ? h('span', { class: 'badge' }, t('learn.continue')) : null,
      ];
      return h('li', {}, open
        ? h('a', { class: 'lrow' + (current ? ' is-current' : ''), href: '#/lesson/' + lesson.id }, inner)
        : h('span', { class: 'lrow is-locked' }, inner));
    });

    const testReady = unlocked && allLessonsDone(level);
    const testRow = h('li', {}, state.passed
      ? h('a', { class: 'lrow is-test', href: '#/test/' + level.id }, h('span', { class: 'lrow__n is-done' }, icon('check', 18, { 'stroke-width': '3' })), h('span', { class: 'lrow__t' }, t('learn.test'), h('small', {}, t('learn.passed'))))
      : testReady
        ? h('a', { class: 'lrow is-test is-current', href: '#/test/' + level.id }, h('span', { class: 'lrow__n' }, '★'), h('span', { class: 'lrow__t' }, t('learn.test'), h('small', {}, state.phase === 'idle' ? t('learn.testOpen') : t('learn.testResume'))))
        : h('span', { class: 'lrow is-test is-locked' }, h('span', { class: 'lrow__n' }, '★'), h('span', { class: 'lrow__t' }, t('learn.test'), h('small', {}, t('learn.testLocked')))));

    return h('section', { class: 'level-card' + (unlocked ? '' : ' is-locked') },
      h('div', { class: 'level-card__head' },
        h('p', { class: 'level-card__n' }, t('learn.level', { n: li + 1 })),
        h('h2', {}, pick(level.title)),
        state.passed ? h('span', { class: 'badge' }, t('learn.passed')) : null,
        !unlocked ? h('p', { class: 'fine' }, t('learn.levelLocked')) : null),
      h('ol', { class: 'lrows' }, rows, testRow));
  });

  return {
    el: h('div', { class: 'stack' },
      h('a', { class: 'back', href: '#/learn' }, '‹ ', t('learn.back')),
      h('section', { class: 'hero' }, h('h1', {}, pick(course.title)), h('p', { class: 'lead' }, pick(course.blurb))),
      levels),
  };
}

/* ---------- quiz building blocks (used in lessons and tests) ---------- */
// Renders one choice question. onAnswer(index, isCorrect) is called each time the learner picks.
function choiceBlock(q, { onAnswer, lockAfterCorrect = true }) {
  const shuffled = shuffle(q.options);
  const feedback = h('p', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  const buttons = shuffled.map(({ v, i }) => {
    const btn = h('button', { type: 'button', class: 'choice', onclick: () => {
      const right = i === q.correct;
      btn.classList.add(right ? 'is-right' : 'is-wrong');
      if (right && lockAfterCorrect) buttons.forEach((b) => { b.disabled = true; });
      else if (!right) btn.disabled = true;
      onAnswer(i, right, feedback);
    } });
    inline(btn, pick(v));
    return btn;
  });
  return { el: h('div', { class: 'choices' }, buttons, feedback), buttons };
}

/* ---------- practice block ---------- */
function practiceBlock(practice, course, { onPass, extraBottom }) {
  const lang = course.lang;
  const view = viewOf(course);
  const checkEls = practice.checks.map((c) => h('li', { class: 'check' },
    h('span', { class: 'check__mark', 'aria-hidden': 'true' }, '○'),
    h('span', {}, inline(h('span', {}), pick(c.label)))));
  const feedback = h('div', { class: 'feedback-box', role: 'status', 'aria-live': 'polite', hidden: true });
  const hintBox = h('div', { class: 'hintbox', hidden: true });
  const solutionBtn = h('button', { type: 'button', class: 'btn', hidden: true, onclick: () => {
    box.setCode(pick(practice.solution));
    feedback.hidden = false; feedback.className = 'feedback-box';
    feedback.replaceChildren(h('p', {}, t('pr.solutionShown')));
  } }, t('pr.showSolution'));

  let attempts = 0;
  let solved = false;

  const box = createCodeBox({
    lang, view, scaffold: pick(practice.scaffold), code: pick(practice.code), checks: practice.checks,
    runLabel: t('pr.run'),
    onRun(result) {
      attempts += 1;
      result.checkResults.forEach((r, i) => {
        const mark = checkEls[i].querySelector('.check__mark');
        mark.textContent = r.ok ? '✓' : '✗';
        checkEls[i].classList.toggle('is-ok', r.ok);
        checkEls[i].classList.toggle('is-bad', !r.ok);
      });
      const allOk = result.ok && result.checkResults.every((r) => r.ok);
      feedback.hidden = false;
      if (allOk) {
        feedback.className = 'feedback-box is-great';
        feedback.replaceChildren(h('p', {}, '★ ', t('pr.great')));
        hintBox.hidden = true; solutionBtn.hidden = true;
        if (!solved) { solved = true; onPass(); }
        return;
      }
      feedback.className = 'feedback-box is-almost';
      if (!result.ok) {
        feedback.replaceChildren(h('p', {}, t('pr.oops')));
      } else {
        const firstBad = result.checkResults.find((r) => !r.ok);
        feedback.replaceChildren(h('p', {}, h('strong', {}, t('pr.almost')), ' ', inline(h('span', {}), pick(firstBad.fail))), h('p', { class: 'fine' }, t('pr.again')));
      }
      // hints appear one by one after each failed attempt
      const shown = Math.min(attempts, practice.hints.length);
      if (shown > 0) {
        hintBox.hidden = false;
        hintBox.replaceChildren(...practice.hints.slice(0, shown).map((hint, i) =>
          h('p', {}, h('strong', {}, t('pr.hint', { n: i + 1 }), ': '), inline(h('span', {}), pick(hint)))));
      }
      if (attempts >= 3) solutionBtn.hidden = false;
    },
  });

  const el = h('div', { class: 'practice' },
    h('div', { class: 'goal' }, h('h3', {}, t('pr.goal')), inline(h('p', {}), pick(practice.task))),
    box.el,
    h('div', { class: 'checklist-wrap' }, h('h3', {}, t('pr.checks')), h('ul', { class: 'checklist' }, checkEls)),
    feedback, hintBox, solutionBtn,
    extraBottom || null);
  return { el, destroy: () => box.destroy() };
}

/* ---------- lesson player ---------- */
export function lessonView(lessonId) {
  const found = findLesson(lessonId);
  if (!found) return { el: h('section', { class: 'stack' }, h('h1', {}, t('learn.notFound')), h('a', { class: 'btn', href: '#/learn' }, t('learn.back'))) };
  const { course, level, lesson, index } = found;
  const li = course.levels.indexOf(level);
  if (!lessonUnlocked(course, li, level, index)) {
    return { el: h('section', { class: 'stack' }, h('h1', {}, pick(lesson.title)), h('p', { class: 'lead' }, t('learn.lockedPage')), h('a', { class: 'btn btn--primary btn--lg', href: '#/learn/' + course.id }, t('learn.toCourse'))) };
  }

  const view = viewOf(course);
  const total = lesson.steps.length + 1; // steps + practice
  let at = 0;
  let current = null; // { destroy }
  const body = h('div', { class: 'lp__body' });
  const nav = h('div', { class: 'lp__nav' });
  const bar = h('div', { class: 'progress' }, h('span', { class: 'progress__fill' }));
  const stepLabel = h('p', { class: 'progress__label' });

  const container = h('div', { class: 'stack lp' },
    h('a', { class: 'back', href: '#/learn/' + course.id }, '‹ ', pick(course.title)),
    h('header', { class: 'lp__head' },
      h('p', { class: 'level-card__n' }, t('learn.lessonN', { n: index + 1 }) + ' · ' + pick(level.title)),
      h('h1', {}, pick(lesson.title))),
    h('div', { class: 'progress-wrap' }, bar, stepLabel),
    body, nav);

  function setNav(opts) {
    const { canContinue, label, onContinue, hideContinue } = opts;
    const back = at > 0 ? h('button', { type: 'button', class: 'btn btn--lg', onclick: () => go(at - 1) }, '‹ ', t('lp.back')) : h('span', {});
    const next = hideContinue ? null : h('button', { type: 'button', class: 'btn btn--primary btn--lg', disabled: !canContinue, onclick: onContinue || (() => go(at + 1)) }, label || t('lp.continue'), ' ›');
    nav.replaceChildren(...[back, next].filter(Boolean));
  }
  const enableContinue = () => setNav({ canContinue: true });

  function go(n) {
    at = n;
    if (current) current.destroy();
    current = null;
    bar.firstChild.style.width = `${(at / (total - 1)) * 100}%`;
    stepLabel.textContent = t('lp.step', { n: at + 1, m: total });
    if (at < lesson.steps.length) renderStep(lesson.steps[at]);
    else renderPractice();
    window.scrollTo({ top: 0 });
  }

  function demoBox(step, readOnly, onRun) {
    const demo = step.demo;
    const box = createCodeBox({
      lang: course.lang, view, scaffold: pick(demo.scaffold), code: pick(demo.code),
      readOnly, autoRun: false, runLabel: t('ws.run'), onRun,
    });
    current = { destroy: () => box.destroy() };
    return box;
  }

  function renderStep(step) {
    if (step.type === 'read') {
      body.replaceChildren(
        h('h2', {}, pick(step.title)),
        ...step.body.map((p) => P(p)),
        h('h3', {}, t('lp.example')),
        h('p', { class: 'fine' }, t('lp.runNeed')),
        demoBox(step, true, (r) => { if (r.ok) enableContinue(); }).el);
      setNav({ canContinue: false });
    } else if (step.type === 'try') {
      const done = h('p', { class: 'feedback is-good', hidden: true }, '✓ ', t('lp.tryDone'));
      body.replaceChildren(
        h('h2', {}, pick(step.title)),
        P(step.body),
        h('p', { class: 'fine' }, t('lp.tryNeed')),
        demoBox(step, false, (r) => { if (r.ok && r.changed) { done.hidden = false; enableContinue(); } }).el,
        done);
      setNav({ canContinue: false });
    } else if (step.type === 'quiz') {
      let wrong = 0;
      const why = h('p', { class: 'why', hidden: true });
      const block = choiceBlock(step, {
        onAnswer(_, right, fb) {
          if (right) {
            fb.className = 'feedback is-good'; fb.textContent = '✓ ' + t('lp.right');
            why.hidden = false; why.replaceChildren(); inline(why, pick(step.why));
            enableContinue();
          } else {
            wrong += 1;
            fb.className = 'feedback is-bad'; fb.textContent = t('lp.wrong') + ' ' + t('lp.tryAgainQ');
            if (wrong >= 2) { why.hidden = false; why.replaceChildren(); inline(why, pick(step.why)); }
          }
        },
      });
      body.replaceChildren(h('h2', {}, t('lp.quizTitle')), inline(h('p', { class: 'qtext' }), pick(step.q)), block.el, why);
      setNav({ canContinue: false });
    }
  }

  function renderPractice() {
    const completion = h('div', { class: 'done-panel', hidden: true });
    const pr = practiceBlock(lesson.practice[0], course, {
      onPass() {
        markLessonDone(lesson.id);
        const last = index === level.lessons.length - 1;
        completion.hidden = false;
        completion.replaceChildren(
          h('h2', {}, '★ ', t('lp.lessonDone')), h('p', {}, t('lp.lessonDoneD')),
          h('div', { class: 'row' },
            last
              ? h('a', { class: 'btn btn--primary btn--lg', href: '#/test/' + level.id }, t('lp.toTest'))
              : h('a', { class: 'btn btn--primary btn--lg', href: '#/lesson/' + level.lessons[index + 1].id }, t('lp.nextLesson'), ' ›'),
            h('a', { class: 'btn btn--lg', href: '#/learn/' + course.id }, t('lp.toCourse'))));
        completion.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      extraBottom: completion,
    });
    current = { destroy: () => pr.destroy() };
    body.replaceChildren(h('h2', {}, t('lp.practiceTitle')), pr.el);
    setNav({ hideContinue: true });
  }

  go(0);
  return { el: container, destroy() { if (current) current.destroy(); } };
}

/* ---------- level test ---------- */
// Runs a list of questions one by one. onDone(results) where each result is
// { concept, v, correct, answer, correctText }.
function questionRunner(items, onDone) {
  let i = 0;
  const results = [];
  const root = h('div', { class: 'qrun' });

  function show() {
    const item = items[i];
    const q = item.q;
    let picked = null; // for choice: original index; for fill: text
    const next = h('button', { type: 'button', class: 'btn btn--primary btn--lg', disabled: true, onclick: submit },
      i === items.length - 1 ? t('ts.finish') : t('ts.next'), ' ›');
    const answerArea = h('div', { class: 'answer-area' });

    if (q.type === 'choice') {
      const shuffled = shuffle(q.options);
      const buttons = shuffled.map(({ v, i: orig }) => {
        const btn = h('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', onclick: () => {
          picked = orig; next.disabled = false;
          buttons.forEach((b) => { b.classList.remove('is-picked'); b.setAttribute('aria-pressed', 'false'); });
          btn.classList.add('is-picked'); btn.setAttribute('aria-pressed', 'true');
        } });
        inline(btn, pick(v));
        return btn;
      });
      answerArea.append(h('div', { class: 'choices' }, buttons));
    } else {
      const input = h('input', { type: 'text', class: 'fillbox', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: t('ts.typeHere'), 'aria-label': t('ts.typeHere') });
      input.addEventListener('input', () => { picked = input.value; next.disabled = !input.value.trim(); });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !next.disabled) submit(); });
      answerArea.append(input);
      queueMicrotask(() => input.focus());
    }

    function submit() {
      let correct; let answer; let correctText;
      if (q.type === 'choice') {
        correct = picked === q.correct;
        answer = pick(q.options[picked]);
        correctText = pick(q.options[q.correct]);
      } else {
        correct = q.answers.some((a) => norm(a) === norm(picked));
        answer = String(picked).trim();
        correctText = q.answers[0];
      }
      results.push({ concept: item.concept, v: item.v, correct, answer, correctText });
      i += 1;
      if (i >= items.length) onDone(results); else show();
    }

    root.replaceChildren(
      h('p', { class: 'progress__label' }, t('ts.question', { n: i + 1, m: items.length })),
      h('div', { class: 'progress' }, h('span', { class: 'progress__fill', style: `width:${(i / items.length) * 100}%` })),
      h('h2', {}, pick(item.concept.name)),
      inline(h('p', { class: 'qtext' }), pick(q.q)),
      q.code ? h('pre', { class: 'qcode' }, pick(q.code)) : null,
      answerArea,
      h('div', { class: 'row' }, next));
  }
  show();
  return root;
}

export function testView(levelId) {
  const found = findLevel(levelId);
  if (!found) return notFoundView();
  const { course, level, index } = found;
  const root = h('div', { class: 'stack' });
  let practiceHandle = null;
  const destroyPractice = () => { if (practiceHandle) practiceHandle.destroy(); practiceHandle = null; };

  if (!levelUnlocked(course, index) || !allLessonsDone(level)) {
    return { el: h('section', { class: 'stack' }, h('h1', {}, t('learn.test')), h('p', { class: 'lead' }, t('learn.testLocked')), h('a', { class: 'btn btn--primary btn--lg', href: '#/learn/' + course.id }, t('learn.toCourse'))) };
  }

  const lessonOf = (conceptId) => level.lessons.find((l) => l.concept.id === conceptId);
  const toCourse = () => h('a', { class: 'btn btn--lg', href: '#/learn/' + course.id }, t('ts.toCourse'));

  function renderPassed() {
    const nextLevel = course.levels[index + 1];
    const nameBox = h('input', { type: 'text', class: 'fillbox fillbox--wide', maxlength: '60', value: getPref('studentName', ''), 'aria-label': t('cert.nameLabel'), autocomplete: 'off' });
    const certMsg = h('p', { class: 'status is-bad', role: 'status', 'aria-live': 'polite' });
    const printMine = () => {
      const name = nameBox.value.trim().slice(0, 60);
      if (!name) { certMsg.textContent = t('cert.needName'); return; }
      certMsg.textContent = '';
      setPref('studentName', name);
      printCertificates([{ name, course: pick(course.title).split(':')[0], level: pick(level.title) }], {});
    };
    root.replaceChildren(h('section', { class: 'done-panel' },
      h('h1', {}, '★ ', t('ts.passTitle')), h('p', { class: 'lead' }, nextLevel ? t('ts.passD') : t('ts.passLast')),
      h('div', { class: 'cert-box' },
        h('h2', {}, t('cert.mine')),
        h('div', { class: 'row' },
          h('label', { class: 'field' }, h('span', {}, t('cert.nameLabel')), nameBox),
          h('button', { type: 'button', class: 'btn btn--lg', onclick: printMine }, t('cert.print'))),
        certMsg),
      h('div', { class: 'row' },
        nextLevel ? h('a', { class: 'btn btn--primary btn--lg', href: '#/lesson/' + nextLevel.lessons[0].id }, t('ts.nextLevel'), ' ›') : null,
        toCourse())));
  }

  function finishRound(results) {
    const wrong = results.filter((r) => !r.correct);
    const st = levelState(level.id);
    if (!wrong.length) {
      setLevelState(level.id, { passed: true, phase: 'idle', wrong: [], practiced: [] });
      render();
      return;
    }
    setLevelState(level.id, {
      phase: 'review', round: st.round + 1, practiced: [],
      wrong: wrong.map((r) => ({ c: r.concept.id, v: r.v, a: r.answer })),
      total: results.length,
    });
    render();
  }

  function renderIntro() {
    root.replaceChildren(h('section', { class: 'stack' },
      h('h1', {}, t('ts.title')), h('p', { class: 'lead' }, t('ts.intro', { n: level.lessons.length })),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => {
        const items = level.lessons.map((l) => ({ concept: l.concept, q: l.questions[0], v: 0 }));
        root.replaceChildren(h('h1', {}, t('ts.title')), questionRunner(items, finishRound));
      } }, t('ts.start'), ' ›'), toCourse())));
  }

  function renderReview(st) {
    const cards = st.wrong.map((w) => {
      const lesson = lessonOf(w.c);
      const q = lesson.questions[w.v];
      const correctText = q.type === 'choice' ? pick(q.options[q.correct]) : q.answers[0];
      return h('article', { class: 'review-card' },
        h('h3', {}, t('ts.concept', { name: pick(lesson.concept.name) })),
        inline(h('p', { class: 'qtext' }), pick(q.q)),
        q.code ? h('pre', { class: 'qcode' }, pick(q.code)) : null,
        h('p', { class: 'ans is-bad' }, h('strong', {}, t('ts.yourAnswer'), ': '), w.a || t('ts.noAnswer')),
        h('p', { class: 'ans is-good' }, h('strong', {}, t('ts.correctAnswer'), ': '), inline(h('span', {}), correctText)),
        h('p', { class: 'why' }, h('strong', {}, t('ts.why'), ': '), inline(h('span', {}), pick(q.why))),
        h('a', { class: 'btn', href: '#/lesson/' + lesson.id }, t('ts.reread')));
    });
    root.replaceChildren(h('section', { class: 'stack' },
      h('h1', {}, t('ts.missedTitle')),
      h('p', { class: 'lead' }, st.round > 1 ? t('ts.stillMissed', { n: st.wrong.length }) : t('ts.missed', { n: st.wrong.length, m: st.total || level.lessons.length })),
      cards,
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => { setLevelState(level.id, { phase: 'practice', practiced: [] }); render(); } }, t('ts.toPractice'), ' ›'), toCourse())));
  }

  function renderPractice(st) {
    const todo = st.wrong.filter((w) => !st.practiced.includes(w.c));
    if (!todo.length) { setLevelState(level.id, { phase: 'minitest' }); render(); return; }
    const w = todo[0];
    const lesson = lessonOf(w.c);
    const practice = lesson.practice[variantFor(st.round, lesson.practice.length)];
    const n = st.wrong.length - todo.length + 1;
    const last = todo.length === 1;
    const after = h('div', { class: 'done-panel', hidden: true });
    practiceHandle = practiceBlock(practice, course, {
      onPass() {
        setLevelState(level.id, { practiced: [...st.practiced, w.c] });
        after.hidden = false;
        after.replaceChildren(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => render() }, last ? t('ts.toMini') : t('ts.practiceNext'), ' ›')));
        after.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      extraBottom: after,
    });
    root.replaceChildren(h('section', { class: 'stack' },
      h('p', { class: 'level-card__n' }, t('ts.practiceProgress', { n, m: st.wrong.length })),
      h('h1', {}, t('ts.practiceTitle')),
      h('p', { class: 'lead' }, t('ts.practiceIntro', { name: pick(lesson.concept.name) })),
      practiceHandle.el));
  }

  function renderMini(st) {
    const items = st.wrong.map((w) => {
      const lesson = lessonOf(w.c);
      const v = variantFor(st.round, lesson.questions.length);
      return { concept: lesson.concept, q: lesson.questions[v], v };
    });
    root.replaceChildren(h('section', { class: 'stack' },
      h('h1', {}, t('ts.miniTitle')), h('p', { class: 'lead' }, t('ts.miniIntro')),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn btn--primary btn--lg', onclick: () => {
        root.replaceChildren(h('h1', {}, t('ts.miniTitle')), questionRunner(items, finishRound));
      } }, t('ts.start'), ' ›'))));
  }

  function render() {
    destroyPractice();
    const st = levelState(level.id);
    if (st.passed) return renderPassed();
    if (st.phase === 'review') return renderReview(st);
    if (st.phase === 'practice') return renderPractice(st);
    if (st.phase === 'minitest') return renderMini(st);
    return renderIntro();
  }

  render();
  window.scrollTo({ top: 0 });
  return { el: root, destroy: destroyPractice };
}
