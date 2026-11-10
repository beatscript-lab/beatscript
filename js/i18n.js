import ro from './locales/ro.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import roLearn from './locales/ro-learn.js';
import enLearn from './locales/en-learn.js';
import ruLearn from './locales/ru-learn.js';
import { getPref, setPref } from './store.js';

const packs = { ro: { ...ro, ...roLearn }, en: { ...en, ...enLearn }, ru: { ...ru, ...ruLearn } };
export const UI_LANGS = ['ro', 'en', 'ru'];
let current = 'ro';

export function initLang() {
  const saved = getPref('lang', null);
  if (saved && packs[saved]) current = saved;
  else {
    const nav = (navigator.language || 'ro').slice(0, 2).toLowerCase();
    current = packs[nav] ? nav : 'ro';
  }
  document.documentElement.lang = current;
}

export const getLang = () => current;

export function setLang(code) {
  if (!packs[code]) return;
  current = code;
  setPref('lang', code);
  document.documentElement.lang = code;
}

export function t(key, vars) {
  let s = packs[current][key] ?? packs.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', String(v));
  return s;
}

// Pick the current language from a {ro, en, ru} object.
// Strings pass through; {ro, en, ru} objects pick the current language, then English, then Romanian.
export const pick = (obj) => (typeof obj === 'string' ? obj : obj ? obj[current] ?? obj.en ?? obj.ro ?? '' : '');
