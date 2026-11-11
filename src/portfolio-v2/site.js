/* Page behaviour: copy keys, the contact form (posts to /api/contact), and the hairline wires
   that join matched lines across the two graphite panes. Every init returns a cleanup. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function copyText(btn, text) {
  const done = (label) => { const old = btn.dataset.label || btn.textContent; btn.dataset.label = old; btn.textContent = label; setTimeout(() => { btn.textContent = old; }, 1600); };
  try {
    navigator.clipboard.writeText(text).then(() => done('Copied'), () => done('Select and copy'));
  } catch (e) { done('Select and copy'); }
}

export function initCopy(root) {
  const onClick = (e) => {
    const btn = e.target.closest('[data-copy], [data-copy-from]');
    if (!btn || !root.contains(btn)) return;
    const from = btn.getAttribute('data-copy-from');
    const text = from ? (document.getElementById(from) || {}).textContent : btn.getAttribute('data-copy');
    if (text) copyText(btn, text.trim());
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

export function initContactForm(root, { endpoint = '/api/contact' } = {}) {
  const form = root.querySelector('#contact-form');
  if (!form) return () => {};
  const status = form.querySelector('#cf-status');
  const submit = form.querySelector('button[type="submit"]');
  const startedAt = Date.now();
  const fields = {
    name: { el: form.querySelector('#cf-name'), help: form.querySelector('#cf-name-help'), check: (v) => (v.trim().length >= 2 ? '' : 'Add your name, at least 2 characters.') },
    email: { el: form.querySelector('#cf-email'), help: form.querySelector('#cf-email-help'), check: (v) => (EMAIL_RE.test(v.trim()) ? '' : 'Enter an email address like you@example.com.') },
    message: { el: form.querySelector('#cf-message'), help: form.querySelector('#cf-message-help'), check: (v) => (v.trim().length >= 10 ? '' : 'Write at least 10 characters so I know what you need.') },
  };
  const setField = (f, msg) => {
    f.help.textContent = msg;
    f.help.classList.toggle('is-error', !!msg);
    if (msg) { f.el.setAttribute('aria-invalid', 'true'); f.el.setAttribute('aria-describedby', f.help.id); }
    else { f.el.removeAttribute('aria-invalid'); }
  };
  const setStatus = (msg, kind) => { status.textContent = msg; status.classList.toggle('is-error', kind === 'error'); status.classList.toggle('is-ok', kind === 'ok'); };
  const onBlur = (e) => { const f = Object.values(fields).find((x) => x.el === e.target); if (f && f.el.value) setField(f, f.check(f.el.value)); };

  const onSubmit = async (e) => {
    e.preventDefault();
    let firstBad = null;
    for (const f of Object.values(fields)) { const msg = f.check(f.el.value); setField(f, msg); if (msg && !firstBad) firstBad = f.el; }
    if (firstBad) { firstBad.focus(); setStatus('', ''); return; }
    const payload = {
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      message: fields.message.el.value.trim(),
      company: form.querySelector('#cf-company').value,
      elapsedMs: Date.now() - startedAt,
    };
    submit.disabled = true; submit.setAttribute('aria-busy', 'true');
    const label = submit.textContent; submit.textContent = 'Sending';
    setStatus('', '');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `The server answered ${res.status}.`);
      form.reset();
      setStatus('Sent. I will reply to the email you gave.', 'ok');
    } catch (err) {
      setStatus(`Not sent: ${err.message === 'Failed to fetch' ? 'the server could not be reached' : err.message} Email me at parthibsaha.11sc2020@gmail.com instead.`, 'error');
    } finally {
      submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = label;
    }
  };
  form.addEventListener('submit', onSubmit);
  form.addEventListener('focusout', onBlur);
  return () => { form.removeEventListener('submit', onSubmit); form.removeEventListener('focusout', onBlur); };
}

/* hairline elbows from a value in the left pane to the tag it produces in the right pane */
export function initWires(root) {
  const map = root.querySelector('[data-map]');
  if (!map) return () => {};
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'map__wires');
  svg.setAttribute('aria-hidden', 'true');
  map.appendChild(svg);
  const draw = () => {
    const m = map.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${m.width} ${m.height}`);
    svg.setAttribute('width', m.width); svg.setAttribute('height', m.height);
    svg.textContent = '';
    if (m.width < 700) return;
    map.querySelectorAll('[data-wire]').forEach((from, i) => {
      const to = map.querySelector(`[data-wire-to="${from.dataset.wire}"]`);
      if (!to) return;
      const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const x1 = a.right - m.left + 6, y1 = a.top - m.top + a.height / 2;
      const pane = to.closest('.pane');
      const x2 = (pane ? pane.getBoundingClientRect().left + 12 : b.left - 6) - m.left, y2 = b.top - m.top + b.height / 2;
      const mid = Math.max(x1 + 16, Math.min(x2 - 16, x1 + (x2 - x1) * (0.35 + i * 0.1)));
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', `M${x1} ${y1} H${mid} V${y2} H${x2}`);
      svg.appendChild(path);
      [[x1, y1], [x2, y2]].forEach(([cx, cy]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', 2); svg.appendChild(c); });
    });
  };
  draw();
  let ro = null;
  if ('ResizeObserver' in window) { ro = new ResizeObserver(draw); ro.observe(map); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  return () => { ro && ro.disconnect(); svg.remove(); };
}

export function initSite(root = document) {
  const offs = [initCopy(root), initContactForm(root), initWires(root)];
  return () => offs.forEach((f) => f());
}
