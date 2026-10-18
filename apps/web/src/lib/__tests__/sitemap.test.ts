import { describe, expect, it, vi } from "vitest";
import { portfolio } from "./fixture";

const missions = [
  { ...portfolio.missions[0], content: "## The problem\n\nA real write-up." },
  { ...portfolio.missions[0], slug: "neuradao-ai-trading", title: "NEURADAO", content: null },
];
vi.mock("@/lib/portfolio", () => ({
  getPortfolio: async () => ({ ...portfolio, missions, seo: { ...portfolio.seo, updatedAt: "2026-10-01T00:00:00.000Z" } }),
}));
vi.mock("@/lib/blog", async (orig) => ({
  ...(await orig<typeof import("@/lib/blog")>()),
  getFullPosts: async () => [],
}));

const { default: sitemap } = await import("@/app/sitemap");
const { default: robots, AI_CRAWLERS } = await import("@/app/robots");
const { SITE_URL } = await import("@/lib/seo");

describe("sitemap", () => {
  it("lists only projects with a case study, with real lastmod and screenshot images", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${SITE_URL}/projects/bank-llm-gateway`);
    expect(urls).not.toContain(`${SITE_URL}/projects/neuradao-ai-trading`);
    const project = entries.find((e) => e.url.endsWith("/projects/bank-llm-gateway"))!;
    expect(project.lastModified).toEqual(new Date("2026-10-01T00:00:00.000Z"));
    expect(project.images).toContain(`${SITE_URL}/projects/bank-llm-gateway/01.jpg`);
    expect(project.images).toHaveLength(5);
  });
});

describe("robots", () => {
  it("welcomes search and AI crawlers and blocks only private paths", () => {
    for (const bot of ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"]) {
      expect(AI_CRAWLERS).toContain(bot);
    }
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    for (const rule of rules) expect(rule.disallow).toEqual(["/admin", "/api/"]);
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
