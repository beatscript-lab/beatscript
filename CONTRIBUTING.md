# Contributing to Beatscript

The easiest way to help is a new project (lesson) or a translation.

## Add or improve a course lesson

Lessons live in `js/courses/` (one file per language). A level has 5 lessons; a lesson looks like:

    {
      id: 'html-1-1',
      concept: { id: 'html-1-tags', name: L('...', '...') },   // the one idea this lesson teaches
      title: L('...', '...'),
      steps: [ read(...), read(...), tryIt(...), quiz(...) ],   // interactive explanations
      practice: [ A, B ],      // two DIFFERENT exercises for the same idea (B is used after a failed test)
      questions: [ QA, QB ],   // two DIFFERENT test questions for the same idea
    }

Rules that keep the course beginner-friendly:

- One idea per lesson. Short sentences. Explain with a small example the learner can change.
- Every lesson needs a `tryIt` step, a `quiz` step, 2 practice exercises and 2 test questions.
- A practice exercise has `checks` that look at what the code really did (see `js/checks.js`)
  and a `fail` message that tells the learner what to do, not just that they are wrong.
- The starting code must not already pass; the `solution` must pass. The browser test in the
  repository checks both for every exercise, in every language you write text for.
- Text is `L('română', 'English')`. The Russian version is looked up by the English text in `js/courses/ru.js`; the browser test fails if any lesson text has no Russian version.
- Examples never run by themselves: the learner presses Run first.

## Add a free-creation project

Open `js/content.js` and add an object to `PROJECTS`:

    {
      id: 'math-example',             // unique, lowercase, dashes
      domain: 'math',                 // music | art | games | science | stories | math
      levels: ['kids', 'teens'],      // who it suits: kids (8-12), teens (13-17), adults (18+)
      title:   L('Română', 'English', 'Русский'),
      summary: L('...', '...', '...'),
      intro:   L('...', '...', '...'),
      task:    L('...', '...', '...'),
      hint:    L('...', '...', '...'),
      variants: {
        js:   { view: 'text', code: String.raw`console.log("hi");` },
        java: { view: 'text', code: String.raw`public class Main { ... }` },
      },
    }

Rules:

- Every text needs all three languages (ro, en, ru).
- `view` is `canvas` (drawing and sound), `text` (printed output) or `page` (HTML/CSS result).
  A CSS variant also needs `scaffold`, the HTML the CSS styles.
- Java code must use `public class Main`.
- Code for PHP, Java and C++ must not contain ă â î ș ț inside strings (server output may break them).
- Use `String.raw` for code so `\n` stays as written.
- Test the project in every language you add, with sound on.

## Add a topic

Add an object to `DOMAINS` (icon names are in `js/dom.js`).

## Translate the interface

Copy `js/locales/en.js`, translate the values, and register the language in `js/i18n.js`.

## Guidelines

- Write for beginners. Short sentences, plain words, one idea per project.
- Every project should end with something the learner can see, hear or read.
- No trackers, ads or external scripts or fonts.
- There is no build step on purpose; keep it that way.

## Reporting problems

Open an issue and say what you expected, what happened, and which browser or device you used.
