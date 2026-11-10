# Contributing to Beatscript

Thank you for helping! The easiest way to contribute is a new lesson or a translation.

## Add a lesson

1. Create `lessons/<track>-NN-short-name.json`:

       {
         "title": "Short, friendly title",
         "intro": ["First paragraph.", "Second paragraph with `code` in backticks."],
         "task": "What the learner should try.",
         "code": "starter code here",
         "hint": "A nudge, not the full answer."
       }

2. Add its file name (without `.json`) to `lessons/index.json`, in the order learners should see it.
3. Run the site locally (see README) and test the lesson from start to finish, with sound.

## Guidelines

- Write for beginners. Short sentences, plain words, one idea per lesson.
- Every lesson must end with something the learner can see or hear.
- Keep the code you write simple and readable; there is no build step on purpose.
- Do not add trackers, ads or external scripts.

## Reporting problems

Open an issue and say what you expected, what happened, and which browser or device you used.
