# Beatscript

Learn to code by creating, free, in your browser.

Beatscript is an open-source learning platform for children, teenagers and adults.
Pick something you want to make (music, art, games, science, stories, maths), then
write the code that makes it. The same project can be written in several programming
languages, so learners move from the simplest one to the next without starting over.

Live site: https://beatscript.labupgrade.ai

## What it does

- **A guided course for complete beginners.** Each level has 5 lessons. Every lesson is
  short interactive explanations (you change the code and see the result at once), then
  a quick question, then a practice exercise that is checked automatically, with hints.
  After 5 lessons there is a level test. If you miss something, you get an explanation
  of the mistake, a new practice exercise with a *different* example, and a mini test on
  just the missed ideas. Only then does the next level unlock.

- **Topics, not just languages.** Six topics so far; adding one is a few lines of data.
- **Six languages.** HTML, CSS and JavaScript run in the browser. PHP, Java and C++
  run on a separate, isolated server (see `runner/`).
- **Same project, many languages.** A lesson can offer several versions of the same program.
- **Friendly for children.** Large controls, short plain-language text, stars for progress.
- **Three languages everywhere.** Interface, lessons, exercises and tests are in Romanian, English and Russian.
- **Private.** No account, no tracking, no external fonts or scripts. Progress and edits
  stay in the browser (localStorage). Shared projects live inside the link itself.
- **Safe by design.** Browser code runs in a sandboxed frame with no access to the page;
  server code runs in a disposable sandbox with time, memory and rate limits.

## Run locally

The site is plain static files, with no build step. Serve the folder with any web server:

    python -m http.server 8080

then open http://localhost:8080 . Opening `index.html` directly will not work
(the browser blocks ES modules from `file://`).

PHP, Java and C++ need the runner (see `runner/README.md`). Without it the site still
works and shows that those languages are not available yet.

## Project structure

    index.html               single page, hash routes (#/learn, #/lesson/<id>, #/test/<level>, #/create, #/p/<project>)
    css/style.css            styles
    js/app.js                router and page shell
    js/courses/              the course: kit.js (helpers), html.js, css.js, js.js, index.js
    js/views-learn.js        course map, lesson player, practice, level test and retry loop
    js/codebox.js            editor + Run + result, used by lessons, practice and tests
    js/checks.js             automatic checking of practice exercises
    js/learn-store.js        course progress (this browser only)
    js/content.js            free-creation topics, languages and projects
    js/views-*.js            home, topic and workspace views
    js/runner.js             builds the sandboxed documents for HTML, CSS and JavaScript
    js/remote.js             client for the PHP/Java/C++ runner
    js/i18n.js, js/locales/  interface text in ro, en, ru
    js/store.js              progress and saved code (localStorage)
    js/config.js             address of the runner
    runner/                  isolated code runner (Piston + small gateway) for server languages

## Commands available in browser JavaScript lessons

    note(pitch, when, length)   play a note, e.g. note('C4', 0.5)
    freq(name)                  frequency of a note name
    circle(x, y, size, color)   draw a circle
    rect(x, y, w, h, color)     draw a rectangle
    text(words, x, y, color, size)
    clear(color)                fill the stage
    after(seconds, function)    run something later
    console.log(...)            print text in "text" projects

## Roadmap

- Courses for PHP, Java and C++ (they need the runner), more levels for HTML, CSS and JavaScript
- Syntax highlighting and error line numbers in the editor
- More topics and projects, and a teacher mode (class links, no accounts)
- Self-hosted fonts and a Romanian/Russian accessibility review
- Run learner JavaScript in a Web Worker so an endless loop cannot freeze the tab

## Contributing

Lessons, translations and bug reports are welcome. See CONTRIBUTING.md.

## License

AGPL-3.0, see LICENSE.
