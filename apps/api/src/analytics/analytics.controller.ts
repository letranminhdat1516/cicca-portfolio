import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { CollectDto } from './dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  /** Public, unauthenticated beacon endpoint hit by the web tracker. */
  @Post('collect')
  collect(@Body() body: CollectDto, @Req() req: Request) {
    const fwd = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
    const ip = fwd || req.socket.remoteAddress || undefined;
    const country =
      (req.headers['cf-ipcountry'] as string | undefined) ??
      (req.headers['x-vercel-ip-country'] as string | undefined) ??
      undefined;
    return this.analytics.collect(body, {
      ip,
      userAgent: req.headers['user-agent'],
      country: country && country !== 'XX' ? country : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  summary(@Query('range') range?: string) {
    const days = range ? parseInt(range.replace(/\D/g, ''), 10) || 30 : 30;
    return this.analytics.summary(days);
  }

  @UseGuards(JwtAuthGuard)
  @Get('seo-health')
  seoHealth() {
    return this.analytics.seoHealth();
  }
}
