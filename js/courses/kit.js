// Small helpers for writing course content. Text is { ro, en }; Russian falls back to English until it is translated.
export const L = (ro, en) => ({ ro, en });

// A check shown to the learner: props say what to verify, label says what it means, fail says what to do.
export const chk = (props, label, fail) => ({ ...props, label, fail });

export const read = (title, body, demo) => ({ type: 'read', title, body, demo });
export const tryIt = (title, body, demo) => ({ type: 'try', title, body, demo });
export const quiz = (q, options, correct, why) => ({ type: 'quiz', q, options, correct, why });

// Test questions (each lesson has two variants: a first one and a different one for the retry).
export const choice = (q, options, correct, why, code) => ({ type: 'choice', q, options, correct, why, code });
export const fill = (q, answers, why, code) => ({ type: 'fill', q, answers, why, code });
