// Declarative checks for practice exercises.
//
//  Checked in the page (from the learner's code and the program's printed output):
//    { kind: 'code',   matches: 'regex', flags?, not? }
//    { kind: 'output', equals? | matches? | notEquals? | minLines?, flags? }
//  Checked inside the sandboxed frame (they look at what was really drawn):
//    { kind: 'dom',   selector, min?, max?, text?: 'regex', attr?: { name, matches } }
//    { kind: 'style', selector, prop: 'background-color', equals? | notEquals? | matches? }
//    { kind: 'pixel', x, y, rgb: [r, g, b], tol? }
//    { kind: 'notes', min }
// Every check also has `label` and `fail` (texts shown to the learner).

const FRAME_KINDS = new Set(['dom', 'style', 'pixel', 'notes']);

export const needsFrame = (checks) => (checks || []).some((c) => FRAME_KINDS.has(c.kind));

// The part of the checks that the frame has to evaluate, keeping each check's index.
export const frameList = (checks) =>
  (checks || []).map((c, i) => ({ ...c, i })).filter((c) => FRAME_KINDS.has(c.kind))
    .map(({ label, fail, ...rest }) => rest);

export function evaluate(checks, ctx) {
  const out = (ctx.output || '').replace(/\r/g, '').trim();
  return (checks || []).map((c, i) => {
    let ok = false;
    try {
      if (c.kind === 'code') {
        ok = new RegExp(c.matches, c.flags || '').test(ctx.code || '');
        if (c.not) ok = !ok;
      } else if (c.kind === 'output') {
        if (c.equals !== undefined) ok = out === c.equals;
        else if (c.matches !== undefined) ok = new RegExp(c.matches, c.flags || '').test(out);
        else if (c.notEquals !== undefined) ok = out !== c.notEquals;
        else if (c.minLines !== undefined) ok = out.split('\n').filter((l) => l.trim()).length >= c.minLines;
      } else {
        ok = Boolean(ctx.frame && ctx.frame[i] === true);
      }
    } catch { ok = false; }
    return { label: c.label, fail: c.fail, ok };
  });
}

// Inline script placed after the learner's content, inside the sandboxed frame.
// It runs the frame-side checks and posts { type: 'checks', results: { index: true|false } }.
export function frameCheckScript(list) {
  if (!list || !list.length) return '';
  const json = JSON.stringify(list).replace(/</g, '\\u003c');
  return `<script>
(function () {
  var CHECKS = ${json};
  function any(els, fn) { var hit = false; Array.prototype.forEach.call(els, function (e) { if (fn(e)) hit = true; }); return hit; }
  function test(c) {
    if (c.kind === 'dom') {
      var els = document.querySelectorAll(c.selector);
      if (c.min !== undefined && els.length < c.min) return false;
      if (c.max !== undefined && els.length > c.max) return false;
      if (c.text && !any(els, function (e) { return new RegExp(c.text, 'i').test(e.textContent); })) return false;
      if (c.attr && !any(els, function (e) { return new RegExp(c.attr.matches, 'i').test(e.getAttribute(c.attr.name) || ''); })) return false;
      return true;
    }
    if (c.kind === 'style') {
      var el = document.querySelector(c.selector);
      if (!el) return false;
      var v = getComputedStyle(el).getPropertyValue(c.prop).trim();
      if (c.equals !== undefined) return v === c.equals;
      if (c.notEquals !== undefined) return v !== c.notEquals;
      if (c.matches) return new RegExp(c.matches).test(v);
      return false;
    }
    if (c.kind === 'pixel') {
      var cv = document.getElementById('c');
      var d = cv.getContext('2d').getImageData(c.x, c.y, 1, 1).data, t = c.tol || 12;
      return Math.abs(d[0] - c.rgb[0]) <= t && Math.abs(d[1] - c.rgb[1]) <= t && Math.abs(d[2] - c.rgb[2]) <= t;
    }
    if (c.kind === 'notes') return ((window.__beat && window.__beat.noteCount) || 0) >= c.min;
    return false;
  }
  setTimeout(function () {
    var res = {};
    CHECKS.forEach(function (c) { var ok = false; try { ok = test(c); } catch (e) { ok = false; } res[c.i] = ok; });
    parent.postMessage({ type: 'checks', results: res }, '*');
  }, 150);
})();
<\/script>`;
}
