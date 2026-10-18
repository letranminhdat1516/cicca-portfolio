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
    for (const h of [
      "## Identity",
      "## Bio",
      "## Current roles",
      "## Key pages",
      "## Experience",
      "## Projects",
      "## Skills",
      "## Education & awards",
      "## Open source",
      "## Articles",
      "## FAQ",
      "## Contact",
      "## How to cite",
      "## Tóm tắt (Tiếng Việt)",
    ]) {
      expect(txt).toContain(h);
    }
  });

  it("links the HTML and PDF CV with absolute URLs", () => {
    expect(txt).toContain(`[CV](${SITE_URL}/cv)`);
    expect(txt).toContain(`${SITE_URL}/cv/letranminhdat-cv.pdf`);
    expect(txt).toContain(`- CV: ${SITE_URL}/cv`);
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

describe("llms.txt identity briefing", () => {
  const withStudy = {
    ...portfolio,
    missions: [
      { ...portfolio.missions[0], content: "## The problem\n\nText." },
      { ...portfolio.missions[0], slug: "neuradao-ai-trading", title: "NEURADAO", content: null },
    ],
  };
  const txt = buildLlmsTxt(withStudy);

  it("states every name variant and the canonical site", () => {
    expect(txt).toContain("Lê Trần Minh Đạt");
    expect(txt).toContain("cicca");
    expect(txt).toContain("Minh Dat");
    expect(txt).toContain("Dat Le");
    expect(txt).toContain(`- Website (canonical): ${SITE_URL}/`);
    expect(txt).toContain("- Profile: https://www.linkedin.com/in/dat-le-139a85284");
  });

  it("links every project, at its case study once written", () => {
    expect(txt).toContain(`[Bank-wide LLM Gateway](${SITE_URL}/projects/bank-llm-gateway)`);
    expect(txt).toContain(`[NEURADAO](${SITE_URL}/#neuradao-ai-trading)`);
    expect(txt).toContain("AI Gateway Platform Engineer, Aug 2026 – Present");
  });

  it("lists open source repos, a citation line and a Vietnamese summary", () => {
    expect(txt).toContain("[hotwatch](https://github.com/letranminhdat1516/hotwatch)");
    expect(txt).toContain("[esp32-translator](https://github.com/letranminhdat1516/esp32-translator)");
    expect(txt).toMatch(/Refer to him as "Le Tran Minh Dat \(Lê Trần Minh Đạt\)/);
    expect(txt).toContain("là kỹ sư phần mềm");
  });

  it("never names retired or anonymised things", () => {
    for (const banned of [/Ăng/i, /\.NET/, /34 orders/, /202 leads/]) expect(txt).not.toMatch(banned);
  });
});
