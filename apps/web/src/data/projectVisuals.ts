import type { Mission } from "@portfolio/types";

/**
 * Presentation-only extras for project cards and case-study pages, keyed by
 * mission slug. The CMS owns the words that matter (title, objective, stack,
 * status, order); this map only adds what it has no field for: card art, the
 * short card name and one-line pitch, timeline/domain labels and the role.
 *
 * A mission shows up in "Selected work" only when it has an entry here.
 */
export interface ProjectVisual {
  /** Short card name ("Siz"). */
  short: string;
  /** One-line pitch under the card name. */
  tagline: string;
  /** Monospace glyph drawn on the card art. */
  glyph: string;
  /** CSS background for the card art. */
  art: string;
  /** Up to three short card tags. */
  tags: string[];
  /** Human timeline label ("Aug 2026 – Present"). */
  when: string;
  /** Industry label ("Banking"). */
  domain: string;
  /** Role on the project, shown on the case-study page. */
  role: string;
  /** Who it was built for, as the case-study page names them (never the bank's or the café's brand). */
  client?: string;
  /** One-line result for the case-study meta grid ("Live MVP"). */
  outcome?: string;
  /** Eligible for the three large cards on the home page. */
  featured?: boolean;
  /** Overrides the status badge text derived from the CMS status. */
  statusLabel?: string;
  /** Real screenshots (16:10, 1600px) under /public/projects/<slug>/; the first is the card art. */
  images?: ProjectImage[];
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

/** Builds the screenshot list for a slug: files are /projects/<slug>/01.jpg, 02.jpg, … */
const shots = (slug: string, list: [caption: string, alt: string][]): ProjectImage[] =>
  list.map(([caption, alt], i) => ({ src: `/projects/${slug}/${String(i + 1).padStart(2, "0")}.jpg`, alt, caption }));

export const PROJECT_VISUALS: Record<string, ProjectVisual> = {
  "siz-commerce-gateway": {
    short: "Siz",
    tagline: "AI assistants that book your tickets, then hand payment back to you.",
    glyph: "MCP",
    art: "linear-gradient(135deg,#1C3FD6,#5B4BE6 60%,#0A1240)",
    tags: ["MCP", "Go", "OAuth 2.1"],
    when: "Aug 2026 – Present",
    domain: "AI commerce",
    role: "Backend & AI Engineer",
    client: "F&B and AI-commerce company",
    outcome: "Live MVP",
    featured: true,
    images: shots("siz-commerce-gateway", [
      ["Claude booking tickets through Siz", "Screenshot of a Claude chat where the assistant books tickets through the Siz MCP server"],
      ["AI-Ready score report", "Screenshot of the AI-Ready score report rating how ready a merchant is for AI assistants"],
      ["OAuth consent screen for the AI assistant", "Screenshot of the OAuth consent screen where a user grants the AI assistant access to their Siz account"],
      ["Manage connections", "Screenshot of the page where a user reviews and revokes connected AI assistants"],
      ["Merchant integration guide", "Screenshot of the merchant integration guide explaining how to connect a store to Siz"],
    ]),
  },
  "bank-llm-gateway": {
    short: "Bank AI Gateway",
    tagline: "One governed gateway between a bank’s teams and every LLM.",
    glyph: "{ $ }",
    art: "linear-gradient(135deg,#0E5A8A,#2F6BFF 55%,#0A1240)",
    tags: ["LiteLLM", "AWS Bedrock", "FinOps"],
    when: "Aug 2026 – Present",
    domain: "Banking",
    role: "AI Gateway Platform Engineer",
    client: "Enterprise banking client",
    outcome: "Spend matched to the real AWS bill",
    featured: true,
    images: shots("bank-llm-gateway", [
      ["Bedrock cost reconciliation", "Screenshot of the Bedrock cost reconciliation page comparing gateway spend with Bedrock invocations"],
      ["Reconciliation variance detail", "Screenshot of the variance detail view drilling into differences between gateway and Bedrock costs"],
      ["Vietnam PII policy template", "Screenshot of the Vietnam PII policy template that defines which personal data the gateway masks"],
      ["Guardrails monitor", "Screenshot of the guardrails monitor showing blocked and flagged LLM requests"],
      ["Tamper-evident audit log", "Screenshot of the tamper-evident audit log of every LLM request passing through the gateway"],
    ]),
  },
  "voice-ordering-agent": {
    short: "Bảo Bối",
    tagline: "A cat that takes your coffee order by voice.",
    glyph: "(( ))",
    art: "linear-gradient(135deg,#6B2FD6,#2F6BFF 60%,#0A1240)",
    tags: ["LiveKit", "Voice", "Go"],
    when: "May 2026 – Present",
    domain: "F&B",
    role: "Backend & AI Engineer",
    client: "F&B and AI-commerce company",
    outcome: "Ran in a real café",
    featured: true,
    images: shots("voice-ordering-agent", [
      ["Chat recommendation", "Screenshot of the ordering assistant recommending drinks in a chat conversation"],
      ["Mobile voice agent", "Screenshot of the cat mascot voice assistant taking an order on a tablet"],
      ["Desktop experience", "Screenshot of the voice ordering assistant on desktop"],
      ["Order dispatch", "Screenshot of the cart the assistant fills and sends to the café's ordering system"],
      ["Admin system health", "Screenshot of the admin page checking every service the assistant depends on"],
    ]),
  },
  "rag-enrollment-advisor": {
    short: "Admissions chatbot",
    tagline: "A 24/7 advisor that never invents a course.",
    glyph: "RAG",
    art: "linear-gradient(135deg,#0F7A6B,#1FA2FF 60%,#0A1240)",
    tags: ["RAG", "pgvector"],
    when: "Apr – Sep 2026",
    domain: "Education",
    role: "AI Agent Consultant Engineer",
    client: "Hướng Nghiệp Á Âu",
    outcome: "97% of AI drafts accepted",
    statusLabel: "HANDED OVER",
    images: shots("rag-enrollment-advisor", [
      ["Advisor console", "Screenshot of the admissions advisor console answering a prospective student's question"],
      ["LLM provider routing", "Screenshot of the settings page that routes requests between LLM providers"],
      ["System overview", "Screenshot of the system overview dashboard for the admissions chatbot"],
      ["Public API docs", "Screenshot of the public API documentation for the admissions chatbot"],
      ["Architecture", "Architecture diagram of the retrieval-augmented admissions chatbot"],
    ]),
  },
  "vas-accounting-erp": {
    short: "Accounting SaaS",
    tagline: "Multi-company books, built to Vietnamese standards.",
    glyph: "Σ",
    art: "linear-gradient(135deg,#1A2AB8,#3D6BFF 60%,#0A1240)",
    tags: ["React", "CI/CD"],
    when: "2025 – Sep 2026",
    domain: "Accounting",
    role: "Core Full-stack Developer",
    client: "Enterprise accounting client",
    outcome: "Used daily by 20 accountants",
    statusLabel: "HANDED OVER",
    images: shots("vas-accounting-erp", [
      ["Journal entries", "Screenshot of the journal entries list in the accounting app"],
      ["Trial balance", "Screenshot of the trial balance report built to Vietnamese accounting standards"],
      ["Financial reports", "Screenshot of the financial reports menu in the accounting app"],
      ["Cash payments", "Screenshot of the cash payment voucher screen in the accounting app"],
      ["Customers", "Screenshot of the customer list in the accounting app"],
    ]),
  },
  "ipbms-patient-monitoring": {
    short: "IPBMS",
    tagline: "Spots falls and seizures on live camera streams.",
    glyph: "◉",
    art: "linear-gradient(135deg,#8A2A6B,#5B4BE6 60%,#0A1240)",
    tags: ["YOLO", "RTSP"],
    when: "Jun 2025 – Jan 2026",
    domain: "Healthcare",
    role: "AI Team Lead, Computer Vision",
    client: "Whammy Tech",
    outcome: "84% fewer false alarms",
    images: shots("ipbms-patient-monitoring", [
      ["Real-time event dashboard", "Screenshot of the real-time dashboard listing fall and seizure events detected on camera streams"],
      ["Live fall alert on mobile", "Screenshot of the mobile app showing a live fall alert for a monitored patient"],
      ["Web admin portal", "Screenshot of the web admin portal for managing patients, cameras and caregivers"],
      ["Mobile AI summary", "Screenshot of the mobile app's AI summary of a patient's recent events"],
      ["Mobile subscription plans", "Screenshot of the subscription plans screen in the mobile app"],
    ]),
  },
  "neuradao-ai-trading": {
    short: "NEURADAO",
    tagline: "A live AI trading platform, shipped in 20 days.",
    glyph: "↗",
    art: "linear-gradient(135deg,#0E6B4A,#2F6BFF 60%,#0A1240)",
    tags: ["Python", "AWS"],
    when: "Oct 2025",
    domain: "Fintech",
    role: "Team Lead, Software Engineer",
    client: "NEURADAO",
    outcome: "Live in 20 days",
    images: shots("neuradao-ai-trading", [
      ["Landing hero", "Screenshot of the NEURADAO landing page hero section"],
      ["AI trading agent", "Screenshot of the AI trading agent configuration and performance view"],
      ["AI chat assistant", "Screenshot of the AI chat assistant answering a trading question"],
      ["Earnings dashboard", "Screenshot of the earnings dashboard showing a user's trading returns"],
      ["Chrome extension", "Screenshot of the NEURADAO Chrome extension"],
    ]),
  },
};

export interface WorkItem {
  mission: Mission;
  visual: ProjectVisual;
  /** 1-based position in the ordered work list ("01"). */
  no: string;
  status: { label: string; color: string };
}

const orderOf = (m: Mission, index: number): number => {
  const o = (m as Mission & { order?: unknown }).order;
  return typeof o === "number" ? o : index;
};

/** CMS status → badge. ACTIVE reads bright; finished work reads muted. */
export function workStatus(mission: Pick<Mission, "status">, visual?: Pick<ProjectVisual, "statusLabel">) {
  const active = mission.status === "ACTIVE";
  return {
    label: visual?.statusLabel ?? (active ? "ACTIVE" : "DELIVERED"),
    color: active && !visual?.statusLabel ? "#6FA8FF" : "#8C97B8",
  };
}

/** Every mission that has visuals, in CMS order (mission.order, else API order). */
export function orderedWork(
  missions: Mission[],
  visuals: Record<string, ProjectVisual> = PROJECT_VISUALS,
): WorkItem[] {
  return missions
    .map((mission, index) => ({ mission, index, visual: visuals[mission.slug] }))
    .filter((x): x is { mission: Mission; index: number; visual: ProjectVisual } => Boolean(x.visual))
    .sort((a, b) => orderOf(a.mission, a.index) - orderOf(b.mission, b.index) || a.index - b.index)
    .map(({ mission, visual }, i) => ({
      mission,
      visual,
      no: String(i + 1).padStart(2, "0"),
      status: workStatus(mission, visual),
    }));
}

/**
 * Splits the ordered work list for the home page: up to three large cards
 * (featured entries first in CMS order; if none are flagged, the first three),
 * the rest go to the swipeable row — still in CMS order.
 */
export function selectWork(
  missions: Mission[],
  visuals: Record<string, ProjectVisual> = PROJECT_VISUALS,
  largeCount = 3,
): { large: WorkItem[]; rest: WorkItem[] } {
  const all = orderedWork(missions, visuals);
  const flagged = all.filter((w) => w.visual.featured);
  const large = (flagged.length ? flagged : all).slice(0, largeCount);
  const rest = all.filter((w) => !large.includes(w));
  return { large, rest };
}
