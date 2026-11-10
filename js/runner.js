// Builds the HTML document that runs a learner's code inside a sandboxed iframe.
// The iframe has no access to the parent page, cookies or storage (no allow-same-origin).

export function runnerDoc(code) {
  // Embed the code as a JSON string; escape "<" so it can never close the script tag.
  const safeCode = JSON.stringify(String(code)).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin: 0; height: 100%; background: #0b0a1a; }
  canvas { display: block; width: 100%; height: 100%; object-fit: contain; }
  #tip { position: fixed; left: 0; right: 0; bottom: 8px; text-align: center;
         font: 13px system-ui, sans-serif; color: #a9a5d1; }
</style></head>
<body>
<canvas id="c" width="500" height="400"></canvas>
<div id="tip" hidden>Click here to turn on sound</div>
<script>
(function () {
  const code = ${safeCode};
  const canvas = document.getElementById('c');
  const g = canvas.getContext('2d');
  const tip = document.getElementById('tip');
  const audio = new (window.AudioContext || window.webkitAudioContext)();

  function report(type, message) {
    parent.postMessage({ type: type, message: message }, '*');
  }

  if (audio.state !== 'running') {
    tip.hidden = false;
    document.addEventListener('pointerdown', function () {
      audio.resume().then(function () { tip.hidden = true; });
    }, { once: true });
  }
  audio.resume().then(function () { tip.hidden = true; }).catch(function () {});

  const NAMES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

  function freq(name) {
    const m = /^([A-G]#?)(-?\\d)$/.exec(String(name));
    if (!m) throw new Error('Note names look like "C4" or "F#3", not "' + name + '"');
    const semitones = NAMES[m[1]] + (Number(m[2]) - 4) * 12 - 9;
    return 440 * Math.pow(2, semitones / 12);
  }

  function note(pitch, when, length) {
    const f = typeof pitch === 'string' ? freq(pitch) : Number(pitch);
    if (!isFinite(f) || f <= 0) throw new Error('note() needs a note name like "C4" or a number like 440');
    const start = audio.currentTime + (Number(when) || 0);
    const len = Number(length) > 0 ? Number(length) : 0.4;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + len);
    osc.connect(amp);
    amp.connect(audio.destination);
    osc.start(start);
    osc.stop(start + len + 0.05);
  }

  function circle(x, y, size, color) {
    g.fillStyle = color || 'white';
    g.beginPath();
    g.arc(x, y, size, 0, Math.PI * 2);
    g.fill();
  }

  function rect(x, y, w, h, color) {
    g.fillStyle = color || 'white';
    g.fillRect(x, y, w, h);
  }

  function clear(color) {
    g.fillStyle = color || '#0b0a1a';
    g.fillRect(0, 0, canvas.width, canvas.height);
  }

  function text(words, x, y, color, size) {
    g.fillStyle = color || 'white';
    g.font = (size || 24) + 'px system-ui, sans-serif';
    g.fillText(String(words), x, y);
  }

  function after(seconds, fn) {
    setTimeout(function () {
      try { fn(); } catch (e) { report('error', e.message); }
    }, (Number(seconds) || 0) * 1000);
  }

  window.addEventListener('error', function (e) { report('error', e.message); });

  clear();
  if (!code.trim()) {
    g.fillStyle = '#a9a5d1';
    g.font = '20px system-ui, sans-serif';
    g.textAlign = 'center';
    g.fillText('Press Run to see and hear your code', 250, 205);
    return;
  }

  try {
    new Function('note', 'freq', 'circle', 'rect', 'clear', 'text', 'after', code)(
      note, freq, circle, rect, clear, text, after
    );
    report('ok', '');
  } catch (e) {
    report('error', e.message);
  }
})();
<\/script>
</body></html>`;
}
