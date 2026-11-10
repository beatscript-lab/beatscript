import { L } from './kit.js';
import { htmlCourse } from './html.js';
import { cssCourse } from './css.js';
import { jsCourse } from './js.js';
import { RU } from './ru.js';

// Courses that are not written yet show as "in preparation".
const soon = (id, lang, title) => ({ id, lang, title: L(title, title), blurb: L('', ''), levels: [] });

export const COURSES = [
  htmlCourse,
  cssCourse,
  jsCourse,
  soon('php', 'php', 'PHP'),
  soon('java', 'java', 'Java'),
  soon('cpp', 'cpp', 'C++'),
];

export const courseById = (id) => COURSES.find((c) => c.id === id);
export function findLesson(lessonId) {
  for (const course of COURSES) for (const level of course.levels) {
    const index = level.lessons.findIndex((l) => l.id === lessonId);
    if (index >= 0) return { course, level, lesson: level.lessons[index], index };
  }
  return null;
}
export function findLevel(levelId) {
  for (const course of COURSES) {
    const index = course.levels.findIndex((l) => l.id === levelId);
    if (index >= 0) return { course, level: course.levels[index], index };
  }
  return null;
}

// Add the Russian text to every { ro, en } pair, looked up by its English text (see ru.js).
// Anything without a translation falls back to English, and is listed here so a test can catch it.
export const MISSING_RU = [];
(function addRussian(node) {
  if (Array.isArray(node)) { node.forEach(addRussian); return; }
  if (!node || typeof node !== 'object') return;
  if (typeof node.ro === 'string' && typeof node.en === 'string') {
    if (node.ru === undefined) {
      if (RU[node.en] !== undefined) node.ru = RU[node.en];
      else MISSING_RU.push(node.en);
    }
    return;
  }
  Object.values(node).forEach(addRussian);
})(COURSES);
