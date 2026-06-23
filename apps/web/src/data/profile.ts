// Temporary content config — replaced by the NestJS API in M2.
// Shapes mirror the data inventoried from the original Player Profile design.

export type Rarity = "common" | "rare" | "epic" | "legendary";

export const RARITY: Record<Rarity, { color: string; glow: string; label: string }> = {
  common: { color: "#6b7280", glow: "rgba(107,114,128,0.5)", label: "COMMON" },
  rare: { color: "#22d3ee", glow: "rgba(34,211,238,0.6)", label: "RARE" },
  epic: { color: "#b026ff", glow: "rgba(176,38,255,0.6)", label: "EPIC" },
  legendary: { color: "#ffd23f", glow: "rgba(255,210,63,0.65)", label: "LEGENDARY" },
};

export const profile = {
  name: "[YOUR NAME]",
  classRole: "Creative Developer",
  roles: ["Creative Developer", "Full-stack Engineer", "UI Alchemist", "Problem Solver"],
  tagline: "[A one-line tagline about you — what you build and why it matters.]",
  bio: "[Placeholder bio. Write 2–3 sentences about who you are, what you build, and what you're chasing next.]",
  level: 42,
  rank: "LEGENDARY",
  region: "REMOTE",
  email: "hello@example.com",
  xpCurrent: 7400,
  xpMax: 10000,
};

export const stats: { label: string; value: number }[] = [
  { label: "FRONTEND", value: 95 },
  { label: "BACKEND", value: 82 },
  { label: "AI/ML", value: 78 },
  { label: "WEB3", value: 64 },
  { label: "INFRA", value: 72 },
];

export const counters: { label: string; value: number; suffix?: string; color: string }[] = [
  { label: "PROJECTS", value: 48, color: "#22d3ee" },
  { label: "YEARS XP", value: 7, suffix: "+", color: "#b026ff" },
  { label: "COMMITS", value: 12400, color: "#ff2d9b" },
  { label: "SATISFACTION", value: 99, suffix: "%", color: "#ffd23f" },
];

export type Mission = {
  code: string;
  title: string;
  objective: string;
  diff: string;
  impact: string;
  loadout: string[];
  status: "COMPLETE" | "ACTIVE";
  statusColor: string;
};

export const missions: Mission[] = [
  {
    code: "MSN_01",
    title: "Realtime Collab Canvas",
    objective: "Built a multiplayer design canvas with CRDT sync and sub-50ms cursor presence.",
    diff: "★★★★☆",
    impact: "+2.4k USERS",
    loadout: ["React", "TypeScript", "WebGL", "WebSocket"],
    status: "COMPLETE",
    statusColor: "#4ade80",
  },
  {
    code: "MSN_02",
    title: "AI Code Reviewer",
    objective: "Shipped an LLM pipeline that reviews PRs and proposes fixes inline.",
    diff: "★★★★★",
    impact: "1ST PLACE",
    loadout: ["Next.js", "NestJS", "LLM", "Postgres"],
    status: "COMPLETE",
    statusColor: "#4ade80",
  },
  {
    code: "MSN_03",
    title: "Onchain Identity Wallet",
    objective: "Self-custodial wallet with social recovery and gasless onboarding.",
    diff: "★★★★☆",
    impact: "+800 WALLETS",
    loadout: ["Solidity", "Viem", "React", "IPFS"],
    status: "ACTIVE",
    statusColor: "#ffd23f",
  },
  {
    code: "MSN_04",
    title: "Edge Analytics Engine",
    objective: "Privacy-first analytics running on the edge with zero cookies.",
    diff: "★★★☆☆",
    impact: "10M EVENTS/DAY",
    loadout: ["Rust", "WASM", "ClickHouse"],
    status: "ACTIVE",
    statusColor: "#ffd23f",
  },
];

export type SkillGroup = {
  name: string;
  items: { n: string; r: Rarity; lvl: number; tip: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    name: "FRONTEND // COMBAT",
    items: [
      { n: "React", r: "legendary", lvl: 95, tip: "Years of battle-tested component design." },
      { n: "TypeScript", r: "legendary", lvl: 92, tip: "Strict mode everywhere." },
      { n: "Tailwind", r: "epic", lvl: 88, tip: "Design systems at speed." },
      { n: "WebGL", r: "rare", lvl: 70, tip: "Shaders & creative coding." },
    ],
  },
  {
    name: "BACKEND // ENGINEERING",
    items: [
      { n: "NestJS", r: "epic", lvl: 86, tip: "Modular APIs." },
      { n: "Postgres", r: "epic", lvl: 84, tip: "Schema design & tuning." },
      { n: "Node.js", r: "legendary", lvl: 90, tip: "Event-loop fluent." },
      { n: "Redis", r: "rare", lvl: 68, tip: "Caching & queues." },
    ],
  },
  {
    name: "PLATFORM // SUPPORT",
    items: [
      { n: "Docker", r: "epic", lvl: 80, tip: "Repeatable environments." },
      { n: "AWS", r: "rare", lvl: 66, tip: "Core services." },
      { n: "CI/CD", r: "rare", lvl: 72, tip: "Ship safely, often." },
      { n: "Rust", r: "common", lvl: 40, tip: "Learning in progress." },
    ],
  },
];

export type Achievement = {
  year: string;
  title: string;
  desc: string;
  color: string;
  glow: string;
};

export const achievements: Achievement[] = [
  { year: "2026", title: "Open Source Maintainer", desc: "Maintained a library crossing 5k stars.", color: "#ffd23f", glow: "rgba(255,210,63,0.65)" },
  { year: "2025", title: "Hackathon Champion", desc: "1st place out of 200+ teams.", color: "#b026ff", glow: "rgba(176,38,255,0.6)" },
  { year: "2024", title: "Conference Speaker", desc: "Spoke on realtime architecture.", color: "#22d3ee", glow: "rgba(34,211,238,0.6)" },
  { year: "2023", title: "Shipped at Scale", desc: "Led a launch serving millions.", color: "#22d3ee", glow: "rgba(34,211,238,0.6)" },
  { year: "2022", title: "First Production AI Feature", desc: "Took an ML feature from PoC to prod.", color: "#6b7280", glow: "rgba(107,114,128,0.5)" },
];

export const socials: { label: string; name: string; href: string }[] = [
  { label: "GH", name: "GitHub", href: "#" },
  { label: "IN", name: "LinkedIn", href: "#" },
  { label: "TW", name: "Twitter", href: "#" },
  { label: "DR", name: "Dribbble", href: "#" },
];

export const navItems: { id: string; en: string }[] = [
  { id: "about", en: "PROFILE" },
  { id: "missions", en: "MISSIONS" },
  { id: "inventory", en: "INVENTORY" },
  { id: "trophies", en: "TROPHIES" },
  { id: "contact", en: "CONTACT" },
];
