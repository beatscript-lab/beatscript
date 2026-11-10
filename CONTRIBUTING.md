# Contributing to Beatscript

The easiest way to help is a new project (lesson) or a translation.

## Add a project

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
