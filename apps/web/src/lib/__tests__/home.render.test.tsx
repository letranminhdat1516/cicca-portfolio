import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { SelectedWork } from "@/components/site/SelectedWork";
import { Desk } from "@/components/site/Desk";
import { Experience } from "@/components/site/Experience";
import { Recognition } from "@/components/site/Recognition";
import { Gallery } from "@/components/site/Gallery";
import { ContactCta } from "@/components/site/ContactCta";
import { DomainsMarquee } from "@/components/site/DomainsMarquee";
import { portfolio } from "./fixture";

// Smoke test: every home section renders from CMS-shaped data without a browser.
describe("home sections", () => {
  it("render CMS content into the new design", () => {
    const p = { ...portfolio.profile, classRole: "AI-Native Software Engineer", bio: "I'm Dat.\n\nWhere I'm headed: a studio." };
    const missions = [
      { ...portfolio.missions[0] },
      { ...portfolio.missions[0], slug: "siz-commerce-gateway", title: "Siz" },
      { ...portfolio.missions[0], slug: "neuradao-ai-trading", title: "NEURADAO", status: "COMPLETE" as const },
    ];
    const html = renderToStaticMarkup(
      <main>
        <Hero profile={p} />
        <About profile={p} />
        <DomainsMarquee />
        <SelectedWork missions={missions} />
        <Desk />
        <Experience experiences={portfolio.experiences} />
        <Recognition achievements={portfolio.achievements} />
        <Gallery />
        <ContactCta profile={p} socials={portfolio.socials} />
      </main>,
    );
    expect(html).toContain("AI-Native</span><br/>Software Engineer");
    expect(html).toContain("Le Tran Minh Dat");
    expect(html).toContain("<strong");
    expect(html).toContain('href="/projects/siz-commerce-gateway"');
    expect(html).toContain('href="/projects/bank-llm-gateway"');
    expect(html).toContain("DELIVERED");
    expect(html).toContain("LLM Gateway Engineer");
    expect(html).toContain(">NOW<");
    expect(html).toContain("Top 4 — Viettel AI Race");
    expect(html).toContain("mailto:datltmse@gmail.com");
    expect(html).toContain("github.com/letranminhdat1516");
    expect(html).toContain('aria-expanded="true"');
  });

  it("falls back to the design role when the CMS has none", () => {
    const html = renderToStaticMarkup(<Hero profile={{ ...portfolio.profile, classRole: "" }} />);
    expect(html).toContain("AI-Native</span><br/>Software Engineer");
  });
});
