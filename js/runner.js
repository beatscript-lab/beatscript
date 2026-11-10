// Builds the HTML documents that run learner code in the browser.
// They are always shown inside <iframe sandbox="allow-scripts"> (no allow-same-origin),
// so the code cannot touch the Beatscript page, cookies or storage.
//
// No eval / new Function is used anywhere: the learner's code is placed in its own inline
// <script>, so this also works on servers whose Content-Security-Policy forbids 'unsafe-eval'.

import { frameCheckScript } from './checks.js';

const BASE_STYLE = 'html,body{margin:0}body{padding:16px;font:18px/1.5 Georgia,"Times New Roman",serif;color:#1b1d22;background:#fff}';

function pageDoc(bodyHtml, checkScript) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<style>' + BASE_STYLE + '</style></head><body>' + bodyHtml + (checkScript || '') + '</body></html>';
}

// checks: optional list of frame-side checks (see checks.js, frameList) evaluated after the code ran.
export function buildDoc({ lang, code, view, scaffold, checks }) {
  const checkScript = frameCheckScript(checks);
  if (lang === 'html') return pageDoc(String(code), checkScript);
  if (lang === 'css') {
    const css = String(code).replace(/<\/style/gi, '<\\/style');
    return pageDoc('<style>' + css + '</style>' + (scaffold || ''), checkScript);
  }
  return jsDoc(String(code), view === 'text' ? 'text' : 'canvas', checkScript);
}

function jsDoc(source, view, checkScript) {
  // Keep the learner's code from closing the script tag or opening an HTML comment.
  const safe = source.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; height: 100%; background: ${view === 'text' ? '#F1F3FC' : '#0b0a1a'}; }
  canvas { display: ${view === 'canvas' ? 'block' : 'none'}; width: 100%; height: 100%; object-fit: contain; }
  #out { display: ${view === 'text' ? 'block' : 'none'}; margin: 0; padding: 20px 24px; white-space: pre-wrap;
         font: 500 18px/1.6 ui-monospace, "Cascadia Code", Menlo, Consolas, monospace; color: #161B3D; }
  #tip { position: fixed; left: 0; right: 0; bottom: 8px; text-align: center;
         font: 13px system-ui, sans-serif; color: #a9a5d1; }
</style></head>
<body>
<canvas id="c" width="500" height="400"></canvas>
<pre id="out"></pre>
<div id="tip" hidden>Click here to turn on sound</div>
<script>
(function () {
  var canvas = document.getElementById('c');
  var g = canvas.getContext('2d');
  var out = document.getElementById('out');
  var tip = document.getElementById('tip');
  var audio = null;

  function report(message) { parent.postMessage({ type: 'error', message: message }, '*'); }

  function getAudio() {
    if (audio) return audio;
    audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state !== 'running') {
      tip.hidden = false;
      document.addEventListener('pointerdown', function () {
        audio.resume().then(function () { tip.hidden = true; });
      }, { once: true });
    }
    audio.resume().then(function () { tip.hidden = true; }).catch(function () {});
    return audio;
  }

  var NAMES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

  function freq(name) {
    var m = /^([A-G]#?)(-?\\d)$/.exec(String(name));
    if (!m) throw new Error('Note names look like "C4" or "F#3", not "' + name + '"');
    return 440 * Math.pow(2, (NAMES[m[1]] + (Number(m[2]) - 4) * 12 - 9) / 12);
  }

  function note(pitch, when, length) {
    var f = typeof pitch === 'string' ? freq(pitch) : Number(pitch);
    if (!isFinite(f) || f <= 0) throw new Error('note() needs a note name like "C4" or a number like 440');
    var ctx = getAudio();
    window.__beat.noteCount += 1;
    var start = ctx.currentTime + (Number(when) || 0);
    var len = Number(length) > 0 ? Number(length) : 0.4;
    var osc = ctx.createOscillator();
    var amp = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + len);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + len + 0.05);
  }

  function circle(x, y, size, color) {
    g.fillStyle = color || 'white';
    g.beginPath(); g.arc(x, y, size, 0, Math.PI * 2); g.fill();
  }
  function rect(x, y, w, h, color) { g.fillStyle = color || 'white'; g.fillRect(x, y, w, h); }
  function clear(color) { g.fillStyle = color || '#0b0a1a'; g.fillRect(0, 0, canvas.width, canvas.height); }
  function text(words, x, y, color, size) {
    g.fillStyle = color || 'white';
    g.font = (size || 24) + 'px system-ui, sans-serif';
    g.fillText(String(words), x, y);
  }
  function after(seconds, fn) {
    setTimeout(function () { try { fn(); } catch (e) { report(e.message); } }, (Number(seconds) || 0) * 1000);
  }

  function show(v) {
    if (typeof v === 'string') return v;
    if (v !== null && typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }
  function print() {
    var line = Array.prototype.map.call(arguments, show).join(' ');
    out.textContent += line + '\\n';
  }
  var log = { log: print, info: print, warn: print, error: print };

  window.__beat = { noteCount: 0, note: note, freq: freq, circle: circle, rect: rect, clear: clear, text: text, after: after, print: print, console: log };
  window.addEventListener('error', function (e) {
    report(String(e.message || 'Something went wrong').replace(/^Uncaught\\s+/, ''));
  });
  clear();
})();
<\/script>
<script>
(function (note, freq, circle, rect, clear, text, after, print, console) {
${safe}
})(__beat.note, __beat.freq, __beat.circle, __beat.rect, __beat.clear, __beat.text, __beat.after, __beat.print, __beat.console);
<\/script>
<script>parent.postMessage({ type: 'done', output: document.getElementById('out').textContent }, '*');<\/script>
${checkScript || ''}
</body></html>`;
}
