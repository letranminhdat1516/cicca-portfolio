import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { BlogPost } from "@portfolio/types";
import { portfolio } from "./fixture";

const missions = [
  { ...portfolio.missions[0], content: "## How it works\n\nA real write-up.\n\n> One gateway, every model." },
  { ...portfolio.missions[0], slug: "siz-commerce-gateway", title: "Siz", content: null },
];
const post: BlogPost = {
  id: "1",
  slug: "gateway-notes",
  title: "Running an LLM gateway",
  excerpt: "What a governed gateway changes for a bank.",
  tags: ["llm"],
  coverImage: null,
  publishedAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-02T00:00:00.000Z",
  createdAt: "2026-09-01T00:00:00.000Z",
  published: true,
  content: "Intro.\n\n## First part\n\nText.\n\n## Second part\n\n> A pull-quote.\n\nMore.",
};

vi.mock("@/lib/portfolio", () => ({ getPortfolio: async () => ({ ...portfolio, missions }) }));
const second: BlogPost = { ...post, slug: "k3s-notes", title: "A k3s homelab", tags: ["k3s"], publishedAt: "2026-08-01T00:00:00.000Z" };
vi.mock("@/lib/blog", async (orig) => ({
  ...(await orig<typeof import("@/lib/blog")>()),
  getPost: async () => post,
  getPosts: async () => [post, second],
  getFullPosts: async () => [post, second],
}));

const { default: ProjectPage } = await import("@/app/(site)/projects/[slug]/page");
const { default: BlogPostPage } = await import("@/app/(site)/blog/[slug]/page");
const { default: BlogPage } = await import("@/app/(site)/blog/page");

describe("project case-study page", () => {
  it("tells the story: counter, meta grid, numbered sections, screens", async () => {
    const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ slug: "bank-llm-gateway" }) }));
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    expect(html).toContain("← All work");
    expect(html).toMatch(/01<!-- --> \/ <!-- -->02|01 \/ 02/);
    expect(html).toContain("Enterprise banking client");
    expect(html).toContain("Spend matched to the real AWS bill");
    expect(html).toContain(">About the project</h2>");
    expect(html).toContain(">Screens</h2>");
    expect(html).toContain(">Stack &amp; links</h2>");
    expect(html).toContain("A real write-up.");
    expect(html).toContain("Reconciliation variance detail");
    expect(html).toContain('href="/projects/siz-commerce-gateway"');
    expect(html).toContain('"@type":"Article"');
  });
});

describe("blog post page", () => {
  it("renders byline, read time and a TOC whose links hit the h2 ids", async () => {
    const html = renderToStaticMarkup(await BlogPostPage({ params: Promise.resolve({ slug: "gateway-notes" }) }));
    expect(html).toContain("← All notes");
    expect(html).toContain("min read");
    expect(html).toContain("What a governed gateway changes for a bank.");
    expect(html).toContain("Le Tran Minh Dat");
    expect(html).toContain('href="#first-part"');
    expect(html).toContain('<h2 id="first-part">');
    expect(html).toContain('<h2 id="second-part">');
    expect(html).toContain('"@type":"BlogPosting"');
  });
});

describe("blog index page", () => {
  it("chips with counts, featured latest post, list row with topic and read time, RSS block", async () => {
    const html = renderToStaticMarkup(await BlogPage());
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    expect(html).toMatch(/>All<!-- -->?<span[^>]*>2<\/span>|>All<span[^>]*>2<\/span>/);
    expect(html).toMatch(/>LLM<!-- -->?<span[^>]*>1<\/span>|>LLM<span[^>]*>1<\/span>/);
    expect(html).toContain("LATEST");
    expect(html).toContain('href="/blog/gateway-notes"');
    expect(html).toContain('href="/blog/k3s-notes"');
    expect(html).toContain(">Infra<");
    expect(html).toContain("1 min read");
    expect(html).toContain('href="/feed.xml"');
    expect(html).not.toContain('type="email"');
  });
});
