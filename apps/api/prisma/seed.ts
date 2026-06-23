import { PrismaClient, Rarity, MissionStatus } from '@prisma/client';
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

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: '[YOUR NAME]',
      classRole: 'Creative Developer',
      roles: ['Creative Developer', 'Full-stack Engineer', 'UI Alchemist', 'Problem Solver'],
      tagline: '[A one-line tagline about you — what you build and why it matters.]',
      bio: "[Placeholder bio. Write 2–3 sentences about who you are, what you build, and what you're chasing next.]",
      level: 42,
      rank: 'LEGENDARY',
      region: 'REMOTE',
      email: 'hello@example.com',
      xpCurrent: 7400,
      xpMax: 10000,
    },
  });

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { label: 'FRONTEND', value: 95, order: 0 },
      { label: 'BACKEND', value: 82, order: 1 },
      { label: 'AI/ML', value: 78, order: 2 },
      { label: 'WEB3', value: 64, order: 3 },
      { label: 'INFRA', value: 72, order: 4 },
    ],
  });

  await prisma.counter.deleteMany();
  await prisma.counter.createMany({
    data: [
      { label: 'PROJECTS', value: 48, color: '#22d3ee', order: 0 },
      { label: 'YEARS XP', value: 7, suffix: '+', color: '#b026ff', order: 1 },
      { label: 'COMMITS', value: 12400, color: '#ff2d9b', order: 2 },
      { label: 'SATISFACTION', value: 99, suffix: '%', color: '#ffd23f', order: 3 },
    ],
  });

  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      { code: 'MSN_01', slug: 'realtime-collab-canvas', title: 'Realtime Collab Canvas', objective: 'Built a multiplayer design canvas with CRDT sync and sub-50ms cursor presence.', difficulty: '★★★★☆', impact: '+2.4k USERS', status: MissionStatus.COMPLETE, statusColor: '#4ade80', loadout: ['React', 'TypeScript', 'WebGL', 'WebSocket'], order: 0 },
      { code: 'MSN_02', slug: 'ai-code-reviewer', title: 'AI Code Reviewer', objective: 'Shipped an LLM pipeline that reviews PRs and proposes fixes inline.', difficulty: '★★★★★', impact: '1ST PLACE', status: MissionStatus.COMPLETE, statusColor: '#4ade80', loadout: ['Next.js', 'NestJS', 'LLM', 'Postgres'], order: 1 },
      { code: 'MSN_03', slug: 'onchain-identity-wallet', title: 'Onchain Identity Wallet', objective: 'Self-custodial wallet with social recovery and gasless onboarding.', difficulty: '★★★★☆', impact: '+800 WALLETS', status: MissionStatus.ACTIVE, statusColor: '#ffd23f', loadout: ['Solidity', 'Viem', 'React', 'IPFS'], order: 2 },
      { code: 'MSN_04', slug: 'edge-analytics-engine', title: 'Edge Analytics Engine', objective: 'Privacy-first analytics running on the edge with zero cookies.', difficulty: '★★★☆☆', impact: '10M EVENTS/DAY', status: MissionStatus.ACTIVE, statusColor: '#ffd23f', loadout: ['Rust', 'WASM', 'ClickHouse'], order: 3 },
    ],
  });

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { groupName: 'FRONTEND // COMBAT', name: 'React', rarity: Rarity.legendary, level: 95, tip: 'Years of battle-tested component design.', order: 0 },
      { groupName: 'FRONTEND // COMBAT', name: 'TypeScript', rarity: Rarity.legendary, level: 92, tip: 'Strict mode everywhere.', order: 1 },
      { groupName: 'FRONTEND // COMBAT', name: 'Tailwind', rarity: Rarity.epic, level: 88, tip: 'Design systems at speed.', order: 2 },
      { groupName: 'FRONTEND // COMBAT', name: 'WebGL', rarity: Rarity.rare, level: 70, tip: 'Shaders & creative coding.', order: 3 },
      { groupName: 'BACKEND // ENGINEERING', name: 'NestJS', rarity: Rarity.epic, level: 86, tip: 'Modular APIs.', order: 4 },
      { groupName: 'BACKEND // ENGINEERING', name: 'Postgres', rarity: Rarity.epic, level: 84, tip: 'Schema design & tuning.', order: 5 },
      { groupName: 'BACKEND // ENGINEERING', name: 'Node.js', rarity: Rarity.legendary, level: 90, tip: 'Event-loop fluent.', order: 6 },
      { groupName: 'BACKEND // ENGINEERING', name: 'Redis', rarity: Rarity.rare, level: 68, tip: 'Caching & queues.', order: 7 },
      { groupName: 'PLATFORM // SUPPORT', name: 'Docker', rarity: Rarity.epic, level: 80, tip: 'Repeatable environments.', order: 8 },
      { groupName: 'PLATFORM // SUPPORT', name: 'AWS', rarity: Rarity.rare, level: 66, tip: 'Core services.', order: 9 },
      { groupName: 'PLATFORM // SUPPORT', name: 'CI/CD', rarity: Rarity.rare, level: 72, tip: 'Ship safely, often.', order: 10 },
      { groupName: 'PLATFORM // SUPPORT', name: 'Rust', rarity: Rarity.common, level: 40, tip: 'Learning in progress.', order: 11 },
    ],
  });

  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: [
      { year: '2026', title: 'Open Source Maintainer', description: 'Maintained a library crossing 5k stars.', color: '#ffd23f', glow: 'rgba(255,210,63,0.65)', order: 0 },
      { year: '2025', title: 'Hackathon Champion', description: '1st place out of 200+ teams.', color: '#b026ff', glow: 'rgba(176,38,255,0.6)', order: 1 },
      { year: '2024', title: 'Conference Speaker', description: 'Spoke on realtime architecture.', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)', order: 2 },
      { year: '2023', title: 'Shipped at Scale', description: 'Led a launch serving millions.', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)', order: 3 },
      { year: '2022', title: 'First Production AI Feature', description: 'Took an ML feature from PoC to prod.', color: '#6b7280', glow: 'rgba(107,114,128,0.5)', order: 4 },
    ],
  });

  await prisma.social.deleteMany();
  await prisma.social.createMany({
    data: [
      { label: 'GH', name: 'GitHub', href: '#', order: 0 },
      { label: 'IN', name: 'LinkedIn', href: '#', order: 1 },
      { label: 'TW', name: 'Twitter', href: '#', order: 2 },
      { label: 'DR', name: 'Dribbble', href: '#', order: 3 },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        title: 'Accounting / ERP Application Developer',
        org: 'Hướng Nghiệp Á Âu · Freelance',
        period: 'Present',
        description:
          'Building a Vietnamese-compliant accounting/ERP app aligned with Circular 99/2025/TT-BTC. Authored the full SRS (business rules, user stories, 164 compliance test cases), designed double-entry logic and a VAS-compliant chart of accounts, and built a strictly-typed React + TanStack frontend on a layered query-key/fetcher/hook architecture.',
        order: 0,
      },
      {
        title: 'AI Consultant Agent Developer',
        org: 'Hướng Nghiệp Á Âu · Freelance',
        period: 'Present',
        description:
          'Built a virtual enrollment advisor (Claude Agent SDK) embedded as a website chat widget for a 19-branch academy network serving 100,000+ prospective learners. Grounded answers with a RAG knowledge base (PostgreSQL + pgvector) over the live course catalog, added a Telegram Human-in-the-Loop bot for advisor takeover, and routed high-intent leads to sales.',
        order: 1,
      },
      {
        title: 'AI Ordering Agent Developer',
        org: 'Ăng ê Coffee · Contract',
        period: 'Present',
        description:
          'Built an AI front-of-house agent that takes orders and recommends drinks, with a phased rollout from text chat to real-time bidirectional voice over HTTP streaming. Used a multi-LLM fallback (Gemini Flash-Lite → Groq Llama) for cost/reliability and a self-learning RAG loop (PostgreSQL + pgvector) that keeps improving recommendations.',
        order: 2,
      },
      {
        title: 'Application Developer — IPBMS',
        org: 'Whammy Tech · Contract',
        period: 'Jun 2025 – Jan 2026',
        description:
          'Built an AI real-time patient monitoring system analyzing live RTSP camera streams to detect falls and seizures. Implemented YOLO pose detection and skeleton-based motion analysis, a 5-frame validation strategy to cut false positives, and an event-driven alert pipeline (Normal/Warning/Danger) with WebSocket/Supabase Realtime notifications over a PostgreSQL schema.',
        order: 3,
      },
      {
        title: 'Freelance Software Engineer',
        org: 'NEURADAO · Freelance',
        period: 'Oct 2025',
        description:
          'Led a 3-person team to ship a production-ready AI trading web platform in 20 days. Owned hosting infrastructure, backend/API architecture, the AI trading engine, and an in-app trading-assistant chatbot — through to domain setup and production release.',
        order: 4,
      },
      {
        title: 'IT Support Technician',
        org: 'University IT · Part-time',
        period: 'Jan 2022 – Dec 2024',
        description:
          'Supported university-wide IT operations across Academic Affairs, Examinations, HR, Accounting and Administration for cohorts K15–K20. Troubleshot hardware, networks, classroom and exam systems, handled user accounts, and later helped coordinate and onboard new student IT support members.',
        order: 5,
      },
    ],
  });

  await prisma.resource.deleteMany();
  await prisma.resource.createMany({
    data: [
      { title: 'neon-ui', description: 'The cyberpunk component kit powering this site.', url: null, repoUrl: 'https://github.com/example/neon-ui', tags: ['react', 'tailwind', 'open-source'], order: 0 },
      { title: 'realtime-cursors', description: 'Drop-in multiplayer cursor presence in <1kb.', url: 'https://example.com/realtime-cursors', repoUrl: 'https://github.com/example/realtime-cursors', tags: ['websocket', 'crdt'], order: 1 },
      { title: 'portfolio-template', description: 'This very portfolio, as a starter you can fork.', url: null, repoUrl: 'https://github.com/example/portfolio', tags: ['nextjs', 'nestjs'], order: 2 },
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
  await prisma.blogPost.create({
    data: {
      slug: 'shipping-realtime-features',
      title: 'Shipping Realtime Features Without Losing Your Mind',
      excerpt: 'Lessons from building multiplayer presence at sub-50ms.',
      content:
        '## Presence is hard\n\nKeeping cursors in sync feels easy until it is not.\n\n1. Debounce, but not too much\n2. Use CRDTs for conflict-free merges\n3. Measure p99, not averages\n\nThat is the difference between a demo and a product.',
      tags: ['realtime', 'engineering'],
      published: true,
      publishedAt: new Date('2026-05-10T00:00:00Z'),
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
