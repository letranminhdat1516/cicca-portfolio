import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createSlugger, extractHeadings, slugify } from "@/lib/toc";
import { Markdown } from "@/components/blog/Markdown";
import { Toc } from "@/components/blog/Toc";

const POST = [
  "Intro paragraph.",
  "",
  "## The problem",
  "Text.",
  "",
  "```md",
  "## not a heading (inside code)",
  "```",
  "",
  "## Where **it** broke — [badly](https://x.dev)",
  "",
  "### A sub-heading stays out",
  "",
  "## Setup",
  "",
  "Setup",
  "---",
  "",
  "## Đặt `vấn đề` ##",
].join("\n");

describe("slugify / createSlugger", () => {
  it("lower-cases, drops punctuation and accents", () => {
    expect(slugify("Where it broke — badly!")).toBe("where-it-broke-badly");
    expect(slugify("Đặt vấn đề")).toBe("dat-van-de");
  });
  it("numbers repeats", () => {
    const s = createSlugger();
    expect([s("Setup"), s("Setup"), s("Setup")]).toEqual(["setup", "setup-2", "setup-3"]);
  });
});

describe("extractHeadings", () => {
  it("lists level-2 headings in order, skipping code fences and other levels", () => {
    expect(extractHeadings(POST)).toEqual([
      { id: "the-problem", text: "The problem" },
      { id: "where-it-broke-badly", text: "Where it broke — badly" },
      { id: "setup", text: "Setup" },
      { id: "setup-2", text: "Setup" },
      { id: "dat-van-de", text: "Đặt vấn đề" },
    ]);
  });
  it("returns nothing for a post without h2s", () => {
    expect(extractHeadings("# Title\n\nJust text.\n\n### small")).toEqual([]);
  });
});

describe("article markdown", () => {
  it("gives every rendered h2 the id the TOC links to", () => {
    const html = renderToStaticMarkup(<Markdown>{POST}</Markdown>);
    const rendered = [...html.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);
    expect(rendered).toEqual(extractHeadings(POST).map((h) => h.id));
  });
  it("turns a lone image into a captioned figure", () => {
    const html = renderToStaticMarkup(<Markdown>{'![Dashboard view](/a.png "The ops dashboard")'}</Markdown>);
    expect(html).toContain("<figure>");
    expect(html).toContain('alt="Dashboard view"');
    expect(html).toContain("<figcaption>The ops dashboard</figcaption>");
    expect(html).not.toContain("<p><figure>");
  });
});

describe("Toc", () => {
  it("hides with fewer than two headings", () => {
    expect(renderToStaticMarkup(<Toc headings={[{ id: "a", text: "A" }]} />)).toBe("");
  });
  it("renders anchor links for desktop and the collapsed mobile list", () => {
    const html = renderToStaticMarkup(<Toc headings={extractHeadings(POST)} />);
    expect(html.match(/href="#the-problem"/g)).toHaveLength(2);
    expect(html).toContain("<details");
    expect(html).toContain('aria-label="On this page"');
  });
});
