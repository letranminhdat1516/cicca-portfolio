import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { rarityFromLevel } from './rarity';

const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const GH = 'https://api.github.com';

interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export interface LangStat {
  name: string;
  repos: number;
  pct: number;
}
export interface RepoStat {
  name: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
}

@Injectable()
export class GithubService {
  private readonly log = new Logger(GithubService.name);

  constructor(private prisma: PrismaService) {}

  private async username(): Promise<string | undefined> {
    const seo = await this.prisma.seoSettings.findUnique({ where: { id: 1 } });
    return seo?.githubUsername || process.env.GITHUB_USERNAME || undefined;
  }

  /** Cached snapshot; refreshes in the background path only via refresh(). */
  async getStats() {
    const cached = await this.prisma.githubStats.findUnique({ where: { id: 1 } });
    if (cached && Date.now() - cached.fetchedAt.getTime() < TTL_MS) return cached;
    // Stale or missing: try a refresh, but fall back to whatever we have.
    try {
      return await this.refresh();
    } catch (e) {
      this.log.warn(`GitHub refresh failed: ${String(e)}`);
      return cached ?? null;
    }
  }

  private async ghGet<T>(path: string): Promise<T> {
    const res = await fetch(`${GH}${path}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-app' },
    });
    if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  /** Fetch from GitHub (unauthenticated), recompute aggregates, cache, sync skills. */
  async refresh() {
    const username = await this.username();
    if (!username) throw new Error('No GitHub username configured');

    const user = await this.ghGet<{
      login: string;
      name: string | null;
      avatar_url: string | null;
      followers: number;
      public_repos: number;
      created_at: string;
    }>(`/users/${username}`);

    const repos = await this.ghGet<GhRepo[]>(
      `/users/${username}/repos?per_page=100&sort=pushed`,
    );
    const owned = repos.filter((r) => !r.fork);

    const totalStars = owned.reduce((s, r) => s + (r.stargazers_count ?? 0), 0);

    // Languages by primary language per repo, plus a star-weighted weight for leveling.
    const repoCount = new Map<string, number>();
    const weight = new Map<string, number>();
    for (const r of owned) {
      if (!r.language) continue;
      repoCount.set(r.language, (repoCount.get(r.language) ?? 0) + 1);
      const w = 1 + Math.log2(1 + (r.stargazers_count ?? 0));
      weight.set(r.language, (weight.get(r.language) ?? 0) + w);
    }
    const totalRepoLang = [...repoCount.values()].reduce((a, b) => a + b, 0) || 1;
    const topLanguages: LangStat[] = [...repoCount.entries()]
      .map(([name, n]) => ({ name, repos: n, pct: Math.round((n / totalRepoLang) * 100) }))
      .sort((a, b) => b.repos - a.repos);

    const topRepos: RepoStat[] = owned
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        description: r.description,
      }));

    const data = {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      followers: user.followers,
      publicRepos: user.public_repos,
      totalStars,
      memberSince: user.created_at?.slice(0, 4) ?? null,
      topLanguages: topLanguages as unknown as object,
      topRepos: topRepos as unknown as object,
      fetchedAt: new Date(),
    };

    const saved = await this.prisma.githubStats.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    await this.syncSkillLevels(weight, repoCount);
    return saved;
  }

  /**
   * Recompute levels for existing skills whose name matches a detected GitHub
   * language. Skills with source "self" are pinned and skipped. Unmatched
   * languages never create new skills.
   */
  private async syncSkillLevels(
    weight: Map<string, number>,
    repoCount: Map<string, number>,
  ) {
    if (weight.size === 0) return;
    const maxW = Math.max(...weight.values());
    const skills = await this.prisma.skill.findMany();

    for (const skill of skills) {
      if (skill.source === 'self') continue;
      const langEntry = [...weight.keys()].find(
        (l) => l.toLowerCase() === skill.name.toLowerCase(),
      );
      if (!langEntry) continue;
      const w = weight.get(langEntry)!;
      const level = Math.round(45 + 50 * (w / maxW));
      const repos = repoCount.get(langEntry) ?? 0;
      await this.prisma.skill.update({
        where: { id: skill.id },
        data: {
          level,
          rarity: rarityFromLevel(level),
          source: 'github',
          basis: `Primary language in ${repos} public repo${repos === 1 ? '' : 's'}`,
        },
      });
    }
  }
}
