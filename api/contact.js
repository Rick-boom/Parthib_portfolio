/**
 * POST /api/contact
 * Vercel serverless function for the portfolio contact form.
 *
 * Sends each message to your inbox through Gmail SMTP (nodemailer), with:
 *   - field validation (the same rules the form shows)
 *   - a honeypot field and a minimum fill time, which drop bots silently
 *   - a per-IP rate limit (5 messages per 10 minutes, per warm instance)
 *   - CR/LF stripping so nobody can inject mail headers
 *   - Reply-To set to the sender, so you answer straight from Gmail
 *
 * Environment variables (Vercel > Project > Settings > Environment Variables):
 *   GMAIL_USER          your Gmail address, e.g. parthibsaha.11sc2020@gmail.com
 *   GMAIL_APP_PASSWORD  a 16-character Google App Password (not your normal password)
 *   CONTACT_TO          optional; where messages go (defaults to GMAIL_USER)
 *   ALLOWED_ORIGINS     optional; comma-separated origins allowed to post, e.g.
 *                       https://parthib-portfolio-ebon.vercel.app (same-origin always works)
 *   CALLMEBOT_PHONE, CALLMEBOT_API_KEY  optional; also sends a WhatsApp ping via CallMeBot
 *   CONTACT_DRY_RUN     optional; "1" builds the email without sending it (for local tests)
 */
import nodemailer from 'nodemailer';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hits = new Map(); // ip -> timestamps; resets when the instance goes cold

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

const oneLine = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20_000) throw Object.assign(new Error('Message is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function rateLimited(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin form posts and server-side tools
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { if (host && new URL(origin).host === host) return true; } catch { return false; }
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

export function validate(body) {
  const name = oneLine(body.name, 80);
  const email = oneLine(body.email, 120);
  const message = String(body.message ?? '').trim().slice(0, 3000);
  if (name.length < 2) return { error: 'Add your name, at least 2 characters.' };
  if (!EMAIL_RE.test(email)) return { error: 'Enter an email address like you@example.com.' };
  if (message.length < 10) return { error: 'Write at least 10 characters so I know what you need.' };
  return { name, email, message };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { ok: false, error: 'Use POST.' }); }
  if (!originAllowed(req)) return send(res, 403, { ok: false, error: 'This origin may not post here.' });

  let body;
  try { body = await readBody(req); }
  catch (err) { return send(res, err.status || 400, { ok: false, error: err.status ? err.message : 'Send the form as JSON.' }); }

  // Bots fill the hidden "company" field or submit instantly. Pretend success so they learn nothing.
  if (oneLine(body.company, 200) || Number(body.elapsedMs) < MIN_FILL_MS) return send(res, 200, { ok: true });

  const v = validate(body);
  if (v.error) return send(res, 400, { ok: false, error: v.error });

  if (rateLimited(clientIp(req))) return send(res, 429, { ok: false, error: 'Too many messages. Try again in 10 minutes.' });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const dryRun = process.env.CONTACT_DRY_RUN === '1';
  if (!dryRun && (!user || !pass)) {
    console.error('contact: GMAIL_USER or GMAIL_APP_PASSWORD is not set');
    return send(res, 500, { ok: false, error: 'The contact form is not configured yet.' });
  }

  const to = process.env.CONTACT_TO || user || 'dry-run@example.com';
  const transporter = dryRun
    ? nodemailer.createTransport({ jsonTransport: true })
    : nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });

  const text = `${v.message}\n\nFrom: ${v.name} <${v.email}>\nSent from your portfolio contact form.`;
  const html = `<p style="white-space:pre-wrap;font:15px/1.6 system-ui,sans-serif">${escapeHtml(v.message)}</p>
<p style="font:13px/1.5 system-ui,sans-serif;color:#666">From ${escapeHtml(v.name)} &lt;${escapeHtml(v.email)}&gt;<br>Sent from your portfolio contact form.</p>`;

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio contact" <${user || to}>`,
      to,
      replyTo: { name: v.name, address: v.email },
      subject: `Portfolio: message from ${v.name}`,
      text,
      html,
    });
    if (dryRun) console.log('contact dry run:', info.message);
    // Optional WhatsApp ping through CallMeBot, as the previous backend did. Never blocks the reply.
    if (!dryRun && process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_API_KEY) {
      try {
        const note = `Portfolio message\nName: ${v.name}\nEmail: ${v.email}\n${v.message.slice(0, 600)}`;
        const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(process.env.CALLMEBOT_PHONE)}&text=${encodeURIComponent(note)}&apikey=${encodeURIComponent(process.env.CALLMEBOT_API_KEY)}`;
        const wa = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (!wa.ok) console.error('contact: WhatsApp notification failed', wa.status);
      } catch (waErr) {
        console.error('contact: WhatsApp notification error', waErr && waErr.message);
      }
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('contact: send failed', err && err.message);
    return send(res, 502, { ok: false, error: 'The mail server did not accept the message.' });
  }
}
