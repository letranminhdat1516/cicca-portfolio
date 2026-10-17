import { MissionStatus, Prisma, PrismaClient, Rarity } from '@prisma/client';

// Single source of truth for the public portfolio content, transcribed from the
// résumé (CV/letranminhdat_CV_2026-10.html → apps/web/public/cv/letranminhdat-cv.pdf)
// plus the k3s homelab that hosts this site. Web and CV must match.
// Tone: say what was shipped and why it mattered; only numbers that are real
// outcomes (97% drafts accepted, 84% fewer false alarms, 20 accountants, 20 days).
// No vanity counters (lines of code, commits, test counts, leads, orders/day).
// Client names stay anonymised where the CV anonymises them.

export const SITE_DESCRIPTION =
  'AI-native software engineer in Ho Chi Minh City. I build AI agents and the backend they run on: an enterprise bank AI gateway, MCP commerce and voice agents.';

export const seo = {
  siteName: 'Le Tran Minh Dat',
  defaultTitle: 'Le Tran Minh Dat — AI-Native Software Engineer',
  defaultDescription: SITE_DESCRIPTION,
  keywords: [
    'Le Tran Minh Dat',
    'Lê Trần Minh Đạt',
    'AI-native software engineer',
    'AI agent developer',
    'AI gateway',
    'LLM infrastructure',
    'MCP server',
    'Claude Agent SDK',
    'LiteLLM',
    'RAG',
    'LiveKit voice agent',
    'TypeScript',
    'Python',
    'Go',
    'NestJS',
    'PostgreSQL',
    'AWS',
    'Kubernetes',
    'k3s',
    'ArgoCD',
    'Zillexa',
    'Ho Chi Minh City',
    'resume',
  ],
};

export const profile = {
  name: 'Le Tran Minh Dat',
  classRole: 'AI-Native Software Engineer',
  roles: [
    'AI-Native Software Engineer',
    'AI Agent Developer',
    'Backend & LLM Infrastructure',
    'Co-founder · Zillexa',
  ],
  tagline: 'I build AI agents and the backend they run on, from the database to deployment.',
  bio: "I'm Dat, cicca on the internet. I love the moment an AI stops being a demo and starts doing real work, and I'll take it from an empty repo all the way to production. I like tinkering with new things, lately robotics and virtual assistants, and I polish them until they're done. Off the clock, I look after kittens. Where I'm headed: a real studio with Zillexa, research I'm proud of, open-source tools people use, and a voice in AI engineering.",
  region: 'HO CHI MINH CITY, VN',
  email: 'datltmse@gmail.com',
  avatarUrl: '/cicca-03.png',
};

// The user does not want vanity counters on the site; the About section renders
// nothing for an empty list.
export const counters: { label: string; value: number; suffix: string | null; color: string }[] = [];

const ACTIVE = '#ffd23f';
const COMPLETE = '#4ade80';

export const projects = [
  {
    slug: 'siz-commerce-gateway',
    title: 'Siz — AI Commerce Gateway (MCP)',
    objective:
      "An MCP server that lets AI assistants search and book cinema and flight tickets on real merchant sites, then hands payment back to the user's own banking app. Accounts link with OAuth 2.1 + PKCE, every merchant call is signed (Ed25519, RFC 9421) and VietQR codes are verified before a user sees them; an AI-Ready scorer grades how well agents can use a merchant site. Two-person product team since Aug 2026: I built the gateway and its web app.",
    difficulty: '★★★★★',
    impact: 'AGENTS THAT BOOK & HAND OFF PAYMENT',
    status: MissionStatus.ACTIVE,
    loadout: ['MCP', 'Go', 'OAuth 2.1', 'PostgreSQL', 'Next.js', 'k3s'],
  },
  {
    slug: 'bank-llm-gateway',
    title: 'AI Gateway for an Enterprise Bank',
    objective:
      "LiteLLM extensions for an AI gateway shared by many teams at an enterprise banking client. Spend is reconciled from three sources (gateway ledger, Bedrock logs in CloudWatch, the AWS bill through Athena) with a per-service tax split, which caught a double-counting bug that reported nearly four times the real spend. Runs across four AWS accounts, with SES/SNS alerts, bulk team onboarding, an OAuth bridge and X-Ray trace IDs on every spend record. I lead delivery and planning since Aug 2026; the lead engineer audits and sets direction.",
    difficulty: '★★★★★',
    impact: 'SPEND MATCHED TO THE REAL AWS BILL',
    status: MissionStatus.ACTIVE,
    loadout: ['LiteLLM', 'AWS Bedrock', 'Athena', 'CloudWatch', 'SES / SNS', 'X-Ray'],
  },
  {
    slug: 'voice-ordering-agent',
    title: 'Bảo Bối — Voice Ordering Assistant',
    objective:
      "A cat-mascot assistant for an F&B and AI-commerce company that suggests drinks by mood, takes the order by chat or voice (LiveKit), pushes it to the café's POS and returns a VietQR to pay. Version 1 ran in the café, with a loop that turns bad replies into scenarios staff can approve and a watchdog added after a silent LiveKit outage. Version 2 rebuilds it for many shops: a Go core, per-shop isolation with PostgreSQL row-level security and a Python LiveKit agent. May 2026 – Present.",
    difficulty: '★★★★☆',
    impact: 'RAN IN A REAL CAFÉ',
    status: MissionStatus.ACTIVE,
    loadout: ['LiveKit', 'Go', 'Python', 'PostgreSQL RLS', 'VietQR'],
  },
  {
    slug: 'rag-enrollment-advisor',
    title: 'Admissions Chatbot & Advisor Cockpit',
    objective:
      'A 24/7 admissions chatbot and advisor cockpit on a live CRM for Hướng Nghiệp Á Âu, a 19-branch academy. After each customer message a background job drafts three replies and a lead summary; advisors accepted 97% of the drafts. The CRM is the only source for pricing and schedules, a course allow-list and topic pinning stop invented courses, and hybrid RAG mixes pgvector with Vietnamese full-text search. Sole developer, Apr – Sep 2026, handed over.',
    difficulty: '★★★★☆',
    impact: '97% OF AI DRAFTS ACCEPTED',
    status: MissionStatus.COMPLETE,
    loadout: ['Hybrid RAG', 'pgvector', 'Self-hosted VLM', 'On-prem'],
  },
  {
    slug: 'vas-accounting-erp',
    title: 'Multi-company Accounting SaaS',
    objective:
      'A multi-company accounting platform built to Circular 99/2025 and used daily by 20 accountants. Built consolidated financial reporting under Circular 202 end to end (intercompany elimination, Excel export), plus fixed assets, loans and bank reconciliation; made posting safe with atomic batch posting and period locking; set up CI/CD from GitHub Actions to GHCR with Watchtower on the client\'s servers. Top contributor in a 3-engineer team, 2025 – Sep 2026, handed over.',
    difficulty: '★★★★☆',
    impact: '20 ACCOUNTANTS DAILY',
    status: MissionStatus.COMPLETE,
    loadout: ['React', 'REST API', 'PostgreSQL', 'GitHub Actions', 'GHCR'],
  },
  {
    slug: 'ipbms-patient-monitoring',
    title: 'IPBMS — Real-time Patient Monitoring',
    objective:
      'Fall and seizure detection on live RTSP camera streams with YOLO pose estimation and LLM-written incident reports, running on-site on two real cameras for Whammy Tech. A rule that needs five frames in a row before alerting cut false alarms by 84% across 4,000 test cases. AI Team Lead of four engineers, Jun 2025 – Jan 2026.',
    difficulty: '★★★★★',
    impact: '84% FEWER FALSE ALARMS',
    status: MissionStatus.COMPLETE,
    loadout: ['YOLO Pose', 'OpenCV', 'RTSP', 'LLM Reports'],
  },
  {
    slug: 'neuradao-ai-trading',
    title: 'NEURADAO — AI Trading Platform',
    objective:
      'Led three engineers from an empty repository to a live AI trading platform in 20 days (Oct 2025): wrote the trading logic, AI chatbot and automation backend, and deployed on AWS.',
    difficulty: '★★★★★',
    impact: 'LIVE IN 20 DAYS',
    status: MissionStatus.COMPLETE,
    loadout: ['TypeScript', 'Python', 'PostgreSQL', 'AWS'],
  },
  {
    slug: 'cicca-fleet-k3s',
    title: 'Cicca Fleet — Multi-site k3s Cluster',
    objective:
      'Personal Kubernetes fleet spanning cloud VPS nodes and an ARM64 Orange Pi at home, meshed over Tailscale and managed fully by GitOps (ArgoCD app-of-apps). In-cluster container registry on MinIO, NFS storage from a Synology NAS, Grafana + Mimir + Loki + Alloy observability with alerting, public apps via Cloudflare Tunnel — this website is served from it.',
    difficulty: '★★★★☆',
    impact: 'MULTI-ARCH · GITOPS',
    status: MissionStatus.ACTIVE,
    loadout: ['k3s', 'ArgoCD', 'Tailscale', 'Grafana LGTM'],
  },
];

type SkillSeed = { name: string; level: number; tip: string; basis: string };

export const skillGroups: { group: string; items: SkillSeed[] }[] = [
  {
    group: 'AI AGENTS & LLM // SPECIALTY',
    items: [
      { name: 'Claude Agent SDK & MCP', level: 90, tip: 'Tool-using agents and MCP servers that act on real systems.', basis: 'Siz commerce gateway' },
      { name: 'LiteLLM gateways & cost control', level: 88, tip: 'Routing and failover across providers, budgets, spend matched to real bills.', basis: 'Enterprise bank AI gateway' },
      { name: 'RAG (pgvector + full-text)', level: 86, tip: 'Hybrid retrieval with answers grounded in live business data.', basis: 'Admissions chatbot' },
      { name: 'LiveKit voice agents', level: 82, tip: 'Chat and voice ordering with human review of bad replies.', basis: 'Bảo Bối voice ordering assistant' },
      { name: 'YOLO / OpenCV', level: 78, tip: 'Pose estimation with a five-frame rule on live RTSP streams.', basis: 'IPBMS' },
      { name: 'Claude · OpenAI · Gemini · AWS Bedrock', level: 88, tip: 'Provider-agnostic LLM layers across the major model providers.', basis: 'Every AI system on the CV' },
    ],
  },
  {
    group: 'BACKEND & FRONTEND // ENGINEERING',
    items: [
      { name: 'TypeScript', level: 90, tip: 'Node.js/NestJS services and React frontends.', basis: 'Multiple production systems' },
      { name: 'Python', level: 82, tip: 'AI services, voice agents and computer-vision pipelines.', basis: 'IPBMS, Bảo Bối, NEURADAO' },
      { name: 'Go', level: 78, tip: 'Gateway and multi-shop ordering cores.', basis: 'Siz, Bảo Bối v2' },
      { name: 'SQL', level: 85, tip: 'Relational modeling, row-level security, transactional integrity.', basis: 'Accounting SaaS, Bảo Bối v2' },
      { name: 'Node.js / NestJS', level: 86, tip: 'Modular REST and WebSocket APIs.', basis: 'This portfolio, trading backend' },
      { name: 'React / Next.js / TanStack', level: 85, tip: 'Typed query/router architecture and web apps.', basis: 'Accounting SaaS, Siz web app' },
      { name: 'PostgreSQL / pgvector / Redis', level: 86, tip: 'Relational data, vector search and caching.', basis: 'Accounting SaaS, admissions chatbot, Siz' },
      { name: 'REST & agent API design', level: 85, tip: 'OAuth 2.1 + PKCE and signed requests (RFC 9421).', basis: 'Siz, bank AI gateway' },
    ],
  },
  {
    group: 'CLOUD & DEVOPS // PLATFORM',
    items: [
      { name: 'AWS', level: 82, tip: 'Bedrock, IAM, CloudWatch, Athena, SES, SNS and X-Ray across four accounts.', basis: 'Bank AI gateway, NEURADAO' },
      { name: 'Docker', level: 85, tip: 'Container builds and self-hosted registries.', basis: 'Accounting SaaS, homelab' },
      { name: 'Kubernetes (k3s) + ArgoCD', level: 80, tip: 'Multi-node, multi-arch cluster run entirely through GitOps.', basis: 'Siz, Cicca Fleet homelab' },
      { name: 'GitHub Actions · GHCR · Watchtower', level: 80, tip: "CI/CD straight onto the client's own servers.", basis: 'Accounting SaaS' },
      { name: 'On-prem / VPN deployment', level: 80, tip: 'Services inside client LANs behind end-to-end test gates.', basis: 'Admissions chatbot, IPBMS' },
      { name: 'Observability', level: 78, tip: 'Trace IDs on spend records; Grafana, Mimir, Loki.', basis: 'Bank AI gateway, homelab' },
    ],
  },
  {
    group: 'SPOKEN // LANGUAGES',
    items: [
      { name: 'Vietnamese (native)', level: 100, tip: 'Native speaker.', basis: 'Native' },
      { name: 'English (written fluent, spoken intermediate)', level: 75, tip: 'Written: fluent. Spoken: intermediate.', basis: 'Self-assessed' },
    ],
  },
];

export const achievements = [
  { year: '2026', title: 'Chord — Finalist, 2nd prize', description: 'ETHGlobal Singapore 2026 (TOKEN2049): top 5 on the main track, US$10k AWS credits.', color: '#ffd23f', glow: 'rgba(255,210,63,0.65)' },
  { year: '2026', title: 'Viettel AI Race 2026 — Runner-up (Top 4)', description: 'Finalist out of 1,628 teams, organised by Viettel Group.', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  { year: '2026', title: 'B.Eng. Software Engineering — FPT University', description: 'FPT University, Ho Chi Minh City · GPA 3.47 / 4.0 · 2026.', color: '#b026ff', glow: 'rgba(176,38,255,0.6)' },
];

export const socials = [
  { label: 'GH', name: 'GitHub', href: 'https://github.com/letranminhdat1516' },
  { label: 'IN', name: 'LinkedIn', href: 'https://www.linkedin.com/in/dat-le-139a85284' },
  { label: 'CV', name: 'Résumé', href: '/cv' },
];

// Descriptions use a lead line (scope / ownership) first and "- " bullets after
// it; the web renders them as a lead sentence plus a bullet list.
export const experiences = [
  {
    title: 'AI Gateway Platform Engineer',
    org: 'Enterprise banking client · Outsourced contract',
    period: 'Aug 2026 – Present',
    description: [
      '2-engineer team: I lead delivery and planning; the lead engineer audits and sets direction.',
      "- Build LiteLLM extensions for an AI gateway shared by many teams. Spend is reconciled from three sources (the gateway ledger, Bedrock call logs in CloudWatch, and the AWS bill through Athena) with a per-service tax split Cost Explorer can't give; it caught a double-counting bug that reported nearly four times the real spend.",
      '- Run it across four AWS accounts with two identities: an assumed IAM role to read other accounts and a service identity to write results, with a one-click connection test in the UI.',
      '- Alerts over SES, or SNS where there is no mail server, with templates editable without a redeploy; bulk import creates teams from a file and issues one key per person; an OAuth bridge serves providers that only accept localhost redirects, and every spend record carries an AWS X-Ray trace ID.',
    ].join('\n'),
  },
  {
    title: 'Backend & AI Engineer',
    org: 'F&B and AI-commerce company · Contract',
    period: 'May 2026 – Present',
    description: [
      'Two products: Siz, an AI commerce gateway (MCP), and Bảo Bối, a voice ordering assistant.',
      "- Siz (Aug 2026 – Present, two-person product team; I built the gateway and its web app): an MCP server that lets AI assistants search and book cinema and flight tickets on real merchant sites, then hands payment back to the user's own banking app.",
      '- Siz: accounts are linked with OAuth 2.1 + PKCE, every call to a merchant is signed (Ed25519, RFC 9421), and VietQR codes are verified before a user sees them; an AI-Ready scorer grades merchant sites on how well agents can use them. Go and PostgreSQL backend, Next.js web app, shipped to k3s through a GitOps pipeline with ArgoCD.',
      "- Bảo Bối (May 2026 – Present): a cat-mascot assistant that suggests drinks by mood and takes the order by chat or voice (LiveKit), pushes it to the café's POS and returns a VietQR to pay. Version 1 ran in the café, with a loop that turns bad replies into scenarios staff can approve and a watchdog added after a silent LiveKit outage.",
      '- Bảo Bối version 2 rebuilds it for many shops: a Go core, per-shop isolation with PostgreSQL row-level security, and a Python LiveKit agent.',
    ].join('\n'),
  },
  {
    title: 'Co-founder',
    org: 'Zillexa · Independent dev studio',
    period: '2024 – Present',
    description: [
      'Independent dev studio of five members.',
      '- Co-founded a studio of five engineers that takes on product and AI builds together and competes in hackathons as a team.',
    ].join('\n'),
  },
  {
    title: 'AI Agent Consultant Engineer',
    org: 'Hướng Nghiệp Á Âu · Freelance',
    period: 'Apr 2026 – Sep 2026',
    description: [
      'Sole developer; handed over.',
      '- Built a 24/7 admissions chatbot and an advisor cockpit on a live CRM for a 19-branch academy. After each customer message a background job drafts three replies and a lead summary for advisors, who accepted 97% of the drafts.',
      '- Kept the bot from inventing courses or prices: the CRM is the only source for pricing and schedules, a course allow-list and topic pinning keep follow-ups on track, and hybrid RAG mixes pgvector with Vietnamese full-text search behind a provider-agnostic LLM layer.',
      '- Added image reading through a self-hosted VLM with SSRF protection; runs on-prem behind nine end-to-end test suites.',
    ].join('\n'),
  },
  {
    title: 'Core Full-stack Developer',
    org: 'Enterprise accounting SaaS · 3-engineer team',
    period: '2025 – Sep 2026',
    description: [
      'Top contributor in a 3-engineer team; handed over.',
      '- Multi-company accounting platform built to Circular 99/2025 and used daily by 20 accountants; built consolidated financial reporting under Circular 202 end to end, with intercompany elimination and Excel export, plus fixed assets, loans and bank reconciliation.',
      "- Made posting safe with atomic batch posting and period locking, and set up CI/CD from GitHub Actions to GHCR with Watchtower on the client's servers.",
    ].join('\n'),
  },
  {
    title: 'AI Team Lead, Computer Vision',
    org: 'Whammy Tech · Contract',
    period: 'Jun 2025 – Jan 2026',
    description: [
      'Led 4 engineers (backend, frontend, mobile) and did all the AI work.',
      '- Fall and seizure detection on live RTSP camera streams with YOLO pose estimation and LLM-written incident reports, running on-site on two real cameras.',
      '- Added a rule that needs five frames in a row before alerting, which cut false alarms by 84% across 4,000 test cases.',
    ].join('\n'),
  },
  {
    title: 'Team Lead, Software Engineer',
    org: 'NEURADAO · Contract',
    period: 'Oct 2025',
    description: [
      'Led 3 engineers.',
      '- Led three engineers from an empty repository to a live AI trading platform in 20 days; wrote the trading logic, AI chatbot and automation backend (TypeScript, Python, PostgreSQL) and deployed on AWS.',
    ].join('\n'),
  },
  {
    title: 'IT Support Technician',
    org: 'FPT University IT · Part-time',
    period: 'Jan 2022 – Dec 2024',
    description: 'Supported IT operations across academic and administrative departments while studying.',
  },
];

export const resources = [
  { title: 'Résumé (PDF)', description: 'CV: experience, skills, open source, education and awards.', url: '/cv/letranminhdat-cv.pdf', repoUrl: null, tags: ['cv', 'pdf'] },
  { title: 'Online résumé', description: 'The same CV as a crawlable web page.', url: '/cv', repoUrl: null, tags: ['cv', 'html'] },
  { title: 'GitHub', description: 'Public repositories and contributions.', url: null, repoUrl: 'https://github.com/letranminhdat1516', tags: ['code'] },
];

function rarityOf(level: number): Rarity {
  if (level >= 85) return Rarity.legendary;
  if (level >= 70) return Rarity.epic;
  if (level >= 50) return Rarity.rare;
  return Rarity.common;
}

/**
 * Replace all public portfolio content with the CV content above. Leaves users,
 * blog posts, analytics, stats and GSC/GitHub settings untouched, and keeps any
 * admin-written project `content` for slugs that still exist.
 */
export async function applyCvContent(prisma: PrismaClient) {
  const skillRows: Prisma.SkillCreateManyInput[] = skillGroups.flatMap((g) =>
    g.items.map((s) => ({
      groupName: g.group,
      name: s.name,
      level: s.level,
      rarity: rarityOf(s.level),
      tip: s.tip,
      basis: s.basis,
      source: 'evidence',
    })),
  );

  // Project markdown `content` is written in the admin CMS (it gates indexing of
  // /projects/<slug>); carry it over by slug so a re-sync does not wipe it.
  const existingContent = new Map(
    (await prisma.project.findMany({ select: { slug: true, content: true } })).map((p) => [
      p.slug,
      p.content,
    ]),
  );

  await prisma.$transaction([
    prisma.profile.upsert({
      where: { id: 1 },
      update: profile,
      create: { id: 1, ...profile, level: 42, rank: 'LEGENDARY', xpCurrent: 7400, xpMax: 10000 },
    }),
    prisma.seoSettings.upsert({
      where: { id: 1 },
      update: seo,
      create: { id: 1, ...seo, githubUsername: 'letranminhdat1516' },
    }),
    prisma.counter.deleteMany(),
    prisma.counter.createMany({ data: counters.map((c, order) => ({ ...c, order })) }),
    prisma.project.deleteMany(),
    prisma.project.createMany({
      data: projects.map((p, order) => ({
        ...p,
        content: existingContent.get(p.slug) ?? null,
        code: `MSN_${String(order + 1).padStart(2, '0')}`,
        statusColor: p.status === MissionStatus.ACTIVE ? ACTIVE : COMPLETE,
        order,
      })),
    }),
    prisma.skill.deleteMany(),
    prisma.skill.createMany({ data: skillRows.map((s, order) => ({ ...s, order })) }),
    prisma.achievement.deleteMany(),
    prisma.achievement.createMany({ data: achievements.map((a, order) => ({ ...a, order })) }),
    prisma.social.deleteMany(),
    prisma.social.createMany({ data: socials.map((s, order) => ({ ...s, order })) }),
    prisma.experience.deleteMany(),
    prisma.experience.createMany({ data: experiences.map((e, order) => ({ ...e, order })) }),
    prisma.resource.deleteMany(),
    prisma.resource.createMany({ data: resources.map((r, order) => ({ ...r, order })) }),
  ]);
}
