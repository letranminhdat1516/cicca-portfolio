// Static design copy for the public site that has no home in the CMS.
// Copied verbatim from the approved design (Main.dc.html). Anything the CMS
// owns — name, role, tagline, bio, projects, experience, awards, socials —
// is NOT here; it comes from getPortfolio().

export const ACCENT = "#2F6BFF";

export const BRAND = {
  logo: "/brand/logo-blue.png",
  logoWidth: 760,
  logoHeight: 470,
  kicker: "AI-native full-stack",
};

export const HERO = {
  eyebrow: "Open to work · Ho Chi Minh City / remote",
  subline: ["Agents", "Backend", "LLM Infrastructure"],
  fallbackRole: "AI-Native Software Engineer",
  robotAlt: "Hooded 3D robot holding glowing Enter and Shift keycaps",
  /** Orbit chips around the robot (also shown as a row on phones). */
  chips: [
    { label: "Claude Agent SDK", dot: "#6FA8FF", glow: "rgba(111,168,255,0.22)" },
    { label: "RAG · pgvector", dot: "#3DDC97", glow: "rgba(61,220,151,0.22)" },
    { label: "k3s · GitOps", dot: "#9B8CFF", glow: "rgba(155,140,255,0.22)" },
  ],
};

export const ABOUT = {
  command: "$ whoami --verbose",
  meta: "Remote-ready · GMT+7 · async-first",
  status: "READY_TO_DEPLOY",
  openToWork: "Open to work · freelance & contract",
};

/** About me — "Next quests": where the user is headed. */
export const FOCUS = [
  { k: "Studio", l: "Grow Zillexa into a real team" },
  { k: "Research", l: "A paper I’m proud of" },
  { k: "Open source", l: "Tools people install" },
  { k: "Voice", l: "Write, speak, share" },
];

export const NOW = [
  { role: "AI Gateway Platform Engineer", where: "Enterprise banking client · maintaining" },
  { role: "Backend & AI Engineer", where: "Siz & Bảo Bối · contract" },
  { role: "Co-founder", where: "Zillexa · independent dev studio" },
];

export const DOMAINS = ["Banking", "Education", "Healthcare", "Food & beverage", "Fintech", "Infrastructure"];

export const WORK_COPY = {
  eyebrow: "01 · SELECTED WORK",
  lead: "Live or delivered to a paying client. The full stories live on the blog.",
};

const GH = "https://github.com/letranminhdat1516";

export interface RepoNode {
  id?: string;
  name: string;
  href?: string;
  public?: boolean;
  soon?: boolean;
  children?: RepoNode[];
}

export const REPO_TREE: RepoNode[] = [
  {
    id: "oss",
    name: "open source",
    children: [
      { name: "hotwatch", href: `${GH}/hotwatch`, public: true },
      { name: "esp32-translator", href: `${GH}/esp32-translator`, public: true },
      { name: "voxgate (soon)", href: "#desk", public: false, soon: true },
    ],
  },
  {
    id: "client",
    name: "client work",
    children: [
      { name: "siz-commerce-gateway", href: "/projects/siz-commerce-gateway" },
      { name: "baobei-voice-assistant", href: "/projects/voice-ordering-agent" },
      { name: "bank-ai-gateway", href: "/projects/bank-llm-gateway" },
      { name: "admissions-chatbot", href: "/projects/rag-enrollment-advisor" },
      { name: "accounting-saas", href: "/projects/vas-accounting-erp" },
      { name: "ipbms", href: "/projects/ipbms-patient-monitoring" },
      { name: "neuradao", href: "/projects/neuradao-ai-trading" },
    ],
  },
];

export const SNEAK_PEEK = {
  hiddenLabel: "Something’s under here",
  shownLabel: "Hide it again",
  href: `${GH}/hotwatch`,
  badge: "IN PROGRESS",
  title: "hotwatch",
  body: "A small, fast system monitor for your Mac and the servers you look after — the next release is on the way.",
};

export const TOOLS = [
  { name: "hotwatch", href: `${GH}/hotwatch`, icon: "monitor" as const },
  { name: "Translator", href: `${GH}/esp32-translator`, icon: "translate" as const },
];

const HOT = ["Claude SDK", "MCP", "PostgreSQL", "k3s"];
const TILTS = ["-2deg", "1deg", "0deg", "-1deg", "1.5deg", "0.5deg", "-0.5deg"];
export const STACK_CHIPS = [
  "Next.js", "NestJS", "React", "Python", "Go", "MCP", "PostgreSQL", "pgvector", "Redis", "Claude SDK",
  "Claude", "OpenAI", "Gemini", "AWS Bedrock", "LiteLLM", "LiveKit", "YOLO", "AWS", "k3s", "ArgoCD",
].map((n, i) => ({ n, hot: HOT.includes(n), tilt: TILTS[i % TILTS.length] }));

export const EXPERIENCE_COPY = {
  eyebrow: "03 · EXPERIENCE",
  lead: "Banking, education, healthcare, food & beverage and fintech — plus the homelab this site runs on.",
};

export const RECOGNITION_TILTS = ["-1deg", "0.8deg", "-0.5deg", "0.6deg"];

/** Where an award card leads; matched on the CMS title, which has no link field. */
const AWARD_LINKS: { match: RegExp; href: string }[] = [
  { match: /chord/i, href: "/projects/chord-agents" },
  { match: /viettel/i, href: "/projects/viettel-ai-race-2026" },
  { match: /b\.?eng|university|degree/i, href: "/cv" },
];

export function awardHref(title: string): string | undefined {
  return AWARD_LINKS.find((l) => l.match.test(title))?.href;
}

export const GALLERY = [
  { title: "Siz — booking a ticket through an AI assistant", meta: "Video · demo coming soon", video: true, slug: "siz-commerce-gateway" },
  { title: "Bảo Bối — ordering a drink by voice", meta: "Video · demo coming soon", video: true, slug: "voice-ordering-agent" },
];
export const KEYCAP = {
  src: "/brand/keycap.png",
  width: 1279,
  height: 951,
  alt: "Glowing Cicca keycap on a keyboard",
};

export const CTA = {
  title: "READY FOR THE NEXT QUEST",
  body: "Have a system that needs to reach production? Open to collaborations, freelance missions and full-time roles — send a signal.",
  button: "Contact me",
};

export const FOOTER_LINE = "SYSTEM LOADED · NO PIXELS HARMED · SERVED FROM A K3S HOMELAB";

// ─── hero decoration (deterministic so server and client render the same) ───

/** Tiny LCG used by the design so the art is identical on every render. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const SPARKS = (
  [
    ["8%", "12%", "4px", "0s"], ["30%", "4%", "3px", ".6s"], ["70%", "2%", "5px", "1.2s"], ["92%", "24%", "3px", ".3s"],
    ["4%", "48%", "3px", "1.8s"], ["96%", "60%", "4px", ".9s"], ["16%", "70%", "5px", "2.2s"], ["86%", "82%", "3px", "1.5s"],
    ["50%", "0%", "3px", "2.6s"], ["62%", "90%", "4px", ".4s"],
  ] as const
).map(([x, y, size, delay]) => ({ x, y, size, delay }));

/** Binary 0/1 field on the stage floor. */
export const BITS = (() => {
  const rand = seeded(7);
  const colors = ["#BFD8FF", "#7FE6F0", "#A99BFF", "#6FA8FF"];
  const out: { x: number; y: number; v: string; size: number; c: string; dur: string; d: string }[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 3; col < 18; col++) {
      if (rand() < 0.45) continue;
      out.push({
        x: col * 34,
        y: row * 34 + 6,
        v: rand() < 0.5 ? "0" : "1",
        size: 18 - row,
        c: colors[Math.floor(rand() * colors.length)],
        dur: `${(2.6 + rand() * 2.4).toFixed(2)}s`,
        d: `${(rand() * 4).toFixed(2)}s`,
      });
    }
  }
  return out;
})();

export const FLOOR_TILES = [
  { left: 273, top: 35, color: "rgba(111,168,255,0.45)", delay: "0s" },
  { left: 409, top: 69, color: "rgba(127,230,240,0.4)", delay: "1.4s" },
  { left: 205, top: 103, color: "rgba(169,155,255,0.4)", delay: "2.6s" },
  { left: 443, top: 1, color: "rgba(111,168,255,0.4)", delay: "3.4s" },
];

/** Pixel mosaic covering the sneak peek (12 × 9). */
export const PEEK_CELLS = (() => {
  const rand = seeded(11);
  return Array.from({ length: 108 }, () => {
    const r = rand();
    return r < 0.4 ? "#1C3FD6" : r < 0.5 ? "#6FA8FF" : "#0B1233";
  });
})();
