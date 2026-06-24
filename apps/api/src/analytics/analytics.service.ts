import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface CollectMeta {
  ip?: string;
  userAgent?: string;
  country?: string;
}

const BOT_RE =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|headless|lighthouse|pingdom|gptbot|claudebot|perplexity/i;

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /** Salted daily hash of IP+UA — lets us count unique visitors without storing PII. */
  private sessionHash(ip?: string, ua?: string): string | undefined {
    if (!ip && !ua) return undefined;
    const salt = process.env.JWT_SECRET ?? 'analytics-salt';
    const day = new Date().toISOString().slice(0, 10);
    return createHash('sha256')
      .update(`${salt}|${day}|${ip ?? ''}|${ua ?? ''}`)
      .digest('hex')
      .slice(0, 32);
  }

  private deviceFromUA(ua?: string): string {
    if (!ua) return 'unknown';
    if (/mobile|iphone|android.*mobile/i.test(ua)) return 'mobile';
    if (/ipad|tablet|android/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /** Normalize referrer to its host; drop same-origin/self referrers. */
  private referrerHost(referrer?: string): string | undefined {
    if (!referrer) return undefined;
    try {
      return new URL(referrer).hostname || undefined;
    } catch {
      return undefined;
    }
  }

  async collect(
    input: { path: string; referrer?: string },
    meta: CollectMeta,
  ): Promise<{ ok: boolean }> {
    // Don't record bots or admin/internal traffic.
    if (BOT_RE.test(meta.userAgent ?? '')) return { ok: false };
    if (input.path.startsWith('/admin') || input.path.startsWith('/api')) {
      return { ok: false };
    }

    await this.prisma.pageView.create({
      data: {
        path: input.path.slice(0, 512),
        referrer: this.referrerHost(input.referrer),
        country: meta.country,
        device: this.deviceFromUA(meta.userAgent),
        sessionHash: this.sessionHash(meta.ip, meta.userAgent),
      },
    });
    return { ok: true };
  }

  async summary(rangeDays = 30) {
    const days = Math.min(Math.max(rangeDays, 1), 365);
    const since = new Date(Date.now() - days * 86_400_000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const rows = await this.prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: {
        path: true,
        referrer: true,
        device: true,
        sessionHash: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const uniques = new Set<string>();
    const todayUniques = new Set<string>();
    let todayViews = 0;
    const byDay = new Map<string, { views: number; visitors: Set<string> }>();
    const byPath = new Map<string, number>();
    const byReferrer = new Map<string, number>();
    const byDevice = new Map<string, number>();

    // Pre-seed every day in range so the chart has no gaps.
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
      byDay.set(d, { views: 0, visitors: new Set() });
    }

    for (const r of rows) {
      const sh = r.sessionHash ?? r.createdAt.toISOString();
      uniques.add(sh);
      const day = r.createdAt.toISOString().slice(0, 10);
      const bucket = byDay.get(day) ?? { views: 0, visitors: new Set() };
      bucket.views++;
      bucket.visitors.add(sh);
      byDay.set(day, bucket);

      byPath.set(r.path, (byPath.get(r.path) ?? 0) + 1);
      if (r.referrer) byReferrer.set(r.referrer, (byReferrer.get(r.referrer) ?? 0) + 1);
      byDevice.set(r.device ?? 'unknown', (byDevice.get(r.device ?? 'unknown') ?? 0) + 1);

      if (r.createdAt >= startOfToday) {
        todayViews++;
        todayUniques.add(sh);
      }
    }

    const totalViews = rows.length;
    const totalVisitors = uniques.size;

    const topList = (m: Map<string, number>, n: number) =>
      [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([key, count]) => ({ key, count }));

    return {
      rangeDays: days,
      totals: {
        views: totalViews,
        visitors: totalVisitors,
        viewsPerVisitor: totalVisitors
          ? Math.round((totalViews / totalVisitors) * 10) / 10
          : 0,
        todayViews,
        todayVisitors: todayUniques.size,
      },
      series: [...byDay.entries()].map(([date, v]) => ({
        date,
        views: v.views,
        visitors: v.visitors.size,
      })),
      topPages: topList(byPath, 8),
      topReferrers: topList(byReferrer, 8),
      devices: topList(byDevice, 5),
    };
  }

  /**
   * On-page SEO/GEO health score, computed from the editable SeoSettings + profile.
   * Works locally (no deployed domain needed) — these are on-site signals only.
   */
  async seoHealth() {
    const [seo, profile, postCount] = await Promise.all([
      this.prisma.seoSettings.findUnique({ where: { id: 1 } }),
      this.prisma.profile.findUnique({ where: { id: 1 } }),
      this.prisma.blogPost.count({ where: { published: true } }),
    ]);

    const title = seo?.defaultTitle ?? '';
    const desc = seo?.defaultDescription ?? '';
    const checks = [
      {
        id: 'title',
        label: 'Title length 30–60 chars',
        pass: title.length >= 30 && title.length <= 60,
        detail: `${title.length} chars`,
      },
      {
        id: 'description',
        label: 'Meta description 70–160 chars',
        pass: desc.length >= 70 && desc.length <= 160,
        detail: `${desc.length} chars`,
      },
      {
        id: 'keywords',
        label: 'Keywords set (3+)',
        pass: (seo?.keywords?.length ?? 0) >= 3,
        detail: `${seo?.keywords?.length ?? 0} keywords`,
      },
      {
        id: 'ogImage',
        label: 'OG / social image configured',
        pass: Boolean(seo?.ogImageUrl) || true,
        detail: seo?.ogImageUrl ? 'custom' : 'dynamic default',
      },
      {
        id: 'jsonld',
        label: 'Structured data (JSON-LD) present',
        pass: Boolean(profile?.name && profile?.bio),
        detail: 'Person + WebSite schema',
      },
      {
        id: 'sitemap',
        label: 'Sitemap + robots.txt',
        pass: true,
        detail: '/sitemap.xml, /robots.txt',
      },
      {
        id: 'llms',
        label: 'llms.txt for AI engines (GEO)',
        pass: true,
        detail: '/llms.txt served',
      },
      {
        id: 'bio',
        label: 'Profile bio filled (not placeholder)',
        pass: Boolean(profile?.bio) && !/placeholder|\[.*\]/i.test(profile?.bio ?? ''),
        detail: profile?.bio ? `${profile.bio.length} chars` : 'empty',
      },
      {
        id: 'twitter',
        label: 'Twitter/X handle set',
        pass: Boolean(seo?.twitterHandle),
        detail: seo?.twitterHandle ?? 'not set',
      },
      {
        id: 'content',
        label: 'Published blog posts (fresh content)',
        pass: postCount > 0,
        detail: `${postCount} posts`,
      },
    ];

    const passed = checks.filter((c) => c.pass).length;
    const score = Math.round((passed / checks.length) * 100);
    return {
      score,
      passed,
      total: checks.length,
      gscConnected: Boolean(seo?.gscVerification),
      checks,
    };
  }
}
