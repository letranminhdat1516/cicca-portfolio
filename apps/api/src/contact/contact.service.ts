import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import type { ContactDto } from './contact.dto';
import { autoReplyMail, MailBody, notificationMail } from './contact.mail';
import { RateLimiter } from './rate-limiter';

export const RESEND_URL = 'https://api.resend.com/emails';
export const DEFAULT_FROM = 'Le Tran Minh Dat <hello@letranminhdat.com>';
export const DEFAULT_TO = 'datltmse@gmail.com';

/** 3 letters per 10 minutes and 10 per day, per client IP. */
export const RATE_WINDOWS = [
  { ms: 10 * 60_000, max: 3 },
  { ms: 24 * 60 * 60_000, max: 10 },
];

export interface ContactMeta {
  ip?: string;
  origin?: string;
}

export class RateLimitedException extends HttpException {
  constructor(readonly retryAfterSec: number) {
    super(
      { ok: false, error: 'rate_limited', retryAfter: retryAfterSec },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

@Injectable()
export class ContactService {
  private readonly log = new Logger(ContactService.name);
  private warnedNoKey = false;
  limiter = new RateLimiter(RATE_WINDOWS);
  /** IP-independent caps, so spoofed or rotating IPs can't turn the form into a mailer. */
  globalLimiter = new RateLimiter([{ ms: 24 * 60 * 60_000, max: 60 }]);
  /** Auto-replies go to a visitor-typed address: one per address per day, 30 a day overall. */
  replyLimiter = new RateLimiter([{ ms: 24 * 60 * 60_000, max: 1 }]);
  replyGlobalLimiter = new RateLimiter([{ ms: 24 * 60 * 60_000, max: 30 }]);

  async send(input: ContactDto, meta: ContactMeta): Promise<{ ok: true }> {
    // Bots fill the hidden field; pretend it worked so they move on.
    if (input.website && input.website.trim() !== '') {
      this.log.log(`honeypot tripped (ip ${meta.ip ?? 'unknown'})`);
      return { ok: true };
    }

    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
      if (!this.warnedNoKey) {
        this.log.warn('RESEND_API_KEY is not set; contact form is disabled');
        this.warnedNoKey = true;
      }
      throw new HttpException(
        { ok: false, error: 'mail_not_configured' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const rate = this.limiter.take(meta.ip || 'unknown');
    if (rate.ok === false) throw new RateLimitedException(rate.retryAfterSec);
    const global = this.globalLimiter.take('all');
    if (global.ok === false)
      throw new RateLimitedException(global.retryAfterSec);

    const from = process.env.CONTACT_FROM?.trim() || DEFAULT_FROM;
    const to = (process.env.CONTACT_TO?.trim() || DEFAULT_TO)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const letter = {
      name: input.name,
      email: input.email,
      message: input.message,
    };

    try {
      await this.resend(key, {
        from,
        to,
        reply_to: letter.email,
        ...notificationMail(letter, {
          receivedAt: new Date(),
          origin: meta.origin,
        }),
      });
    } catch (err) {
      this.log.error(`contact notification failed: ${(err as Error).message}`);
      throw new HttpException(
        { ok: false, error: 'send_failed' },
        HttpStatus.BAD_GATEWAY,
      );
    }

    const replyOk =
      this.replyLimiter.take(letter.email.toLowerCase()).ok &&
      this.replyGlobalLimiter.take('all').ok;
    if (!replyOk) {
      this.log.log('auto-reply skipped (cap reached)');
      return { ok: true };
    }

    try {
      await this.resend(key, {
        from,
        to: [letter.email],
        reply_to: to[0],
        ...autoReplyMail(letter),
      });
    } catch (err) {
      // The letter reached me; a missing courtesy reply is not the visitor's problem.
      this.log.warn(`contact auto-reply failed: ${(err as Error).message}`);
    }

    return { ok: true };
  }

  private async resend(
    key: string,
    mail: MailBody & { from: string; to: string[]; reply_to: string },
  ): Promise<void> {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mail),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 300);
      throw new Error(`Resend ${res.status} ${detail}`);
    }
  }
}
