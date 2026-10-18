/** Email bodies for the contact form. Every user-supplied value is escaped. */

import { TOPICS, type Topic } from './contact.dto';

const SITE = 'https://letranminhdat.com';
export const CV_URL = `${SITE}/cv/letranminhdat-cv.pdf`;
export const WORK_URL = `${SITE}/#work`;

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  topic?: Topic;
}

export interface MessageMeta {
  receivedAt: Date;
  origin?: string;
}

export interface MailBody {
  subject: string;
  text: string;
  html: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Header-safe single line (subjects): collapse any CR/LF/whitespace runs. */
export function oneLine(s: string): string {
  return s
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function firstName(name: string): string {
  const first = oneLine(name).split(' ')[0] || 'there';
  return first.slice(0, 40);
}

function formatTime(d: Date): string {
  const local = d.toLocaleString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return `${local} (GMT+7) · ${d.toISOString()}`;
}

const wrap = (inner: string) =>
  `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f6fb;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#03061a">` +
  `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dce4ff;border-radius:12px;padding:24px 28px;line-height:1.6;font-size:15px">` +
  inner +
  `</div></body></html>`;

/** Notification to me: who wrote, how to reach them, what they said. */
export function notificationMail(
  l: ContactMessage,
  meta: MessageMeta,
): MailBody {
  const when = formatTime(meta.receivedAt);
  const origin = meta.origin || 'unknown';
  // Only a whitelisted key maps to a label; anything else is dropped.
  const topic =
    l.topic && Object.prototype.hasOwnProperty.call(TOPICS, l.topic)
      ? TOPICS[l.topic]
      : undefined;
  const subject = topic
    ? `New message from ${oneLine(l.name)} — ${topic}`
    : `New message from ${oneLine(l.name)}`;
  const text = [
    `New message from the portfolio contact form.`,
    ``,
    `Name:    ${l.name}`,
    `Email:   ${l.email}`,
    ...(topic ? [`Topic:   ${topic}`] : []),
    `Sent:    ${when}`,
    `Origin:  ${origin}`,
    ``,
    `Message:`,
    l.message,
    ``,
    `— Reply to this email to answer ${l.name} directly.`,
  ].join('\n');
  const row = (k: string, v: string) =>
    `<tr><td style="padding:2px 16px 2px 0;color:#5b6687;white-space:nowrap">${k}</td><td style="padding:2px 0">${v}</td></tr>`;
  const html = wrap(
    `<p style="margin:0 0 12px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#2f6bff">New message</p>` +
      `<table style="border-collapse:collapse;font-size:14px;margin-bottom:16px">` +
      row('Name', escapeHtml(l.name)) +
      row(
        'Email',
        `<a href="mailto:${escapeHtml(l.email)}" style="color:#1c3fd6">${escapeHtml(l.email)}</a>`,
      ) +
      (topic ? row('Topic', escapeHtml(topic)) : '') +
      row('Sent', escapeHtml(when)) +
      row('Origin', escapeHtml(origin)) +
      `</table>` +
      `<div style="white-space:pre-wrap;border-left:3px solid #2f6bff;padding:4px 0 4px 14px">${escapeHtml(l.message)}</div>` +
      `<p style="margin:16px 0 0;font-size:13px;color:#5b6687">Reply to this email to answer ${escapeHtml(l.name)} directly.</p>`,
  );
  return { subject, text, html };
}

/**
 * Auto-reply to the visitor. It deliberately does not echo their message:
 * the recipient address is visitor-supplied, so quoting free text back would
 * turn the form into a relay for whatever someone types in.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autoReplyMail(_l: ContactMessage): MailBody {
  // No visitor-supplied text at all (not even the name): the recipient address is
  // typed by the visitor, so anything echoed back could be aimed at a third party.
  const subject = 'Thanks for your message';
  const text = [
    `Hi there,`,
    ``,
    `Thanks for your message, it landed safely. I read every one myself and usually reply within 1–2 days (I'm on GMT+7).`,
    ``,
    `While you wait:`,
    `- CV: ${CV_URL}`,
    `- Selected work: ${WORK_URL}`,
    ``,
    `Talk soon,`,
    `Dat (cicca)`,
    SITE,
  ].join('\n');
  const link = (href: string, label: string) =>
    `<a href="${href}" style="color:#1c3fd6">${label}</a>`;
  const html = wrap(
    `<p style="margin:0 0 14px">Hi there,</p>` +
      `<p style="margin:0 0 14px">Thanks for your message, it landed safely. I read every one myself and usually reply within 1–2 days (I'm on GMT+7).</p>` +
      `<p style="margin:0 0 6px">While you wait:</p>` +
      `<ul style="margin:0 0 14px;padding-left:20px">` +
      `<li>${link(CV_URL, 'CV')}</li>` +
      `<li>${link(WORK_URL, 'Selected work')}</li>` +
      `</ul>` +
      `<p style="margin:0">Talk soon,<br/><strong>Dat (cicca)</strong><br/>${link(SITE, 'letranminhdat.com')}</p>`,
  );
  return { subject, text, html };
}
