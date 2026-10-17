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
  /** Eligible for the three large cards on the home page. */
  featured?: boolean;
  /** Overrides the status badge text derived from the CMS status. */
  statusLabel?: string;
}

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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    statusLabel: "HANDED OVER",
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
    statusLabel: "HANDED OVER",
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
