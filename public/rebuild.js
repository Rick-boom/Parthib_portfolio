/*!
 * rebuild.js — one click, the page goes blank, and a swarm of cursor
 * "agents" redraws it layer by layer, Figma-multiplayer style.
 *
 * Zero dependencies. Safe on React / Vite / Next: it never edits nodes the
 * framework owns. It only toggles a data-attribute, paints CSS highlights
 * over untyped text and runs Web Animations.
 *
 *   <script src="/rebuild.js" data-root="#root" data-agents="24" defer></script>
 *
 * data-* options
 *   root       CSS selector of what gets rebuilt          (default "#root", falls back to body)
 *   agents     number of cursors, 1–64                    (default 24)
 *   speed      global speed multiplier                    (default 1)
 *   trigger    "pill" shows the floating bar, "none" hides it (default "pill")
 *   autostart  "true" runs once shortly after load         (default off)
 *   accent     colour for the sweep line and buttons      (default --rb-accent, then --orange)
 *   canvas     "light" or "dark" blank-canvas background  (default "light")
 *   scroll     "true": everything below the first screen starts unbuilt, and a
 *              small team of agents builds each part as it scrolls into view
 *   scroll-agents  size of that team, 1–24                 (default 8)
 *   scroll-start   how far up the screen a part must scroll before it is built:
 *                  0.7 = 70% of the way down from the top (default), 0.5 = the middle
 *
 * API: Rebuild.start({ agents, speed }), Rebuild.skip(), Rebuild.startScroll()
 * Any element with a [data-rebuild] attribute starts a rebuild on click.
 * Put [data-rb-skip] on anything that should stay untouched.
 */
(() => {
  'use strict';
  if (window.Rebuild) return;

  const S = document.currentScript;
  const D = (S && S.dataset) || {};
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const CFG = {
    root: D.root || '#root',
    agents: clamp(Math.round(+D.agents) || 24, 1, 64),
    speed: +D.speed > 0 ? +D.speed : 1,
    trigger: D.trigger || 'pill',
    autostart: D.autostart === 'true',
    canvas: D.canvas === 'dark' ? 'dark' : 'light',
    scroll: D.scroll === 'true',
    scrollAgents: clamp(Math.round(+D.scrollAgents) || 8, 1, 24),
    scrollStart: clamp(+D.scrollStart || 0.7, 0.3, 1),
  };
  const AGENT_CHOICES = [8, 24, 48];

  const NAMES = ['Ada', 'Alan', 'Grace', 'Linus', 'Guido', 'Dennis', 'Ken', 'Barbara', 'Edsger', 'Donald',
    'Margaret', 'Tim', 'Brendan', 'Bjarne', 'Radia', 'Frances', 'Hedy', 'Katherine', 'Vint', 'Anders',
    'John', 'Yukihiro', 'Rasmus', 'Evan', 'Sophie', 'Jean', 'Rich', 'Larry', 'Leslie', 'Fei-Fei',
    'Andrej', 'Yann', 'Geoffrey', 'Demis', 'Ilya', 'Shafi', 'Whitfield', 'Martin', 'Robert', 'Niklaus',
    'Ivan', 'Douglas', 'Butler', 'Alonzo', 'Kurt', 'Claude', 'Ward', 'Mitchell', 'Dan', 'Jeff',
    'Sanjay', 'Satya', 'Sundar', 'Raj', 'Manindra', 'Narendra', 'Anil', 'Raghu', 'Shakuntala', 'Srinivasa',
    'Prasanta', 'Jagadish', 'Satyendra', 'Meghnad'];
  const PALETTE = ['#fa4e03', '#0d99ff', '#9747ff', '#14ae5c', '#ff24bd', '#ffb800', '#00b5ce', '#f24822',
    '#5551ff', '#1bc47d', '#ff7262', '#a259ff'];
  const colorOf = i => (i < PALETTE.length ? PALETTE[i] : `hsl(${Math.round((i * 137.508) % 360)} 80% 50%)`);
  const inkOn = c => (c === '#ffb800' || c === '#00b5ce' || c === '#1bc47d' ? '#111' : '#fff');

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HL = typeof Highlight === 'function' && window.CSS && CSS.highlights;
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'BR', 'WBR', 'SOURCE', 'TRACK', 'OPTION']);
  const MEDIA_TAGS = new Set(['IMG', 'CANVAS', 'VIDEO', 'PICTURE', 'IFRAME', 'svg']);
  const sleep = ms => new Promise(r => setTimeout(r, Math.max(0, ms)));
  const now = () => performance.now();

  /* ---------------------------------------------------------------- styles */
  const rootVar = n => (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim();
  const accent = D.accent || rootVar('--rb-accent') || rootVar('--orange') || '#fa4e03';
  const canvasCss = CFG.canvas === 'dark'
    ? 'background-color:#0b0b0c!important;background-image:radial-gradient(rgba(255,255,255,.11) 1px,transparent 1.4px)!important'
    : 'background-color:#f3f1ec!important;background-image:radial-gradient(rgba(10,10,10,.14) 1px,transparent 1.4px)!important';
  const css = `
[data-rb-hide]{visibility:hidden!important}
::highlight(rb-ghost){color:transparent;-webkit-text-fill-color:transparent;text-shadow:none}
html[data-rb-canvas] body{${canvasCss};background-size:22px 22px!important;background-attachment:fixed!important}
#rb-layer{position:absolute;left:0;top:0;width:0;height:0;overflow:visible;z-index:2147483600;pointer-events:none;--rb-mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
#rb-sweep{position:fixed;left:0;right:0;top:0;height:2px;z-index:2147483601;pointer-events:none;background:${accent};box-shadow:0 0 18px 4px ${accent}66,0 0 2px ${accent}}
.rb-agent{position:absolute;left:0;top:0;transition-property:transform,opacity;transition-timing-function:cubic-bezier(.22,.8,.26,1);will-change:transform}
.rb-agent svg{display:block;width:17px;height:19px;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))}
.rb-agent span{position:absolute;left:13px;top:16px;background:var(--c);color:var(--ink);font:600 10.5px/1 var(--rb-mono);padding:3px 6px 4px;border-radius:3px 9px 9px 9px;white-space:nowrap}
.rb-box{position:absolute;box-sizing:border-box;border:1.5px solid var(--c);background:color-mix(in srgb,var(--c) 6%,transparent);transition-property:opacity;transition-timing-function:ease-out}
.rb-box i{position:absolute;width:7px;height:7px;box-sizing:border-box;background:#fff;border:1.5px solid var(--c)}
.rb-box i:nth-child(1){left:-4px;top:-4px}.rb-box i:nth-child(2){right:-4px;top:-4px}.rb-box i:nth-child(3){left:-4px;bottom:-4px}.rb-box i:nth-child(4){right:-4px;bottom:-4px}
.rb-box b{position:absolute;left:-1.5px;bottom:100%;margin-bottom:4px;font:500 10px/1 var(--rb-mono);color:var(--c);white-space:nowrap}
.rb-box em{position:absolute;left:50%;top:100%;margin-top:6px;transform:translateX(-50%);background:var(--c);color:var(--ink);font:500 10px/1 var(--rb-mono);font-style:normal;padding:3px 5px 4px;border-radius:3px;white-space:nowrap;font-variant-numeric:tabular-nums}
.rb-caret{position:absolute;width:2px;border-radius:1px;background:var(--c);animation:rb-blink 1s steps(1) infinite}
@keyframes rb-blink{50%{opacity:0}}
#rb-bar{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483602;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 24px);box-sizing:border-box;padding:6px 6px 6px 14px;border-radius:999px;background:#0a0a0a;color:#fff;font:500 13px/1.2 var(--font-body,"Geist",system-ui,sans-serif);box-shadow:0 12px 34px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.07);white-space:nowrap}
#rb-bar button{font:inherit;cursor:pointer;border:0;border-radius:999px;transition:background-color .2s,transform .15s}
#rb-bar button:active{transform:scale(.96)}
#rb-bar button:focus-visible{outline:2px solid #fff;outline-offset:2px}
#rb-bar .rb-go{background:${accent};color:#fff;font-weight:600;padding:9px 15px}
#rb-bar .rb-go:hover{background:color-mix(in srgb,${accent} 85%,#fff)}
#rb-bar .rb-chip{background:rgba(255,255,255,.09);color:#fff;padding:8px 11px;font:500 12px/1 "JetBrains Mono",ui-monospace,monospace}
#rb-bar .rb-chip:hover{background:rgba(255,255,255,.16)}
#rb-bar .rb-x{background:transparent;color:rgba(255,255,255,.55);width:30px;height:30px;padding:0;font-size:16px}
#rb-bar .rb-x:hover{color:#fff;background:rgba(255,255,255,.09)}
#rb-bar .rb-dots{display:flex;padding-left:4px}
#rb-bar .rb-dots i{width:16px;height:16px;margin-left:-5px;border-radius:50%;background:var(--c);box-shadow:0 0 0 2px #0a0a0a}
#rb-bar .rb-stat{font:500 12px/1 "JetBrains Mono",ui-monospace,monospace;color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums}
#rb-bar .rb-stat b{color:#fff;font-weight:600}
#rb-bar .rb-prog{width:84px;height:4px;border-radius:2px;background:rgba(255,255,255,.14);overflow:hidden}
#rb-bar .rb-prog i{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:left;background:${accent};transition:transform .3s}
#rb-bar .rb-live{width:7px;height:7px;border-radius:50%;background:${accent};animation:rb-pulse 1.1s ease-in-out infinite}
#rb-bar .rb-ok{color:#1bc47d;font-weight:700}
@keyframes rb-pulse{50%{opacity:.25}}
@media (max-width:560px){#rb-bar .rb-hide-sm{display:none}#rb-bar{gap:8px;padding-left:10px}}
@media (prefers-reduced-motion:reduce){.rb-caret,#rb-bar .rb-live{animation:none}}
`;
  const style = document.createElement('style');
  style.id = 'rb-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ------------------------------------------------------------- layers */
  function alpha(c) {
    if (!c || c === 'transparent') return 0;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return 1;
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    return p.length > 3 ? parseFloat(p[3]) : 1;
  }
  function hasPaint(cs) {
    if (alpha(cs.backgroundColor) > 0.02) return true;
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
    if (cs.boxShadow && cs.boxShadow !== 'none') return true;
    for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
      if (parseFloat(cs['border' + s + 'Width']) > 0 && cs['border' + s + 'Style'] !== 'none' && alpha(cs['border' + s + 'Color']) > 0.02) return true;
    }
    return false;
  }
  const ownText = el => {
    for (let n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.data.trim()) return true;
    return false;
  };

  function collect(root) {
    const map = new Map();
    const layers = [];
    const nearest = el => {
      for (let p = el.parentElement; p && p !== root.parentElement; p = p.parentElement) {
        const L = map.get(p);
        if (L) return L;
      }
      return null;
    };
    const all = [root, ...root.querySelectorAll('*')];
    for (const el of all) {
      if (SKIP_TAGS.has(el.tagName)) continue;
      if (el.closest('[data-rb-skip],#rb-layer,#rb-bar')) continue;
      const isSvg = el instanceof SVGElement;
      if (isSvg && el.tagName.toLowerCase() !== 'svg') continue;
      if (isSvg && el.parentElement && el.parentElement.closest('svg')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') continue;
      const parent = nearest(el);
      if (parent && parent.media) continue; // inside an image / canvas / svg
      const media = MEDIA_TAGS.has(el.tagName) || el.hasAttribute('data-rb-media') || /url\(/.test(cs.backgroundImage);
      const paint = !media && (hasPaint(cs) || el.getAttribute('data-rb') === 'frame');
      const text = !media && ownText(el);
      if (!media && !paint && !text) continue;
      // inline bits of a sentence (<em>, <span>, <a>) get typed with the sentence they belong to
      if (parent && parent.text && !media && !paint && cs.display.startsWith('inline')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) continue;
      const L = { el, parent, media, paint, text, texts: [], state: 0, i: layers.length, tag: tagLabel(el) };
      map.set(el, L);
      layers.push(L);
    }
    // give every text node to the layer that owns it
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.data.trim()) continue;
      let owner = null;
      for (let p = n.parentElement; p && p !== root.parentElement; p = p.parentElement) {
        owner = map.get(p);
        if (owner) break;
      }
      if (owner && !owner.media) owner.texts.push({ node: n, len: n.data.length, range: null });
    }
    return layers;
  }
  function tagLabel(el) {
    const t = el.tagName.toLowerCase();
    const c = typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
    return c && c.length < 22 ? `${t}.${c}` : t;
  }

  /* ----------------------------------------------------------- overlay */
  let layer = null;
  function overlay() {
    if (!layer || !layer.isConnected) {
      layer = document.createElement('div');
      layer.id = 'rb-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    return layer;
  }
  function origin() {
    const r = overlay().getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY };
  }
  function docRect(el) {
    const r = el.getBoundingClientRect();
    const o = origin();
    return { x: r.left + scrollX - o.x, y: r.top + scrollY - o.y, w: r.width, h: r.height };
  }
  function viewPoint(vx, vy) {
    const o = origin();
    return { x: vx + scrollX - o.x, y: vy + scrollY - o.y };
  }

  class Agent {
    constructor(i, x, y) {
      this.i = i;
      this.c = colorOf(i);
      this.name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ' ' + (1 + Math.floor(i / NAMES.length)) : '');
      this.x = x; this.y = y;
      const el = document.createElement('div');
      el.className = 'rb-agent';
      el.style.cssText = `--c:${this.c};--ink:${inkOn(this.c)};opacity:0;transform:translate3d(${x}px,${y}px,0)`;
      el.innerHTML = `<svg viewBox="0 0 17 19"><path d="M1.2 1.2 15.4 8.6 8.9 10.4 5.6 16.6Z" fill="${this.c}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span></span>`;
      el.querySelector('span').textContent = this.name;
      overlay().appendChild(el);
      this.el = el;
      requestAnimationFrame(() => { if (this.asleep) return; el.style.transitionDuration = '300ms'; el.style.opacity = '1'; });
    }
    go(x, y, ms) {
      const d = Math.max(0, Math.round(ms));
      this.el.style.transitionDuration = `${d}ms, 300ms`;
      this.el.style.transform = `translate3d(${x}px,${y}px,0)`;
      this.x = x; this.y = y;
      return sleep(d);
    }
    travel(x, y, sp) {
      const dist = Math.hypot(x - this.x, y - this.y);
      return this.go(x, y, clamp(140 + dist * 0.45, 160, 700) / sp);
    }
    idle() { if (!this.asleep) { this.asleep = true; this.el.style.transitionDuration = '300ms, 300ms'; this.el.style.opacity = '0'; } }
    wake(x, y) {
      if (!this.asleep) return;
      this.asleep = false;
      this.el.style.transitionDuration = '0ms, 0ms';
      this.el.style.transform = `translate3d(${x}px,${y}px,0)`;
      this.x = x; this.y = y;
      void this.el.offsetWidth;
      this.el.style.transitionDuration = '0ms, 200ms';
      this.el.style.opacity = '1';
    }
    remove() { this.el.remove(); }
  }

  function makeBox(a, L, r) {
    const el = document.createElement('div');
    el.className = 'rb-box';
    el.style.cssText = `--c:${a.c};--ink:${inkOn(a.c)};left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
    const kind = L.media ? 'Image' : L.paint ? (L.texts.length ? 'Frame + Text' : 'Frame') : 'Text';
    el.innerHTML = '<i></i><i></i><i></i><i></i><b></b><em></em>';
    el.querySelector('b').textContent = `${kind} · ${L.tag}`;
    el.querySelector('em').textContent = `${Math.round(r.w)} × ${Math.round(r.h)}`;
    overlay().appendChild(el);
    return {
      el,
      // the box is drawn by clipping, never by animating width or height
      grow(ms) {
        const end = 'inset(-24px -80px -34px -12px)';
        if (el.animate && !reduce) {
          el.animate([{ clipPath: 'inset(-12px 100% 100% -12px)' }, { clipPath: end }], { duration: Math.round(ms), easing: 'cubic-bezier(.3,.7,.2,1)' });
        }
      },
      show() {},
      done() {
        el.style.transitionDuration = '260ms';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
      },
    };
  }

  /* -------------------------------------------------------------- run */
  let run = null;
  let agentCount = CFG.agents;

  async function start(opts = {}) {
    if (run) { skip(true); await sleep(60); }
    if (opts.agents) agentCount = clamp(Math.round(opts.agents), 1, 64);
    const root = document.querySelector(CFG.root) || document.body;
    const layers = collect(root);
    if (!layers.length) return;
    const R = {
      alive: true, layers, done: 0, t0: 0, agents: [],
      pending: new Set(layers),
      ghost: HL ? new Highlight() : null,
    };
    run = R;
    const n = Math.min(agentCount, layers.length);
    // pace: a full run lands around 28 seconds whatever the page size or agent count
    R.sp = (opts.speed || CFG.speed) * clamp((layers.length * 2.0) / (n * 28), 0.35, 6) * (reduce ? 4 : 1);
    // how many agents may work on the visible screen while other parts of the page still need them
    const vis = layers.filter(L => { const r = L.el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).length;
    R.cap = clamp(Math.round(n * (vis / layers.length) * 2.5), Math.min(6, n), n);
    R.inView = 0;
    ui.running(n, layers.length);

    if (R.ghost) {
      for (const L of layers) for (const t of L.texts) {
        const rg = document.createRange();
        rg.selectNodeContents(t.node);
        t.range = rg;
        R.ghost.add(rg);
      }
      CSS.highlights.set('rb-ghost', R.ghost);
    }

    await wipe(R);
    if (!alive(R)) return;
    await sleep(reduce ? 0 : 260);
    if (!alive(R)) return;

    R.t0 = now();
    ui.tick(R);
    const home = barPoint();
    for (let i = 0; i < n; i++) {
      R.agents.push(new Agent(i, home.x + (Math.random() - 0.5) * 120, home.y - Math.random() * 30));
    }
    await Promise.all(R.agents.map((a, i) => sleep(i * 45).then(() => loop(R, a))));
    if (!alive(R)) return;
    const ms = now() - R.t0;
    await swarmHome(R);
    if (!alive(R)) return;
    cleanup(R);
    run = null;
    ui.done(n, ms);
  }

  const alive = R => run === R && R.alive;

  /* ------------------------------------------------------- scroll mode */
  // a part is built only once it has scrolled up to this line (a fraction of the screen height from the top);
  // at the very end of the page, where nothing can scroll further, whatever is on screen gets built
  const zoneBottom = () => {
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    return innerHeight * (atEnd ? 1 : CFG.scrollStart);
  };

  function startScroll() {
    if (run || reduce) return false;
    const root = document.querySelector(CFG.root);
    if (!root || !root.firstElementChild) return false;
    const layers = collect(root);
    const fold = innerHeight * 0.94;
    // whole-section containers with nothing of their own to draw stay as they are
    const shell = L => L.paint && !L.texts.length && L.el.getBoundingClientRect().height > innerHeight * 0.7;
    const hidden = layers.filter(L => L.el.getBoundingClientRect().top > fold && !shell(L));
    if (hidden.length < 4) return true;
    for (const L of layers) L.state = 2;
    for (const L of hidden) L.state = 0;
    const n = Math.min(CFG.scrollAgents, hidden.length);
    const R = {
      mode: 'scroll', alive: true, layers: hidden, done: 0, t0: now(), agents: [],
      pending: new Set(hidden), ghost: HL ? new Highlight() : null,
      base: CFG.speed * 1.5, sp: CFG.speed * 1.5, cap: n, inView: 0, busy: 0,
    };
    run = R;
    if (R.ghost) {
      for (const L of hidden) for (const t of L.texts) {
        const rg = document.createRange();
        rg.selectNodeContents(t.node);
        t.range = rg;
        R.ghost.add(rg);
      }
      CSS.highlights.set('rb-ghost', R.ghost);
    }
    for (const L of hidden) L.el.setAttribute('data-rb-hide', '');
    ui.scrolling(n, hidden.length);
    for (let i = 0; i < n; i++) { const a = new Agent(i, 0, 0); a.asleep = true; a.el.style.opacity = '0'; R.agents.push(a); }
    // anyone tabbing with the keyboard gets the whole page at once
    R.onKey = e => { if (e.key === 'Tab') skip(); };
    document.addEventListener('keydown', R.onKey);
    R.agents.forEach(a => scrollLoop(R, a));
    return true;
  }

  function settle(R, L) { // a layer that needs no drawing: show it as it is
    R.pending.delete(L);
    if (R.ghost) for (const t of L.texts) R.ghost.delete(t.range);
    L.el.removeAttribute('data-rb-hide');
    L.state = 2;
    R.done++;
  }

  function pickScroll(R, a) {
    const o = origin();
    const zb = zoneBottom();
    let best = null, bestScore = Infinity, backlog = 0;
    for (const L of R.pending) {
      const r = L.el.getBoundingClientRect();
      if (r.bottom < -60) { settle(R, L); continue; }       // scrolled past before its turn
      if (r.top > zb) continue;                              // not on screen yet
      backlog++;
      const cx = r.left + scrollX - o.x + r.width / 2, cy = r.top + scrollY - o.y + Math.min(r.height, innerHeight) / 2;
      let s = r.top * 1.4 + (a.asleep ? 0 : Math.hypot(cx - a.x, cy - a.y) * 0.15);
      if (L.parent && L.parent.state === 0) s += 900;        // containers before their contents
      s -= Math.min(Math.sqrt(r.width * r.height) * 0.2, 160);
      if (s < bestScore) { bestScore = s; best = L; }
    }
    // a long queue on screen means the reader is waiting: work faster
    R.sp = R.base * clamp(backlog / (R.agents.length * 1.2), 1, 3);
    if (best) R.pending.delete(best);
    return best;
  }

  async function scrollLoop(R, a) {
    while (alive(R)) {
      const L = pickScroll(R, a);
      ui.progress(R);
      if (!L) {
        if (!R.pending.size) break;
        a.idle();
        await sleep(130);
        continue;
      }
      if (a.asleep) {
        const r = L.el.getBoundingClientRect();
        const p = viewPoint(clamp(r.left + r.width / 2 + (Math.random() - 0.5) * 240, 20, innerWidth - 20), innerHeight + 24);
        a.wake(p.x, p.y);
      }
      R.busy++;
      await job(R, a, L);
      R.busy--;
      if (!alive(R)) return;
      R.done++;
      ui.progress(R);
      await sleep((40 + Math.random() * 120) / R.sp);
    }
    a.idle();
    if (alive(R) && !R.pending.size && !R.busy && !R.finishing) {
      R.finishing = true;
      await sleep(350);
      if (!alive(R)) return;
      const n = R.agents.length;
      cleanup(R);
      run = null;
      ui.scrollDone(n);
    }
  }

  function wipe(R) {
    const vh = innerHeight;
    const later = [];
    for (const L of R.layers) {
      const r = L.el.getBoundingClientRect();
      L.vt = r.top;
      if (reduce || r.bottom < 0 || r.top > vh) L.el.setAttribute('data-rb-hide', '');
      else later.push(L);
    }
    document.documentElement.setAttribute('data-rb-canvas', '');
    if (reduce || !later.length) {
      later.forEach(L => L.el.setAttribute('data-rb-hide', ''));
      return Promise.resolve();
    }
    later.sort((a, b) => a.vt - b.vt);
    const line = document.createElement('div');
    line.id = 'rb-sweep';
    document.body.appendChild(line);
    const dur = 560;
    const t0 = now();
    return new Promise(res => {
      let k = 0;
      const step = () => {
        const p = clamp((now() - t0) / dur, 0, 1);
        const e = 1 - Math.pow(1 - p, 2);
        const y = e * vh;
        line.style.transform = `translateY(${y}px)`;
        while (k < later.length && later[k].vt <= y) later[k++].el.setAttribute('data-rb-hide', '');
        if (p < 1 && alive(R)) return requestAnimationFrame(step);
        while (k < later.length) later[k++].el.setAttribute('data-rb-hide', '');
        line.style.transition = 'opacity .25s';
        line.style.opacity = '0';
        setTimeout(() => line.remove(), 300);
        res();
      };
      requestAnimationFrame(step);
    });
  }

  function pick(R, a) {
    const focus = viewPoint(innerWidth / 2, innerHeight * 0.45).y;
    const o = origin();
    const full = R.inView >= R.cap;
    let best = null, bestScore = Infinity, bestView = null, bestViewScore = Infinity;
    for (const L of R.pending) {
      const r = L.el.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < innerHeight;
      const cy = r.top + scrollY - o.y + Math.min(r.height, innerHeight) / 2;
      const cx = r.left + scrollX - o.x + r.width / 2;
      let s = Math.abs(cy - focus) + Math.hypot(cx - a.x, cy - a.y) * 0.18;
      if (L.parent && L.parent.state === 0) s += 700;            // containers before their contents
      s -= Math.min(Math.sqrt(r.width * r.height) * 0.25, 220);   // big shapes first
      s += L.i * 0.05;
      if (inView && full) {                                       // screen is busy: look elsewhere first
        if (s < bestViewScore) { bestViewScore = s; bestView = L; }
        continue;
      }
      if (s < bestScore) { bestScore = s; best = L; best.inView = inView; }
    }
    if (!best && bestView) { best = bestView; best.inView = true; } // only on-screen work is left
    if (best) R.pending.delete(best);
    return best;
  }

  async function loop(R, a) {
    while (alive(R)) {
      const L = pick(R, a);
      if (!L) break;
      if (L.inView) R.inView++;
      await job(R, a, L);
      if (L.inView) R.inView--;
      if (!alive(R)) return;
      R.done++;
      ui.progress(R);
      await sleep((100 + Math.random() * 260) / R.sp); // a beat between layers, like a person picking the next one
    }
  }

  async function job(R, a, L) {
    L.state = 1;
    const sp = R.sp;
    const r = docRect(L.el);
    if (r.w < 1 && r.h < 1) { reveal(L, 'none', sp); L.state = 2; return; }
    await a.travel(r.x, r.y, sp);
    if (!alive(R)) return;
    const box = makeBox(a, L, r);
    if (L.media || L.paint) {
      const d = clamp(200 + Math.sqrt(r.w * r.h) * 0.5, 240, 800) / sp;
      box.grow(d);
      await a.go(r.x + r.w, r.y + r.h, d);
      if (!alive(R)) { box.el.remove(); return; }
      reveal(L, L.media ? 'media' : 'frame', sp);
    } else {
      box.show();
      reveal(L, 'none', sp);
    }
    if (L.texts.length) await type(R, a, L, r);
    if (!alive(R)) { box.el.remove(); return; }
    await sleep(L.media ? 420 / sp : 150 / sp);
    box.done();
    L.state = 2;
  }

  function reveal(L, mode, sp) {
    L.el.removeAttribute('data-rb-hide');
    if (reduce || mode === 'none' || !L.el.animate) return;
    try {
      if (mode === 'media') {
        L.el.animate(
          [{ clipPath: 'inset(0 0 100% 0)', filter: 'saturate(0) brightness(1.4)' }, { clipPath: 'inset(0 0 0% 0)', filter: 'none' }],
          { duration: 650 / sp, easing: 'cubic-bezier(.5,0,.2,1)' });
      } else {
        L.el.animate(
          [{ clipPath: 'inset(0 100% 100% 0)', opacity: 0.4 }, { clipPath: 'inset(0 0% 0% 0)', opacity: 1 }],
          { duration: 300 / sp, easing: 'cubic-bezier(.3,.7,.2,1)' });
      }
    } catch (e) { /* clip-path animation unsupported: plain reveal is fine */ }
  }

  function caretAt(t, off) {
    try {
      const rg = document.createRange();
      const len = t.node.length;
      if (!len) return null;
      if (off > 0) { rg.setStart(t.node, Math.min(off, len) - 1); rg.setEnd(t.node, Math.min(off, len)); }
      else { rg.setStart(t.node, 0); rg.setEnd(t.node, 1); }
      const rs = rg.getClientRects();
      const b = rs.length ? rs[rs.length - 1] : rg.getBoundingClientRect();
      if (!b || !b.height) return null;
      const p = viewPoint(off > 0 ? b.right : b.left, b.top);
      return { x: p.x, y: p.y, h: b.height };
    } catch (e) { return null; }
  }

  async function type(R, a, L, r) {
    const sp = R.sp;
    const T = L.texts;
    const total = T.reduce((s, t) => s + t.len, 0);
    const dur = clamp(total * 26, 220, 2200) / sp;
    if (!R.ghost) {
      if (!reduce && L.el.animate) {
        try { L.el.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: dur, easing: 'linear' }); } catch (e) {}
      }
      await a.go(r.x + r.w, r.y + r.h * 0.6, dur);
      return;
    }
    const steps = Math.max(1, Math.round(dur / 34));
    const per = Math.max(1, Math.ceil(total / steps));
    const caret = document.createElement('div');
    caret.className = 'rb-caret';
    caret.style.setProperty('--c', a.c);
    overlay().appendChild(caret);
    let ti = 0, off = 0, k = 0;
    while (alive(R)) {
      let budget = per;
      while (budget > 0 && ti < T.length) {
        const t = T[ti];
        const take = Math.min(budget, t.len - off);
        off += take; budget -= take;
        if (off >= t.len) { R.ghost.delete(t.range); ti++; off = 0; }
      }
      if (ti < T.length) {
        const t = T[ti];
        try {
          t.range.setStart(t.node, Math.min(off, t.node.length));
          t.range.setEnd(t.node, t.node.length);
        } catch (e) {}
        R.ghost.delete(t.range); R.ghost.add(t.range); // force a repaint of the shrunken range
      }
      const ct = ti < T.length ? T[ti] : T[T.length - 1];
      const co = ti < T.length ? off : ct.node.length;
      if (k++ % 2 === 0 || ti >= T.length) {
        const c = caretAt(ct, co);
        if (c) {
          caret.style.cssText += `;left:${c.x}px;top:${c.y}px;height:${c.h}px`;
          a.go(c.x + 2, c.y + c.h * 0.55, 70);
        }
      }
      if (ti >= T.length) break;
      await sleep(34);
    }
    caret.remove();
  }

  function barPoint() {
    const b = ui.el && ui.el.isConnected ? ui.el.getBoundingClientRect() : null;
    return b ? viewPoint(b.left + b.width / 2, b.top - 10) : viewPoint(innerWidth / 2, innerHeight - 60);
  }

  async function swarmHome(R) {
    if (reduce) return;
    const home = barPoint();
    R.agents.forEach((a, i) => {
      const ang = (i / R.agents.length) * Math.PI * 2;
      setTimeout(() => a.go(home.x + Math.cos(ang) * 90, home.y - 40 + Math.sin(ang) * 26, 650), i * 18);
    });
    await sleep(650 + R.agents.length * 18 + 250);
    R.agents.forEach(a => { a.el.style.opacity = '0'; });
    await sleep(320);
  }

  function cleanup(R) {
    R.alive = false;
    if (R.onKey) document.removeEventListener('keydown', R.onKey);
    for (const L of R.layers) L.el.removeAttribute('data-rb-hide');
    if (HL) CSS.highlights.delete('rb-ghost');
    document.documentElement.removeAttribute('data-rb-canvas');
    R.agents.forEach(a => a.remove());
    if (layer) layer.querySelectorAll('.rb-box,.rb-caret').forEach(e => e.remove());
    const sw = document.getElementById('rb-sweep');
    if (sw) sw.remove();
  }

  function skip(quiet) {
    if (!run) return;
    const R = run;
    if (R.mode === 'scroll') {
      const k = R.agents.length;
      cleanup(R);
      run = null;
      if (quiet !== true) ui.scrollDone(k, true);
      return;
    }
    const n = R.agents.length || Math.min(agentCount, R.layers.length);
    const ms = R.t0 ? now() - R.t0 : 0;
    cleanup(R);
    run = null;
    ui.done(n, ms, true);
  }

  /* --------------------------------------------------------------- bar */
  const ui = {
    el: null,
    timer: 0,
    mount() {
      if (CFG.trigger === 'none') return;
      const el = document.createElement('div');
      el.id = 'rb-bar';
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Rebuild this page');
      document.body.appendChild(el);
      this.el = el;
      el.addEventListener('click', e => {
        const b = e.target.closest('button[data-act]');
        if (!b) return;
        const act = b.dataset.act;
        if (act === 'go') start();
        else if (act === 'skip') skip();
        else if (act === 'count') {
          const i = AGENT_CHOICES.indexOf(agentCount);
          agentCount = AGENT_CHOICES[(i + 1) % AGENT_CHOICES.length];
          b.textContent = `${agentCount} agents`;
        } else if (act === 'close') this.idle();
      });
      this.idle();
    },
    dots(n) {
      return `<span class="rb-dots" aria-hidden="true">${[0, 1, 2].map(i => `<i style="--c:${colorOf(i)}"></i>`).join('')}</span>`;
    },
    idle() {
      if (!this.el) return;
      cancelAnimationFrame(this.timer);
      this.el.innerHTML = `${this.dots()}<span class="rb-hide-sm">Watch agents rebuild this site</span>
        <button type="button" class="rb-chip" data-act="count" aria-label="Change number of agents">${agentCount} agents</button>
        <button type="button" class="rb-go" data-act="go">Rebuild ↻</button>`;
    },
    running(n, total) {
      if (!this.el) return;
      this.el.innerHTML = `<span class="rb-live" aria-hidden="true"></span>${this.dots()}
        <span class="rb-stat"><b>${n}</b> agents</span>
        <span class="rb-stat"><b data-k="done">0</b> / ${total}<span class="rb-hide-sm"> layers</span></span>
        <span class="rb-prog rb-hide-sm"><i></i></span>
        <span class="rb-stat rb-hide-sm" data-k="time">0.0s</span>
        <button type="button" class="rb-chip" data-act="skip">Skip</button>`;
    },
    scrolling(n, total) {
      if (!this.el) return;
      this.el.innerHTML = `<span class="rb-live" aria-hidden="true"></span>${this.dots()}
        <span class="rb-stat"><b>${n}</b> agents<span class="rb-hide-sm"> build as you scroll</span></span>
        <span class="rb-stat"><b data-k="done">0</b> / ${total}<span class="rb-hide-sm"> layers</span></span>
        <span class="rb-prog rb-hide-sm"><i></i></span>
        <button type="button" class="rb-chip" data-act="skip">Show all</button>`;
    },
    scrollDone(n, skipped) {
      if (!this.el) return;
      const msg = skipped ? 'Whole page shown' : `Built by <b>${n} agents</b> as you scrolled`;
      this.el.innerHTML = `<span class="rb-ok" aria-hidden="true">✓</span><span role="status">${msg}</span>
        <button type="button" class="rb-go" data-act="go">Rebuild all ↻</button>
        <button type="button" class="rb-x" data-act="close" aria-label="Back to start">×</button>`;
    },
    progress(R) {
      if (!this.el) return;
      const d = this.el.querySelector('[data-k="done"]');
      if (d && d.textContent !== String(R.done)) d.textContent = R.done;
      const p = this.el.querySelector('.rb-prog i');
      if (p) p.style.transform = `scaleX(${(R.done / R.layers.length).toFixed(3)})`;
    },
    tick(R) {
      if (!this.el) return;
      const f = () => {
        if (!alive(R)) return;
        const t = this.el.querySelector('[data-k="time"]');
        if (t) t.textContent = ((now() - R.t0) / 1000).toFixed(1) + 's';
        this.timer = requestAnimationFrame(f);
      };
      this.timer = requestAnimationFrame(f);
    },
    done(n, ms, skipped) {
      if (!this.el) return;
      cancelAnimationFrame(this.timer);
      const msg = skipped
        ? 'Rebuild skipped'
        : `Rebuilt by <b>${n} agents</b> in <b>${(ms / 1000).toFixed(1)}s</b>`;
      this.el.innerHTML = `<span class="rb-ok" aria-hidden="true">✓</span><span role="status">${msg}</span>
        <button type="button" class="rb-go" data-act="go">Replay ↻</button>
        <button type="button" class="rb-x" data-act="close" aria-label="Back to start">×</button>`;
    },
  };

  /* ------------------------------------------------------------- boot */
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-rebuild]');
    if (t) { e.preventDefault(); start(); }
  });
  const boot = () => {
    ui.mount();
    if (CFG.autostart) setTimeout(() => start(), 900);
    if (CFG.scroll) {
      // the page may be mounted by a framework a moment after this script runs
      let tries = 0;
      const attempt = () => { if (!startScroll() && ++tries < 60) setTimeout(attempt, 100); };
      attempt();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.Rebuild = { start, skip: () => skip(), startScroll, get running() { return !!run; } };
})();
