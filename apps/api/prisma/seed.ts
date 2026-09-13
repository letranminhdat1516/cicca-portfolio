import { PrismaClient } from '@prisma/client';
import { applyCvContent } from './content/cv';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Single admin, credentials from env (defaults for local dev only).
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'admin',
    },
  });

  // Public content (profile, SEO, missions, skills, experience, …) comes from the CV.
  await applyCvContent(prisma);

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { label: 'FRONTEND', value: 85, order: 0 },
      { label: 'BACKEND', value: 88, order: 1 },
      { label: 'AI/ML', value: 88, order: 2 },
      { label: 'INFRA', value: 80, order: 3 },
    ],
  });

  await prisma.blogPost.deleteMany();
  await prisma.blogPost.create({
    data: {
      slug: 'hello-world',
      title: 'Hello, World — Why I Built This Portfolio',
      excerpt: 'A game-themed dev portfolio with a real backend. Here is the why and the how.',
      content:
        '## Why\n\nI wanted a portfolio that felt like a **character sheet** — levels, missions, loadouts.\n\n## The Stack\n\n- **Next.js** for the SEO-friendly frontend\n- **NestJS + Postgres** for a real backend\n- An **admin panel** so I can add content without touching code\n\n```ts\nconsole.log("welcome, player one");\n```\n\nMore missions incoming. ▸',
      tags: ['meta', 'nextjs', 'nestjs'],
      published: true,
      publishedAt: new Date('2026-06-01T00:00:00Z'),
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
