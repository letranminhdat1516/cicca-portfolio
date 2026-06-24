import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { rarityFromLevel } from '../github/rarity';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private github: GithubService,
  ) {}

  async getPortfolio() {
    const [
      profile,
      stats,
      counters,
      projects,
      skills,
      achievements,
      socials,
      experiences,
      resources,
      seo,
    ] = await Promise.all([
      this.prisma.profile.findUnique({ where: { id: 1 } }),
      this.prisma.stat.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.counter.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.project.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.social.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.resource.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.seoSettings.findUnique({ where: { id: 1 } }),
    ]);

    const github = await this.github.getStats().catch(() => null);

    // group skills by groupName, preserving first-seen order
    const groupOrder: string[] = [];
    const grouped = new Map<string, typeof skills>();
    for (const s of skills) {
      if (!grouped.has(s.groupName)) {
        grouped.set(s.groupName, []);
        groupOrder.push(s.groupName);
      }
      grouped.get(s.groupName)!.push(s);
    }
    const skillGroups = groupOrder.map((name) => ({
      name,
      items: grouped.get(name)!.map((s) => ({
        n: s.name,
        r: rarityFromLevel(s.level),
        lvl: s.level,
        tip: s.tip ?? '',
        source: s.source,
        basis: s.basis ?? '',
      })),
    }));

    return {
      profile,
      stats,
      counters,
      missions: projects,
      skillGroups,
      achievements,
      socials,
      experiences,
      resources,
      seo,
      github,
    };
  }
}
