import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ContactDto } from './contact.dto';
import { ContactService, RateLimitedException } from './contact.service';

/**
 * Client IP behind Cloudflare Tunnel → Next.js /api rewrite → API.
 * Only cf-connecting-ip is used: Cloudflare overwrites it, and the origin port is
 * bound to localhost so requests can't skip Cloudflare to forge it. The leftmost
 * X-Forwarded-For entry is client-controlled, so it is never trusted. Abuse that
 * still slips through is bounded by the global caps in ContactService.
 */
export function clientIp(req: Request): string | undefined {
  const cf = (req.headers['cf-connecting-ip'] as string | undefined)?.trim();
  if (cf) return cf;
  return req.socket?.remoteAddress || undefined;
}

function pageOrigin(req: Request): string | undefined {
  const ref = req.headers.referer ?? req.headers.origin;
  return typeof ref === 'string' ? ref.slice(0, 300) : undefined;
}

@Controller('contact')
export class ContactController {
  constructor(private contact: ContactService) {}

  /** Public, unauthenticated "write me a letter" endpoint. */
  @Post()
  @HttpCode(200)
  async send(
    @Body() body: ContactDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return await this.contact.send(body, {
        ip: clientIp(req),
        origin: pageOrigin(req),
      });
    } catch (err) {
      if (err instanceof RateLimitedException) {
        res.setHeader('Retry-After', String(err.retryAfterSec));
      }
      throw err;
    }
  }
}
