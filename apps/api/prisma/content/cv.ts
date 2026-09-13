import { MissionStatus, Prisma, PrismaClient, Rarity } from '@prisma/client';

// Single source of truth for the public portfolio content, transcribed from the
// résumé (apps/web/public/cv/letranminhdat-cv.pdf) plus the k3s homelab that
// hosts this site. Numbers here must stay defensible — every figure is on the CV.

export const SITE_DESCRIPTION =
  'AI-native full-stack developer in Ho Chi Minh City. Shipped 6 production systems: a bank LLM gateway, RAG agents, a VAS ERP and real-time computer vision.';

export const seo = {
  siteName: 'Le Tran Minh Dat',
  defaultTitle: 'Le Tran Minh Dat — AI-Native Full-Stack Developer',
  defaultDescription: SITE_DESCRIPTION,
  keywords: [
    'Le Tran Minh Dat',
    'Lê Trần Minh Đạt',
    'AI-native full-stack developer',
    'full-stack developer Vietnam',
    'LLM gateway engineer',
    'AI agent engineer',
    'RAG',
    'LiteLLM',
    'NestJS',
    '.NET 10',
    'React',
    'TypeScript',
    'PostgreSQL',
    'Kubernetes',
    'k3s',
    'ArgoCD',
    'Ho Chi Minh City',
    'resume',
  ],
};

export const profile = {
  name: 'Le Tran Minh Dat',
  classRole: 'AI-Native Full-Stack Developer',
  roles: [
    'AI-Native Full-Stack Developer',
    'LLM Gateway Engineer',
    'AI Agent Engineer',
    'k3s / GitOps Operator',
  ],
  tagline:
    'Six production systems shipped in the past year — LLM gateway, RAG agents, ERP, computer vision. I own the full stack, from data model to deployment.',
  bio: 'Full-stack engineer with six production systems shipped in the past year, solo or leading small teams: a bank-wide LLM gateway, a VAS-compliant accounting ERP used daily by 20 accountants, an on-prem RAG advisor for a 19-branch academy, a real-time patient-monitoring vision system, a voice ordering agent and an AI trading platform delivered in 20 days. I own the full stack on every one: data model, backend, frontend, infrastructure and deployment.',
  region: 'HO CHI MINH CITY, VN',
  email: 'datltmse@gmail.com',
  avatarUrl: '/cicca-03.png',
};

export const counters = [
  { label: 'PRODUCTION SYSTEMS', value: 6, suffix: null, color: '#22d3ee' },
  { label: 'DAILY ERP ACCOUNTANTS', value: 20, suffix: null, color: '#b026ff' },
  { label: 'REGULATORY TEST CASES', value: 164, suffix: null, color: '#ff2d9b' },
  { label: 'DAYS TO SHIP A PLATFORM', value: 20, suffix: null, color: '#ffd23f' },
];

const ACTIVE = '#ffd23f';
const COMPLETE = '#4ade80';

export const projects = [
  {
    slug: 'bank-llm-gateway',
    title: 'Bank-wide LLM Gateway',
    objective:
      'Single control point between every internal bank application and major LLM providers, built on LiteLLM. All bank-specific code lives in a separate 95-file extension layer behind one hook, so upstream releases merge cleanly. Per-user/team/project budgets, SSO, RBAC, immutable audit log, bidirectional PII guardrails, AWS-invoice cost reconciliation and budget-aware model failover.',
    difficulty: '★★★★★',
    impact: 'BANK-WIDE CONTROL POINT',
    status: MissionStatus.ACTIVE,
    loadout: ['LiteLLM', 'SSO / RBAC', 'Guardrails', 'AWS Cost Governance'],
  },
  {
    slug: 'rag-enrollment-advisor',
    title: 'On-prem RAG Enrollment Advisor',
    objective:
      '24/7 advisor for a 19-branch academy (100,000+ learner base): 202 leads and ~1,800 messages so far, with an advisor cockpit for human-in-the-loop review. Hybrid retrieval fuses local ONNX embeddings with Vietnamese full-text search; a CRM allow-list prevents hallucinated courses.',
    difficulty: '★★★★☆',
    impact: '202 LEADS · ~1,800 MESSAGES',
    status: MissionStatus.ACTIVE,
    loadout: ['Hybrid RAG', 'ONNX Embeddings', 'Human-in-the-loop', 'systemd / VPN'],
  },
  {
    slug: 'vas-accounting-erp',
    title: 'VAS-compliant Accounting ERP',
    objective:
      'Double-entry accounting ERP (.NET 10, PostgreSQL, React) in daily use by 20 accountants. Authored the SRS and 164 regulatory test cases it is audited against (audit passed); shipped through Docker, AWS EC2 and GitHub Actions ahead of the 1 Jan 2026 deadline.',
    difficulty: '★★★★☆',
    impact: '20 ACCOUNTANTS DAILY',
    status: MissionStatus.ACTIVE,
    loadout: ['.NET 10', 'PostgreSQL', 'React + TanStack', 'GitHub Actions'],
  },
  {
    slug: 'ipbms-patient-monitoring',
    title: 'IPBMS — Real-time Patient Monitoring',
    objective:
      'Real-time fall/seizure detection on live RTSP streams using YOLO pose estimation plus LLM incident reports. Designed a 5-frame temporal validation strategy to suppress single-frame false alarms; deployed on-premise, live on 2 production cameras.',
    difficulty: '★★★★★',
    impact: '5-FRAME TEMPORAL VALIDATION',
    status: MissionStatus.COMPLETE,
    loadout: ['YOLO Pose', 'OpenCV', 'RTSP', 'LLM Reports'],
  },
  {
    slug: 'voice-ordering-agent',
    title: 'Real-time Voice Ordering Agent',
    objective:
      'Voice ordering agent for Ăng Ê Coffee in daily production use (LiveKit, TTS) with hand-built multi-LLM failover and a self-learning RAG loop. Rolled out text → voice → real-time voice; self-hosted and still operated by me.',
    difficulty: '★★★★☆',
    impact: 'DAILY PRODUCTION USE',
    status: MissionStatus.ACTIVE,
    loadout: ['LiveKit', 'TTS', 'Multi-LLM Failover', 'Self-learning RAG'],
  },
  {
    slug: 'neuradao-ai-trading',
    title: 'NEURADAO — AI Trading Platform',
    objective:
      'Led a 3-engineer team from zero to a production AI trading platform in 20 days: architecture, delivery plan, AI trading logic, chatbot and trading-automation backend, deployed on AWS with PostgreSQL through go-live.',
    difficulty: '★★★★★',
    impact: 'SHIPPED IN 20 DAYS',
    status: MissionStatus.COMPLETE,
    loadout: ['AI Trading', 'Chatbot', 'AWS', 'PostgreSQL'],
  },
  {
    slug: 'cicca-fleet-k3s',
    title: 'Cicca Fleet — Multi-site k3s Cluster',
    objective:
      'Personal Kubernetes fleet spanning cloud VPS nodes and an ARM64 Orange Pi at home, meshed over Tailscale and managed fully by GitOps (ArgoCD app-of-apps). In-cluster container registry on MinIO, NFS storage from a Synology NAS, Grafana + Mimir + Loki + Alloy observability with alerting, public apps via Cloudflare Tunnel — this website is served from it.',
    difficulty: '★★★★☆',
    impact: '4 NODES · MULTI-ARCH · GITOPS',
    status: MissionStatus.ACTIVE,
    loadout: ['k3s', 'ArgoCD', 'Tailscale', 'Grafana LGTM'],
  },
];

type SkillSeed = { name: string; level: number; tip: string; basis: string };

export const skillGroups: { group: string; items: SkillSeed[] }[] = [
  {
    group: 'LLM / AI // SPECIALTY',
    items: [
      { name: 'Multi-provider LLM routing & fallback', level: 90, tip: 'Budget-aware downgrade and automatic model failover.', basis: 'Bank LLM gateway, voice ordering agent' },
      { name: 'Hybrid RAG', level: 88, tip: 'Local ONNX embeddings fused with Vietnamese full-text search.', basis: 'RAG enrollment advisor' },
      { name: 'Guardrails & PII masking', level: 85, tip: 'Mask or block phone numbers, national IDs, account numbers, cloud keys.', basis: 'Bank LLM gateway' },
      { name: 'Human-in-the-loop agents', level: 84, tip: 'Advisor cockpit for reviewing agent conversations.', basis: 'RAG enrollment advisor' },
      { name: 'YOLO / OpenCV / RTSP', level: 80, tip: 'Pose estimation with temporal validation on live streams.', basis: 'IPBMS' },
      { name: 'Prompt & context engineering', level: 85, tip: 'AI-assisted development across architecture, code, debugging and tests.', basis: 'Daily AI workflow' },
    ],
  },
  {
    group: 'FULL-STACK // ENGINEERING',
    items: [
      { name: 'TypeScript', level: 90, tip: 'Node.js/NestJS services and React frontends.', basis: 'Multiple production systems' },
      { name: 'Python', level: 82, tip: 'AI services and computer-vision pipelines.', basis: 'IPBMS, AI agents' },
      { name: 'C# / .NET 10', level: 80, tip: 'Double-entry ledger logic with a full audit trail.', basis: 'VAS accounting ERP' },
      { name: 'NestJS / Node.js', level: 86, tip: 'Modular APIs and services.', basis: 'This portfolio, trading backend' },
      { name: 'React + TanStack', level: 86, tip: 'Strictly typed query/router architecture.', basis: 'VAS accounting ERP' },
      { name: 'PostgreSQL · pgvector · Redis', level: 86, tip: 'Relational modeling and transactional integrity.', basis: 'ERP, RAG, trading platform' },
      { name: 'REST API design', level: 85, tip: 'Contracts, relational data modeling, transactional integrity.', basis: 'Every system on the CV' },
    ],
  },
  {
    group: 'CLOUD & OPS // PLATFORM',
    items: [
      { name: 'Kubernetes (k3s) + ArgoCD', level: 78, tip: 'Multi-node, multi-arch cluster run entirely through GitOps.', basis: 'Cicca Fleet homelab' },
      { name: 'Docker', level: 85, tip: 'Container builds and in-cluster registry.', basis: 'ERP, homelab' },
      { name: 'AWS EC2', level: 80, tip: 'Production deployments to go-live.', basis: 'ERP, NEURADAO' },
      { name: 'GitHub Actions CI/CD', level: 80, tip: 'Automated build, test and deploy pipelines.', basis: 'VAS accounting ERP' },
      { name: 'Observability', level: 80, tip: 'Per-call cost/latency/error logging; Grafana, Mimir, Loki.', basis: 'LLM gateway, RAG advisor, homelab' },
      { name: 'On-prem / VPN deployment', level: 80, tip: 'systemd services with auto-restart inside client LANs.', basis: 'RAG advisor, IPBMS' },
      { name: 'RBAC & audit logging', level: 82, tip: 'Role-based permissions and immutable audit logs.', basis: 'Bank LLM gateway, ERP' },
      { name: 'E2E test gates', level: 80, tip: '9-suite E2E gate added after a production incident.', basis: 'RAG enrollment advisor' },
    ],
  },
  {
    group: 'SPOKEN // LANGUAGES',
    items: [
      { name: 'Vietnamese (native)', level: 100, tip: 'Native speaker.', basis: 'Native' },
      { name: 'English (professional)', level: 75, tip: 'Professional working proficiency.', basis: 'Self-assessed' },
    ],
  },
];

export const achievements = [
  { year: 'AWARD', title: 'Top 4 — Viettel AI Race', description: 'Hackathon organised by Viettel Group.', color: '#ffd23f', glow: 'rgba(255,210,63,0.65)' },
  { year: '2026', title: 'B.Eng. Software Engineering — FPT University', description: 'Graduated 2026 from FPT University, Ho Chi Minh City · GPA 3.47 / 4.0.', color: '#b026ff', glow: 'rgba(176,38,255,0.6)' },
  { year: '2026', title: 'Regulatory audit passed', description: 'VAS-compliant ERP audited against the 164 regulatory test cases I authored; in daily use by 20 accountants.', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  { year: '2025', title: 'Production platform in 20 days', description: 'Led a 3-engineer team from zero to a live AI trading platform on AWS for NEURADAO.', color: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  { year: '2022', title: 'Leader — IT Support Technician', description: 'Worked as a part-time IT Support member while studying, supporting university IT operations across multiple departments.', color: '#6b7280', glow: 'rgba(107,114,128,0.5)' },
];

export const socials = [
  { label: 'GH', name: 'GitHub', href: 'https://github.com/letranminhdat1516' },
  { label: 'IN', name: 'LinkedIn', href: 'https://www.linkedin.com/in/dat-le-139a85284' },
  { label: 'CV', name: 'Résumé', href: '/cv' },
];

// Descriptions use "Owned: …" as the first line and "- " bullets after it; the
// web renders them as a lead sentence plus a bullet list.
export const experiences = [
  {
    title: 'LLM Gateway Engineer',
    org: 'Enterprise client (Banking) · Outsourced contract · 2-engineer team',
    period: '2026 – Present',
    description: [
      'Owned: architecture and the large majority of the custom layer, including its test suite and technical documentation.',
      "- Architected a bank-wide LLM gateway on LiteLLM as the single control point between every internal application and major LLM providers; isolated all bank-specific code in a separate 95-file extension layer with a single unlock hook into the core, so upstream releases merge cleanly.",
      "- Delivered enterprise access control: per-user, per-team and per-project budgets, SSO with the bank's identity provider, role-based permissions and an immutable audit log, plus bidirectional guardrails that mask or block phone numbers, national IDs, account numbers and cloud credentials.",
      '- Engineered cost governance: per-call spend reconciled against actual AWS invoices and tagged for department-level allocation; automatic model failover, budget-aware downgrade to cheaper models, and OAuth-based access to developer AI subscriptions.',
    ].join('\n'),
  },
  {
    title: 'AI Agent Consultant Engineer',
    org: 'Hướng Nghiệp Á Âu · Freelance · Solo, end-to-end',
    period: '2025 – Present',
    description: [
      'Owned: everything — backend, frontend, prompt pipeline, data model, infrastructure and deployment.',
      '- Built a 24/7 RAG enrollment advisor for a 19-branch academy (100,000+ learner base), handling 202 leads and ~1,800 messages to date, with an advisor cockpit for human-in-the-loop review.',
      '- Hybrid retrieval fuses local ONNX embeddings (CPU, zero API cost) with Vietnamese full-text search; a CRM-sourced allow-list and topic pinning prevent hallucinated courses.',
      '- Instrumented every LLM call (tokens, cost, latency, errors) and migrated providers on measured A/B evidence.',
      "- Deployed on-prem inside the client's VPN-only LAN under systemd, integrated with the internal CRM, hardened with auto-restart and a 9-suite E2E test gate.",
    ].join('\n'),
  },
  {
    title: 'Accounting Application Developer',
    org: 'Enterprise client (Education) · Freelance · 2-engineer team',
    period: '2025 – Present',
    description: [
      'Owned: full backend, frontend and database design, delivered jointly with one other engineer.',
      '- Built a VAS-compliant ERP (.NET 10, PostgreSQL, React) in daily production use by 20 accountants; authored the SRS and 164 regulatory test cases it is audited against (audit passed, in trial period).',
      '- Shipped double-entry ledger logic and a full audit trail through Docker + AWS EC2 + GitHub Actions CI/CD, ahead of the 1 Jan 2026 regulatory deadline.',
    ].join('\n'),
  },
  {
    title: 'AI Team Lead, Computer Vision',
    org: 'Whammy Tech · Contract · Led 4 engineers',
    period: 'Jun 2025 – Jan 2026',
    description: [
      'Owned: all AI work (detection models, inference pipeline, LLM reporting) and technical documentation; advised the backend, frontend and mobile engineers.',
      '- Led all AI development on IPBMS, a real-time fall/seizure detector on live RTSP streams (YOLO pose estimation plus LLM incident reports); designed a 5-frame temporal validation strategy to suppress single-frame false alarms.',
      '- Deployed and operated on-premise, live on 2 production cameras.',
    ].join('\n'),
  },
  {
    title: 'AI Agent Engineer',
    org: 'Ăng Ê Coffee · Contract · Solo, self-hosted',
    period: '2025 – Present',
    description: [
      'Owned: everything, from agent logic to the self-hosted server it still runs on.',
      '- Built a real-time voice ordering agent (LiveKit, TTS) in daily production use, with hand-built multi-LLM failover and a self-learning RAG loop.',
      '- Rolled out in phases (text → voice → real-time voice); self-hosted and still operates the stack.',
    ].join('\n'),
  },
  {
    title: 'Freelance Software Engineer, Team Lead',
    org: 'NEURADAO · Led 3 engineers',
    period: 'Oct 2025',
    description: [
      'Owned: AI trading logic, AI chatbot and trading-automation backend; one backend and one frontend engineer on the rest.',
      '- Led a 3-engineer team from zero to a production AI trading platform in 20 days, setting the architecture and delivery plan and owning AWS deployment (PostgreSQL) through go-live.',
    ].join('\n'),
  },
  {
    title: 'Platform Engineer (personal infrastructure)',
    org: 'Cicca Fleet · Self-hosted k3s homelab',
    period: '2026 – Present',
    description: [
      'Owned: design and operation of a multi-site Kubernetes cluster that hosts my public sites, including this one.',
      '- k3s across cloud VPS nodes and an ARM64 Orange Pi at home, joined over a Tailscale mesh with ACLs separating personal and client machines.',
      '- Fully GitOps: an ArgoCD app-of-apps syncs every workload from a Git repo; in-cluster container registry backed by MinIO; NFS StorageClass on a Synology NAS.',
      '- Observability with Grafana, Mimir, Loki and Alloy (node, Docker, GPU and NAS/SNMP metrics) and alert rules managed as code.',
      '- Public traffic enters through Cloudflare Tunnel — no inbound ports opened on the nodes.',
    ].join('\n'),
  },
  {
    title: 'IT Support Technician',
    org: 'University IT · Part-time',
    period: 'Jan 2022 – Dec 2024',
    description:
      'Supported university-wide IT operations across Academic Affairs, Examinations, HR, Accounting and Administration for cohorts K15–K20: hardware, networks, classroom and exam systems, user accounts, and onboarding new student IT support members.',
  },
];

export const resources = [
  { title: 'Résumé (PDF)', description: 'One-page CV: experience, skills, education and awards.', url: '/cv/letranminhdat-cv.pdf', repoUrl: null, tags: ['cv', 'pdf'] },
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
 * blog posts, analytics, stats and GSC/GitHub settings untouched.
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
