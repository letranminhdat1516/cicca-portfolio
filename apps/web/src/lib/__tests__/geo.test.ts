import { describe, expect, it } from "vitest";
import type { BlogPost } from "@portfolio/types";
import { buildFaq } from "@/lib/faq";
import { isThin } from "@/lib/blog";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms";
import { SITE_URL, pageMetadata, projectPath, seoOf } from "@/lib/seo";
import { articleJsonLd, blogJsonLd, faqJsonLd, homeJsonLd, projectsJsonLd } from "@/components/seo/JsonLd";
import { portfolio } from "./fixture";

type Obj = Record<string, unknown>;

const post: BlogPost = {
  id: "1",
  slug: "hello",
  title: "Hello",
  excerpt: "Intro",
  tags: ["a"],
  coverImage: null,
  publishedAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-02T00:00:00.000Z",
  createdAt: "2026-06-01T00:00:00.000Z",
  published: true,
  content: "One two three.",
};

describe("FAQ", () => {
  const faqs = buildFaq(portfolio);

  it("answers in the third person with the native-script name and place", () => {
    expect(faqs[0].q).toBe("Who is Le Tran Minh Dat?");
    expect(faqs[0].a).toContain("Le Tran Minh Dat (Lê Trần Minh Đạt) is an AI-Native Full-Stack Developer based in Ho Chi Minh City, Vietnam.");
    expect(faqs.map((f) => f.a).join(" ")).not.toMatch(/\bI\b/);
  });

  it("only lists real external links as contact routes", () => {
    const contact = faqs.at(-1)!.a;
    expect(contact).toContain("datltmse@gmail.com");
    expect(contact).toContain("https://github.com/letranminhdat1516");
    expect(contact).not.toContain("Twitter");
  });

  it("is mirrored in FAQPage JSON-LD and llms.txt", () => {
    const ld = faqJsonLd(portfolio) as Obj;
    expect(ld["@type"]).toBe("FAQPage");
    expect((ld.mainEntity as Obj[]).length).toBe(faqs.length);
    expect(buildLlmsTxt(portfolio)).toContain("**Who is Le Tran Minh Dat?**");
  });
});

describe("projects", () => {
  it("point at the home anchor until a case study exists", () => {
    const [m] = portfolio.missions;
    expect(projectPath(m)).toBe("/#bank-llm-gateway");
    expect(projectPath({ ...m, content: "# Study" })).toBe("/projects/bank-llm-gateway");
  });

  it("are listed as works authored by the person", () => {
    const list = projectsJsonLd(portfolio) as Obj;
    const first = (list.itemListElement as Obj[])[0].item as Obj;
    expect(first).toMatchObject({ "@type": "CreativeWork", name: "Bank-wide LLM Gateway", url: `${SITE_URL}/#bank-llm-gateway` });
    expect(homeJsonLd(portfolio).map((n) => (n as Obj)["@type"])).toEqual(["Person", "WebSite", "ProfilePage", "ItemList", "FAQPage"]);
  });
});

describe("blog", () => {
  it("flags stub posts so they are kept out of the index", () => {
    expect(isThin(post)).toBe(true);
    expect(isThin({ content: "word ".repeat(250) })).toBe(false);
  });

  it("gives every page a share image even when openGraph is overridden", () => {
    const m = pageMetadata({ seo: seoOf(portfolio), path: "/blog", title: "Blog", description: "d" });
    expect((m.openGraph?.images as Obj[])[0].url).toBe(`${SITE_URL}/opengraph-image`);
    expect(m.twitter?.images).toEqual([`${SITE_URL}/opengraph-image`]);
    expect(pageMetadata({ seo: seoOf(portfolio), path: "/x", title: "t", description: "d", noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it("emits BlogPosting with publisher, word count and a per-post image", () => {
    const ld = articleJsonLd(post, "Le Tran Minh Dat") as Obj;
    expect(ld).toMatchObject({ wordCount: 3, image: `${SITE_URL}/blog/hello/og`, dateModified: post.updatedAt });
    expect(ld.publisher).toMatchObject({ name: "Le Tran Minh Dat" });
    expect((blogJsonLd([post])[0] as Obj)["@type"]).toBe("Blog");
  });

  it("llms-full.txt appends each article in full", () => {
    const txt = buildLlmsFullTxt(portfolio, [post]);
    expect(txt).toContain(`Source: ${SITE_URL}/blog/hello`);
    expect(txt).toContain("One two three.");
  });
});
