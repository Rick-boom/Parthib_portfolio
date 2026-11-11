/* The code field: one canvas on an 8 x 16 character cell, after Hallmark's Cobalt "wire".
   Lanes of raw code (an ASCII ramp) run left to right into the portrait, carrying real fragments
   from Parthib's repos; past the portrait the field resolves into braille, the shipped side.
   30 fps, a pointer lens, pauses off screen, one still frame under reduced motion. */

const CW = 8, CH = 16;
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const RAMP = ['·', ':', '-', '=', '+', '*', '#', '%', '@'];
const BRAILLE = ['⠁', '⠃', '⠇', '⡇', '⣇', '⣧', '⣷', '⣿', '⣿'];

/* real strings from the projects on this page */
const FRAGMENTS = [
  'POST /api/recommendations/generate-recommendations 201',
  '{"recommendationScore":85.4,"tags":["Same Category","In Stock"]}',
  'const WEIGHTS = { category: 40, price: 30, rating: 30 };',
  'return qty >= minStockQty;',
  '"alignment_score"', '"bluffing_detected": true', '"confidence_percentage"',
  '@router.post("/{session_id}/submit")',
  'uvicorn app.main:app --reload --port 8000',
  'POST /api/contact 200',
  'git push origin main',
];

/* seeded gradient noise, so every visit draws the same weather */
const P = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 2026;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}
const GX = [1, -1, 1, -1, 1, -1, 0, 0], GY = [1, 1, -1, -1, 0, 0, 1, -1];
function noise(x, y) {
  const X = Math.floor(x), Y = Math.floor(y), xf = x - X, yf = y - Y, xi = X & 255, yi = Y & 255;
  const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
  const aa = P[P[xi] + yi] & 7, ab = P[P[xi] + yi + 1] & 7, ba = P[P[xi + 1] + yi] & 7, bb = P[P[xi + 1] + yi + 1] & 7;
  const n00 = GX[aa] * xf + GY[aa] * yf, n10 = GX[ba] * (xf - 1) + GY[ba] * yf;
  const n01 = GX[ab] * xf + GY[ab] * (yf - 1), n11 = GX[bb] * (xf - 1) + GY[bb] * (yf - 1);
  const a = n00 + u * (n10 - n00), b = n01 + u * (n11 - n01);
  return a + v * (b - a);
}
const fieldAt = (px, py, t) => 0.5 + 0.62 * noise(px / 300 + t * 0.022, py / 230 - t * 0.009) + 0.3 * noise(px / 105 - t * 0.05, py / 90 + t * 0.017);

function tokens() {
  const css = getComputedStyle(document.documentElement);
  const tok = (n, f) => css.getPropertyValue(n).trim() || f;
  return {
    g: [tok('--color-glyph-1', '#2a1714'), tok('--color-glyph-2', '#47201a'), tok('--color-glyph-3', '#7a2419'), tok('--color-glyph-4', '#c2281b')],
    accent: tok('--color-accent', '#ff2b1c'), deep: tok('--color-accent-deep', '#b8160b'), ink: tok('--color-ink', '#f3f1ec'), muted: tok('--color-muted', '#8f8a83'),
  };
}

/* every glyph in every tint, drawn once at device resolution */
function atlas(glyphs, tints, dpr) {
  const c = document.createElement('canvas');
  c.width = glyphs.length * CW * dpr; c.height = tints.length * CH * dpr;
  const x = c.getContext('2d');
  x.scale(dpr, dpr);
  x.font = `400 13.333px ${MONO}`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  tints.forEach((tint, r) => { x.fillStyle = tint; glyphs.forEach((g, i) => x.fillText(g, i * CW + CW / 2, r * CH + CH / 2 + 1)); });
  return c;
}

export function initField(hero) {
  const cv = hero && hero.querySelector('canvas.field');
  if (!cv || !cv.getContext) return () => {};
  const ctx = cv.getContext('2d');
  const photo = hero.querySelector('.hero__photo img');
  const copy = hero.querySelector('.hero__copy');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const C = tokens();
  const GLYPHS = [...RAMP, ...BRAILLE.slice(0, 8)];
  const TINTS = [...C.g, C.accent, C.deep];
  const TINT_OF = [0, 0, 1, 1, 2, 2, 3, 4, 5, 4];

  let W = 0, H = 0, cols = 0, rows = 0, dpr = 1, sheet = null;
  let CALM = new Float32Array(0);
  let gateX = 0, gateY = 0, lanes = [], zoneL = 0, face = null;
  const pointer = { x: -1e4, y: -1e4, k: 0, tk: 0 };
  let packets = [], clock = 0, last = 0, raf = 0, visible = true, running = false, spawnAt = 0;

  function layout() {
    const r = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
    sheet = atlas(GLYPHS, TINTS, dpr);

    /* the gate is the portrait's near shoulder; lanes converge there and the face itself stays quiet */
    const pr = photo ? photo.getBoundingClientRect() : null;
    face = null;
    if (pr && pr.width) {
      const narrow = W < 700;
      gateX = pr.left - r.left + pr.width * (narrow ? 0.5 : 0.24); gateY = pr.top - r.top + pr.height * (narrow ? 0.55 : 0.8);
      face = { cx: pr.left - r.left + pr.width * 0.52, cy: pr.top - r.top + pr.height * 0.48, rx: pr.width * 0.36, ry: pr.height * 0.5 };
    } else { gateX = W * 0.68; gateY = H * 0.7; }
    const n = W < 700 ? 4 : 7;
    lanes = Array.from({ length: n }, (_, i) => ({ y0: H * (0.18 + 0.72 * (i + 0.5) / n), spread: 0 }));

    /* calm patches hug every line of copy so the type sits on quiet ground */
    const boxes = [];
    if (copy) {
      [...copy.children].forEach((el) => {
        let list = [el.getBoundingClientRect()];
        if (/^(H1|P)$/.test(el.tagName)) { const rg = document.createRange(); rg.selectNodeContents(el); list = [...rg.getClientRects()]; }
        else if (el.children.length) list = [...el.children].map((c) => c.getBoundingClientRect()); /* a row of keys: measure the keys, not the row */
        list.forEach((rc) => { if (rc.width) boxes.push({ l: rc.left - r.left - 18, rt: rc.right - r.left + 24, tp: rc.top - r.top - 10, b: rc.bottom - r.top + 10 }); });
      });
    }
    /* fragments only show in the open strip between the copy and the portrait, so they never break mid-word under the type */
    const copyRight = boxes.reduce((mx, b) => Math.max(mx, b.rt), 0);
    zoneL = copyRight > 0 && copyRight < gateX - 160 ? copyRight + 8 : 0;
    CALM = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const px = x * CW + CW / 2, py = y * CH + CH / 2;
      let m = 0;
      for (const bx of boxes) {
        const d = Math.hypot(Math.max(bx.l - px, 0, px - bx.rt), Math.max(bx.tp - py, 0, py - bx.b));
        const k = d <= 0 ? 1 : Math.max(0, 1 - d / 56);
        if (k > m) m = k;
      }
      /* the portrait's silhouette is quiet ground too, so the face reads through the field */
      if (face) {
        const e = Math.hypot((px - face.cx) / face.rx, (py - face.cy) / face.ry);
        const k = Math.max(0, Math.min(1, (1.15 - e) / 0.35)) * 0.85;
        if (k > m) m = k;
      }
      CALM[y * cols + x] = m * m * (3 - 2 * m);
    }
  }

  /* where lane i sits at x: spread on the left, gathered at the gate */
  function laneY(i, px, t) {
    const L = lanes[i];
    const s = Math.min(1, Math.max(0, px / Math.max(1, gateX)));
    const e = s * s * (3 - 2 * s);
    const wobble = noise((px - t * 24) / 240, i * 3.7 + 0.5) * 70 * (1 - e);
    return L.y0 * (1 - e) + (gateY + (i - (lanes.length - 1) / 2) * CH * 2) * e + wobble;
  }

  function spawn() {
    /* one fragment per lane at a time, so text never overlaps */
    const free = lanes.map((_, i) => i).filter((i) => !packets.some((p) => p.lane === i));
    if (!free.length) return;
    const i = free[Math.floor(Math.random() * free.length)];
    const text = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
    /* with a copy column, a fragment fades in whole just past it; on narrow screens it slides in from the edge */
    packets.push({ lane: i, x: zoneL ? zoneL + 8 : -text.length * CW, text, speed: 34 + Math.random() * 26, age: 0 });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const lens = pointer.k;
    for (let y = 0; y < rows; y++) {
      const py = y * CH + CH / 2;
      for (let x = 0; x < cols; x++) {
        const px = x * CW + CW / 2;
        const calm = CALM[y * cols + x];
        if (calm > 0.98) continue;
        const right = px > gateX;
        let v = fieldAt(px, py, t);
        /* lanes: dense bands of raw code heading for the gate */
        let band = 0;
        if (!right) {
          for (let i = 0; i < lanes.length; i++) {
            const d = Math.abs(py - laneY(i, px, t));
            const sg = 10 + 26 * (1 - Math.min(1, px / Math.max(1, gateX)));
            if (d < sg * 2.2) band = Math.max(band, Math.exp(-(d * d) / (2 * sg * sg)));
          }
        }
        if (zoneL) band *= Math.max(0, Math.min(1, (px - zoneL + 40) / 160)); /* lanes live between the copy and the portrait; the left gutter stays faint */
        let level = right ? (v - 0.62) * 1.6 : (v - 0.55) * 1.2 + band * 0.95;
        if (lens > 0.01) {
          const dd = Math.hypot(px - pointer.x, py - pointer.y);
          if (dd < 120) level += (1 - dd / 120) * 0.5 * lens;
        }
        level *= 1 - calm;
        if (level <= 0.06) continue;
        const li = Math.min(8, Math.floor(level * 9));
        const gi = right ? RAMP.length + Math.min(7, li) : li;
        const ti = right ? Math.min(2, TINT_OF[li]) : TINT_OF[li];
        ctx.drawImage(sheet, gi * CW * dpr, ti * CH * dpr, CW * dpr, CH * dpr, x * CW, y * CH, CW, CH);
      }
    }
    /* fragments: real code riding the lanes, swallowed at the gate */
    ctx.font = `500 13.333px ${MONO}`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    for (const p of packets) {
      /* a fragment rides one row, the lane's row under its head, so it always reads */
      const head = Math.min(gateX - 24, p.x + p.text.length * CW);
      const py = Math.round(laneY(p.lane, head, t) / CH) * CH + CH / 2;
      for (let c = 0; c < p.text.length; c++) {
        const px = p.x + c * CW;
        if (px < Math.max(-CW, zoneL) || px > gateX - 24) continue;
        const gx = Math.floor(px / CW), gy = Math.floor(py / CH);
        const calm = gx >= 0 && gy >= 0 && gx < cols && gy < rows ? CALM[gy * cols + gx] : 0;
        if (calm > 0.35) continue;
        const near = Math.max(0, 1 - (gateX - px) / 160);
        ctx.globalAlpha = (1 - calm) * (1 - near * 0.9) * Math.min(1, (p.age ?? 1) / 0.7);
        ctx.fillStyle = c === 0 ? C.accent : C.ink;
        ctx.clearRect(Math.floor(px / CW) * CW, py - CH / 2, CW, CH);
        ctx.fillText(p.text[c], Math.floor(px / CW) * CW + CW / 2, py + 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  function step(now) {
    raf = 0;
    if (!running) return;
    if (now - last >= 33) {
      const dt = Math.min(0.1, (now - last) / 1000 || 0.033);
      last = now; clock += dt;
      pointer.k += (pointer.tk - pointer.k) * 0.12;
      if (clock > spawnAt) { spawn(); spawnAt = clock + 0.9 + Math.random() * 1.4; }
      packets.forEach((p) => { p.x += p.speed * dt; p.age = (p.age || 0) + dt; });
      packets = packets.filter((p) => p.x < gateX + 40);
      draw(clock);
    }
    raf = requestAnimationFrame(step);
  }
  function play() { if (running || reduce.matches || !visible || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(step); }
  function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  function still() {
    /* one composed frame: a few fragments mid-lane */
    packets = FRAGMENTS.slice(0, lanes.length).map((text, i) => ({ lane: i, x: zoneL + (gateX - zoneL) * (0.15 + 0.1 * i) - text.length * CW * 0.6, text, speed: 0 }));
    draw(12);
  }

  function onMove(e) { const r = hero.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.tk = 1; }
  function onLeave() { pointer.tk = 0; }

  let ro = null, io = null, imgDone = null;
  function relayout() { layout(); if (reduce.matches) still(); else if (!running) draw(clock); }
  relayout();
  hero.classList.add('has-field');
  if (photo && !photo.complete) { imgDone = () => relayout(); photo.addEventListener('load', imgDone); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { sheet = atlas(GLYPHS, TINTS, dpr); relayout(); });
  if ('ResizeObserver' in window) { ro = new ResizeObserver(() => relayout()); ro.observe(hero); }
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); else pause(); });
    io.observe(hero);
  }
  const onVis = () => (document.hidden ? pause() : play());
  const onReduce = () => (reduce.matches ? (pause(), still()) : play());
  document.addEventListener('visibilitychange', onVis);
  reduce.addEventListener && reduce.addEventListener('change', onReduce);
  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', onLeave);
  play();

  return () => {
    pause();
    ro && ro.disconnect(); io && io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    reduce.removeEventListener && reduce.removeEventListener('change', onReduce);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    if (imgDone && photo) photo.removeEventListener('load', imgDone);
    hero.classList.remove('has-field');
  };
}

/* one still row of the field, used as the footer divider */
export function initDivider(cv) {
  if (!cv || !cv.getContext) return () => {};
  const ctx = cv.getContext('2d');
  const C = tokens();
  const drawRow = () => {
    const r = cv.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.font = `400 13.333px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cols = Math.ceil(W / CW), rows = Math.ceil(H / CH);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const v = fieldAt(x * CW, y * CH + 40, 9);
      const lv = Math.floor(Math.max(0, (v - 0.45) / 0.55) * 9);
      if (lv <= 0) continue;
      ctx.fillStyle = C.g[Math.min(3, Math.floor(lv / 2.5))];
      ctx.fillText(RAMP[Math.min(8, lv)], x * CW + CW / 2, y * CH + CH / 2 + 1);
    }
    cv.classList.add('has-field');
  };
  drawRow();
  let ro = null;
  if ('ResizeObserver' in window) { ro = new ResizeObserver(drawRow); ro.observe(cv); }
  return () => { ro && ro.disconnect(); };
}
