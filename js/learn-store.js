// Course progress, kept in this browser only.
import { getPref, setPref } from './store.js';

const KEY = 'learn';
const all = () => getPref(KEY, { lessons: {}, levels: {} });
const save = (v) => setPref(KEY, v);

export const lessonDone = (id) => Boolean(all().lessons[id]);
export function markLessonDone(id) { const a = all(); a.lessons[id] = true; save(a); }

// Level state: { passed, round, phase: 'idle'|'review'|'practice'|'minitest', missed: [conceptId], practiced: [conceptId] }
const blank = () => ({ passed: false, round: 0, phase: 'idle', missed: [], practiced: [] });
export const levelState = (id) => ({ ...blank(), ...(all().levels[id] || {}) });
export function setLevelState(id, patch) {
  const a = all();
  a.levels[id] = { ...blank(), ...(a.levels[id] || {}), ...patch };
  save(a);
}
export function resetLearnProgress() { save({ lessons: {}, levels: {} }); }
