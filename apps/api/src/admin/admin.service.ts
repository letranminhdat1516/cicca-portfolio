import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Whitelisted collection models that support full CRUD via the admin API.
const MODELS = {
  projects: 'project',
  skills: 'skill',
  achievements: 'achievement',
  socials: 'social',
  stats: 'stat',
  counters: 'counter',
  experiences: 'experience',
  resources: 'resource',
  blog: 'blogPost',
} as const;

type ModelKey = keyof typeof MODELS;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private delegate(model: string) {
    if (!(model in MODELS)) throw new BadRequestException(`Unknown model: ${model}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prisma as any)[MODELS[model as ModelKey]];
  }

  list(model: string) {
    const orderBy =
      model === 'blog' ? { createdAt: 'desc' as const } : { order: 'asc' as const };
    return this.delegate(model).findMany({ orderBy });
  }

  create(model: string, data: Record<string, unknown>) {
    return this.delegate(model).create({ data });
  }

  update(model: string, id: string, data: Record<string, unknown>) {
    return this.delegate(model).update({ where: { id }, data });
  }

  remove(model: string, id: string) {
    return this.delegate(model).delete({ where: { id } });
  }

  getProfile() {
    return this.prisma.profile.findUnique({ where: { id: 1 } });
  }

  updateProfile(data: Record<string, unknown>) {
    return this.prisma.profile.update({ where: { id: 1 }, data });
  }

  getSeo() {
    return this.prisma.seoSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, keywords: [] },
    });
  }

  updateSeo(data: Record<string, unknown>) {
    return this.prisma.seoSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, keywords: [], ...data },
    });
  }
}
