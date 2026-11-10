# Beatscript

Learn to code by making music and art, free, in your browser.

Beatscript is an open-source learning platform for teenagers and adults.
Write a few lines of code and instantly hear a melody or see a drawing.
No account, no install, no tracking.

Live demo: https://beatscript.labupgrade.ai

## Why

Most coding tutorials start with abstract exercises. Beatscript teaches
programming through sound and visuals, and is built to run on low-end phones
and old laptops, so it is usable in schools with little equipment.

## Features

- Live code editor with instant sound and drawing
- Guided track "Music with code" (5 lessons so far)
- Share your creation with a link (the code lives in the link itself)
- Lessons are plain JSON files, easy for teachers to add
- Your code runs in a sandboxed frame, isolated from the page
- Progress and edits stay in your browser; nothing is sent to a server

## Run locally

The site is static files. Serve the folder with any web server:

    python -m http.server 8080

then open http://localhost:8080 . (Opening index.html directly will not
work, because lessons are loaded with fetch.)

## Project structure

    index.html          page
    css/style.css       styles
    js/app.js           lessons, editor, sharing
    js/runner.js        sandboxed runner (sound and drawing commands)
    lessons/            lesson files (index.json lists them in order)

## Commands available in lessons

    note(pitch, when, length)   play a note, e.g. note('C4', 0.5)
    freq(name)                  frequency of a note name
    circle(x, y, size, color)   draw a circle
    rect(x, y, w, h, color)     draw a rectangle
    text(words, x, y, color, size)
    clear(color)                fill the stage
    after(seconds, function)    run something later

## Roadmap

- More tracks: drawing with code, audio-visual games
- Interface in Romanian and Russian
- Lesson tools for teachers
- Accessibility audit

## Contributing

Lessons, translations and bug reports are welcome. See CONTRIBUTING.md.

## License

AGPL-3.0, see LICENSE.
