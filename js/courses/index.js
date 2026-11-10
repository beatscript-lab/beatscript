import { L } from './kit.js';
import { htmlCourse } from './html.js';
import { cssCourse } from './css.js';
import { jsCourse } from './js.js';

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
