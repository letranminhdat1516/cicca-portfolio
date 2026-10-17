import { describe, expect, it } from "vitest";
import type { Mission } from "@portfolio/types";
import { PROJECT_VISUALS, orderedWork, selectWork, workStatus, type ProjectVisual } from "@/data/projectVisuals";
import { formatPostDate, readMinutes, topicOf } from "@/lib/blogTopics";
import { bioParagraphs } from "@/components/site/About";
import { experienceLine, isCurrent } from "@/components/site/Experience";

const mission = (slug: string, extra: Partial<Mission> & { order?: number } = {}): Mission =>
  ({
    code: slug.toUpperCase(),
    slug,
    title: slug,
    objective: `${slug} objective`,
    difficulty: "",
    impact: "",
    status: "ACTIVE",
    statusColor: "#fff",
    loadout: [],
    ...extra,
  }) as Mission;

const vis = (short: string, extra: Partial<ProjectVisual> = {}): ProjectVisual => ({
  short,
  tagline: "",
  glyph: "",
  art: "",
  tags: [],
  when: "",
  domain: "",
  role: "",
  ...extra,
});

describe("project visuals map", () => {
  it("covers every slug the design ships", () => {
    expect(Object.keys(PROJECT_VISUALS).sort()).toEqual(
      [
        "bank-llm-gateway",
        "ipbms-patient-monitoring",
        "neuradao-ai-trading",
        "rag-enrollment-advisor",
        "siz-commerce-gateway",
        "vas-accounting-erp",
        "voice-ordering-agent",
      ].sort(),
    );
    for (const v of Object.values(PROJECT_VISUALS)) {
      expect(v.short && v.tagline && v.glyph && v.art && v.when && v.domain).toBeTruthy();
      expect(v.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("orderedWork / selectWork", () => {
  const visuals = { a: vis("A"), b: vis("B"), c: vis("C"), d: vis("D"), e: vis("E") };

  it("keeps only missions with visuals, in API order, numbered 01…", () => {
    const work = orderedWork([mission("a"), mission("no-visual"), mission("b"), mission("c")], visuals);
    expect(work.map((w) => w.mission.slug)).toEqual(["a", "b", "c"]);
    expect(work.map((w) => w.no)).toEqual(["01", "02", "03"]);
  });

  it("sorts by mission.order when the CMS sends one", () => {
    const work = orderedWork([mission("a", { order: 3 }), mission("b", { order: 1 }), mission("c", { order: 2 })], visuals);
    expect(work.map((w) => w.mission.slug)).toEqual(["b", "c", "a"]);
  });

  it("first three are the large cards, the rest go to the swipe row", () => {
    const { large, rest } = selectWork(["a", "b", "c", "d", "e"].map((s) => mission(s)), visuals);
    expect(large.map((w) => w.mission.slug)).toEqual(["a", "b", "c"]);
    expect(rest.map((w) => w.mission.slug)).toEqual(["d", "e"]);
  });

  it("featured entries take the large slots, everything else stays in order", () => {
    const v = { ...visuals, b: vis("B", { featured: true }), d: vis("D", { featured: true }) };
    const { large, rest } = selectWork(["a", "b", "c", "d", "e"].map((s) => mission(s)), v);
    expect(large.map((w) => w.mission.slug)).toEqual(["b", "d"]);
    expect(rest.map((w) => w.mission.slug)).toEqual(["a", "c", "e"]);
  });

  it("maps the real slugs to the design's large cards", () => {
    const slugs = [
      "siz-commerce-gateway",
      "bank-llm-gateway",
      "voice-ordering-agent",
      "rag-enrollment-advisor",
      "vas-accounting-erp",
      "ipbms-patient-monitoring",
      "neuradao-ai-trading",
      "cicca-fleet-k3s",
    ];
    const { large, rest } = selectWork(slugs.map((s) => mission(s)));
    expect(large.map((w) => w.visual.short)).toEqual(["Siz", "Bank AI Gateway", "Bảo Bối"]);
    expect(rest.map((w) => w.visual.short)).toEqual(["Admissions chatbot", "Accounting SaaS", "IPBMS", "NEURADAO"]);
  });

  it("derives the status badge from the CMS status, with an override", () => {
    expect(workStatus({ status: "ACTIVE" })).toEqual({ label: "ACTIVE", color: "#6FA8FF" });
    expect(workStatus({ status: "COMPLETE" })).toEqual({ label: "DELIVERED", color: "#8C97B8" });
    expect(workStatus({ status: "COMPLETE" }, { statusLabel: "HANDED OVER" }).label).toBe("HANDED OVER");
  });
});

describe("home helpers", () => {
  it("splits the bio into paragraphs and bolds a short label lead-in", () => {
    const ps = bioParagraphs("I'm Dat. I build things.\n\nWhere I'm headed: a real studio.");
    expect(ps).toEqual([
      { label: null, text: "I'm Dat. I build things." },
      { label: "Where I'm headed:", text: "a real studio." },
    ]);
  });

  it("reduces an experience description to one line", () => {
    expect(experienceLine("Owned: architecture.\n- Built the gateway.")).toBe("Owned: architecture.");
    expect(experienceLine("- Only bullets here.\n- Second.")).toBe("Only bullets here.");
    expect(isCurrent("Aug 2026 – Present")).toBe(true);
    expect(isCurrent("Oct 2025")).toBe(false);
  });
});

describe("blog topics", () => {
  it("groups tags into topics", () => {
    expect(topicOf(["llm", "gateway"])).toBe("LLM");
    expect(topicOf(["K3s"])).toBe("Infra");
    expect(topicOf(["meta", "nextjs"])).toBe("Engineering");
  });
  it("formats dates and reading time", () => {
    expect(formatPostDate("2026-06-01T08:00:00Z")).toBe("Jun 1, 2026");
    expect(formatPostDate(null)).toBeNull();
    expect(readMinutes(1100)).toBe(5);
    expect(readMinutes(10)).toBe(1);
  });
});
