import type { Portfolio } from "@portfolio/types";

export const portfolio: Portfolio = {
  profile: {
    id: 1,
    name: "Le Tran Minh Dat",
    classRole: "AI-Native Full-Stack Developer",
    roles: ["AI-Native Full-Stack Developer"],
    tagline: "Ships production systems.",
    bio: "Full-stack engineer with six production systems shipped in the past year.",
    level: 42,
    rank: "LEGENDARY",
    region: "HO CHI MINH CITY, VN",
    email: "datltmse@gmail.com",
    xpCurrent: 1,
    xpMax: 2,
    avatarUrl: "/cicca-03.png",
  },
  stats: [],
  counters: [],
  missions: [
    {
      code: "MSN_01",
      slug: "bank-llm-gateway",
      title: "Bank-wide LLM Gateway",
      objective: "Single control point\n between apps and LLM providers.",
      difficulty: "★★★★★",
      impact: "BANK-WIDE",
      status: "ACTIVE",
      statusColor: "#ffd23f",
      loadout: ["LiteLLM", "RBAC"],
    },
  ],
  skillGroups: [
    { name: "LLM / AI // SPECIALTY", items: [{ n: "Hybrid RAG", tip: "" }] },
    { name: "SPOKEN // LANGUAGES", items: [{ n: "Vietnamese (native)", tip: "" }, { n: "English (professional)", tip: "" }] },
  ],
  achievements: [
    { year: "AWARD", title: "Top 4 — Viettel AI Race", description: "Hackathon.", color: "#fff", glow: "" },
    { year: "2026", title: "B.Eng. Software Engineering — FPT University", description: "GPA 3.47 / 4.0.", color: "#fff", glow: "" },
  ],
  socials: [
    { label: "GH", name: "GitHub", href: "https://github.com/letranminhdat1516" },
    { label: "CV", name: "Résumé", href: "/cv" },
    { label: "TW", name: "Twitter", href: "#" },
  ],
  experiences: [
    {
      title: "LLM Gateway Engineer",
      org: "Enterprise client (Banking)",
      period: "2026 – Present",
      description: "Owned: architecture.\n- Built the gateway.\n- Added guardrails.",
    },
    { title: "IT Support", org: "University IT", period: "Jan 2022 – Dec 2024", description: "Supported IT operations." },
  ],
  resources: [],
  seo: {
    siteName: "Le Tran Minh Dat",
    defaultTitle: "Le Tran Minh Dat — AI-Native Full-Stack Developer",
    defaultDescription: "AI-native full-stack developer in Ho Chi Minh City.",
    keywords: ["Le Tran Minh Dat"],
    ogImageUrl: null,
    twitterHandle: null,
    gscVerification: "gsc-token",
    llmsTxt: null,
  },
};
