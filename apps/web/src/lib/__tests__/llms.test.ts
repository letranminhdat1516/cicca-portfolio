import { describe, expect, it } from "vitest";
import { buildLlmsTxt, splitDescription } from "@/lib/llms";
import { SITE_URL } from "@/lib/seo";
import { portfolio } from "./fixture";

describe("splitDescription", () => {
  it("separates the lead line from bullets", () => {
    expect(splitDescription("Owned: x.\n- a\n- b")).toEqual({ lead: "Owned: x.", bullets: ["a", "b"] });
  });
  it("treats plain paragraphs as lead only", () => {
    expect(splitDescription("Just text.")).toEqual({ lead: "Just text.", bullets: [] });
  });
});

describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt(portfolio, [
    { slug: "hello", title: "Hello", excerpt: "Intro", tags: [], coverImage: null, publishedAt: null },
  ]);

  it("follows the llms.txt shape: H1, blockquote summary, H2 sections", () => {
    const lines = txt.split("\n");
    expect(lines[0]).toBe("# Le Tran Minh Dat");
    expect(lines[2]).toBe("> AI-native full-stack developer in Ho Chi Minh City.");
    for (const h of ["## Key pages", "## Experience", "## Projects", "## Skills", "## Education & awards", "## Articles", "## Contact"]) {
      expect(txt).toContain(h);
    }
  });

  it("links the HTML and PDF résumé with absolute URLs", () => {
    expect(txt).toContain(`[Résumé](${SITE_URL}/cv)`);
    expect(txt).toContain(`${SITE_URL}/cv/letranminhdat-cv.pdf`);
    expect(txt).toContain(`- Résumé: ${SITE_URL}/cv`);
  });

  it("renders experience bullets and collapses whitespace in projects", () => {
    expect(txt).toContain("### LLM Gateway Engineer — Enterprise client (Banking) (2026 – Present)");
    expect(txt).toContain("- Built the gateway.");
    expect(txt).toContain("Single control point between apps and LLM providers.");
    expect(txt).toContain("based in Ho Chi Minh City, Vietnam");
  });

  it("strips the gamified suffix from skill group names", () => {
    expect(txt).toContain("- LLM / AI: Hybrid RAG");
  });
});
