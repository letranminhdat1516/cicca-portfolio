/** Email bodies for the contact form. Every user-supplied value is escaped. */

import { TOPICS, type Topic } from './contact.dto';

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

/** "18 Oct 2026, 14:05 (GMT+7)" — my local time, which is what I read mail in. */
function formatLocal(d: Date): string {
  const local = d.toLocaleString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return `${local} (GMT+7)`;
}

// ─── email-client-safe layout ───────────────────────────────────────────────
// Table-based, inline styles only, no images, no web fonts. Colours are chosen
// so Gmail's dark-mode inversion still leaves readable contrast.

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const NAVY = '#0B1440';
const INK = '#1F2937';
const MUTED = '#6B7280';
const LINE = '#E5E7EB';

/** Header bar: a title in white and a small muted line under it. */
const header = (title: string, sub: string) =>
  `<tr><td bgcolor="${NAVY}" style="background:${NAVY};padding:20px 28px;border-radius:12px 12px 0 0">` +
  `<div style="font-family:${FONT};font-size:17px;font-weight:600;line-height:1.3;color:#FFFFFF">${title}</div>` +
  `<div style="font-family:${FONT};font-size:13px;line-height:1.4;color:#A5B4D4;padding-top:2px">${sub}</div>` +
  `</td></tr>`;

const footer = (line: string) =>
  `<tr><td style="padding:16px 28px 20px;border-top:1px solid ${LINE};font-family:${FONT};font-size:12px;line-height:1.5;color:${MUTED}">${line}</td></tr>`;

const p = (inner: string, last = false) =>
  `<p style="margin:0 0 ${last ? 0 : 16}px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${inner}</p>`;

/** Full document: centred 560px card on a light grey canvas. */
function layout(preheader: string, rows: string): string {
  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">` +
    `</head><body style="margin:0;padding:0;background:#F3F4F6">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F3F4F6" style="background:#F3F4F6">` +
    `<tr><td align="center" style="padding:24px 12px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid ${LINE};border-radius:12px;border-collapse:separate">` +
    rows +
    `</table></td></tr></table></body></html>`
  );
}

/** Notification to me: who wrote, how to reach them, what they said. */
export function notificationMail(
  l: ContactMessage,
  meta: MessageMeta,
): MailBody {
  const when = formatLocal(meta.receivedAt);
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
    `Received: ${when} · ${meta.receivedAt.toISOString()}`,
    ``,
    `Name:    ${l.name}`,
    `Email:   ${l.email}`,
    ...(topic ? [`Topic:   ${topic}`] : []),
    `Page:    ${origin}`,
    ``,
    `Message:`,
    l.message,
    ``,
    `--`,
    `Reply to this email to answer them directly.`,
  ].join('\n');

  const row = (k: string, v: string) =>
    `<tr>` +
    `<td valign="top" style="padding:8px 16px 8px 0;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:13px;color:${MUTED};white-space:nowrap;width:72px">${k}</td>` +
    `<td valign="top" style="padding:8px 0;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:14px;color:${INK};word-break:break-word">${v}</td>` +
    `</tr>`;
  const email = escapeHtml(l.email);
  const html = layout(
    `New message from ${escapeHtml(oneLine(l.name))}`,
    header('New message', `Received ${escapeHtml(when)}`) +
      `<tr><td style="padding:24px 28px 8px">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">` +
      row('Name', escapeHtml(l.name)) +
      row(
        'Email',
        `<a href="mailto:${email}" style="color:#1C3FD6;text-decoration:underline">${email}</a>`,
      ) +
      (topic ? row('Topic', escapeHtml(topic)) : '') +
      row('Page', escapeHtml(origin)) +
      `</table></td></tr>` +
      `<tr><td style="padding:16px 28px 24px">` +
      `<div style="font-family:${FONT};font-size:13px;color:${MUTED};padding-bottom:8px">Message</div>` +
      `<div style="background:#F3F4F6;border:1px solid ${LINE};border-radius:8px;padding:14px 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};white-space:pre-wrap;word-break:break-word">${escapeHtml(l.message)}</div>` +
      `</td></tr>` +
      footer('Reply to this email to answer them directly.'),
  );
  return { subject, text, html };
}

/**
 * Auto-reply to the visitor. It contains no visitor-supplied text at all (not
 * the name, topic or message) and no links: the recipient address is typed by
 * the visitor, so anything echoed back could be aimed at a third party.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function autoReplyMail(_l: ContactMessage): MailBody {
  const subject = 'Thanks for getting in touch';
  const LINES = [
    "Thanks for reaching out. I've received your message and will get back to you within 1–2 business days.",
    "If it's urgent, just reply to this email.",
  ];
  const text = [
    `Hi there,`,
    ``,
    ...LINES.flatMap((l) => [l, '']),
    `Best regards,`,
    `Le Tran Minh Dat`,
    `AI-Native Software Engineer`,
    ``,
    `--`,
    `This is an automatic confirmation.`,
  ].join('\n');
  const html = layout(
    LINES[0],
    header('Le Tran Minh Dat', 'AI-Native Software Engineer') +
      `<tr><td style="padding:28px 28px 24px">` +
      p('Hi there,') +
      LINES.map((l) => p(escapeHtml(l))).join('') +
      p(
        `Best regards,<br><span style="font-weight:600">Le Tran Minh Dat</span>`,
        true,
      ) +
      `</td></tr>` +
      footer('This is an automatic confirmation.'),
  );
  return { subject, text, html };
}
