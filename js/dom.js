// Tiny helper for building DOM safely (text is never parsed as HTML).
export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

const NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  music: [['path', { d: 'M9 18V5l11-2v13' }], ['circle', { cx: 6, cy: 18, r: 3 }], ['circle', { cx: 17, cy: 16, r: 3 }]],
  brush: [['path', { d: 'M4 20l1-4L16 5l3 3L8 19z' }], ['path', { d: 'M14 7l3 3' }]],
  gamepad: [['rect', { x: 2, y: 7, width: 20, height: 11, rx: 5 }], ['path', { d: 'M7 10v5M4.5 12.5h5' }], ['circle', { cx: 16, cy: 11, r: 1 }], ['circle', { cx: 18.5, cy: 14, r: 1 }]],
  flask: [['path', { d: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3' }], ['path', { d: 'M7.5 15h9' }]],
  book: [['path', { d: 'M4 5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2z' }], ['path', { d: 'M4 20a2 2 0 0 0 2 1h14' }]],
  shapes: [['circle', { cx: 7, cy: 7, r: 4 }], ['rect', { x: 13, y: 13, width: 8, height: 8, rx: 1 }], ['path', { d: 'M14 10l3-6 3 6z' }], ['path', { d: 'M3 17h6M6 14v6' }]],
  play: [['path', { d: 'M5 3v14l12-7z', fill: 'currentColor', stroke: 'none' }]],
  check: [['path', { d: 'M4 12.5l5 5 11-12' }]],
  star: [['path', { d: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z' }]],
};

export function icon(name, size = 24, extra = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  for (const [k, v] of Object.entries(extra)) svg.setAttribute(k, v);
  for (const [tag, attrs] of ICONS[name] || []) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    svg.append(node);
  }
  return svg;
}

export function logoMark(size = 28) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', size + 4);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 32 28');
  svg.setAttribute('aria-hidden', 'true');
  const bars = [[1, 11, 16, '#2336D9'], [9, 2, 25, '#2336D9'], [17, 8, 19, '#FFB800'], [25, 14, 13, '#2336D9']];
  for (const [x, y, hgt, fill] of bars) {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 5); r.setAttribute('height', hgt);
    r.setAttribute('rx', 2.5); r.setAttribute('fill', fill);
    svg.append(r);
  }
  return svg;
}

export function starsRow(count, size = 28) {
  const wrap = h('span', { class: 'stars' });
  for (let i = 1; i <= 3; i++) {
    wrap.append(icon('star', size, {
      fill: i <= count ? '#FFB800' : '#FFFFFF',
      stroke: i <= count ? '#161B3D' : '#8A90B8',
      'stroke-width': '1.5',
    }));
  }
  return wrap;
}

// Text with `backticks` becomes <code> pieces. Never uses innerHTML.
export function inline(parent, text) {
  String(text ?? '').split('`').forEach((part, i) => {
    if (!part) return;
    if (i % 2) parent.append(h('code', {}, part));
    else parent.append(part);
  });
  return parent;
}
