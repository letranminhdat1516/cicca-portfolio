import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { BlogPost } from "@portfolio/types";
import {
  JsonLd,
  PERSON_ID,
  STUDIO_ID,
  articleJsonLd,
  blogJsonLd,
  cvJsonLd,
  homeJsonLd,
  personJsonLd,
  projectPageJsonLd,
} from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { portfolio } from "./fixture";

type Obj = Record<string, unknown>;

/** Every `@id` reference to the person anywhere in a JSON-LD tree. */
function personRefs(node: unknown, out: Obj[] = []): Obj[] {
  if (Array.isArray(node)) node.forEach((n) => personRefs(n, out));
  else if (node && typeof node === "object") {
    const o = node as Obj;
    if (o["@id"] === PERSON_ID) out.push(o);
    Object.values(o).forEach((v) => personRefs(v, out));
  }
  return out;
}

const post: BlogPost = {
  id: "1",
  slug: "hello",
  title: "Hello",
  excerpt: "Intro",
  tags: [],
  coverImage: null,
  publishedAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
  createdAt: "2026-06-01T00:00:00.000Z",
  published: true,
  content: "Text.",
};

describe("JSON-LD", () => {
  const person = personJsonLd(portfolio) as Obj;

  it("describes the person with stable @id, location and education", () => {
    expect(person["@type"]).toBe("Person");
    expect(person["@id"]).toBe(PERSON_ID);
    expect(person).toMatchObject({ givenName: "Dat", familyName: "Le", email: "mailto:datltmse@gmail.com", url: SITE_URL });
    expect(person.jobTitle).toBe("AI-Native Full-Stack Developer");
    expect(person.address).toMatchObject({ addressLocality: "Ho Chi Minh City", addressCountry: "VN" });
    expect(person.nationality).toEqual({ "@type": "Country", name: "Vietnam" });
    expect(person.alumniOf).toEqual([
      expect.objectContaining({ "@type": "CollegeOrUniversity", name: "FPT University", sameAs: "https://en.wikipedia.org/wiki/FPT_University" }),
    ]);
    expect(person.hasCredential).toEqual([
      expect.objectContaining({ "@type": "EducationalOccupationalCredential", name: "B.Eng. Software Engineering" }),
    ]);
    expect(person.award).toEqual(["Top 4 — Viettel AI Race: Hackathon"]);
    expect(person.knowsLanguage).toEqual(["Vietnamese", "English"]);
    expect(person.knowsAbout).toEqual(expect.arrayContaining(["Model Context Protocol (MCP)", "LiteLLM", "Hybrid RAG"]));
    expect(person.image).toBe(`${SITE_URL}/cicca-03.png`);
  });

  it("lists every name variant once, including the Vietnamese spelling and the handle", () => {
    const names = person.alternateName as string[];
    for (const n of ["Lê Trần Minh Đạt", "cicca", "Minh Dat", "Dat Le"]) expect(names).toContain(n);
    expect(names).not.toContain(person.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("links real external profiles in sameAs (GitHub + LinkedIn, no placeholders)", () => {
    expect(person.sameAs).toEqual(["https://github.com/letranminhdat1516", "https://www.linkedin.com/in/dat-le-139a85284"]);
  });

  it("states the main occupation and current roles with a location", () => {
    const occ = person.hasOccupation as Obj[];
    expect(occ[0]).toMatchObject({ "@type": "Occupation", name: "AI-Native Full-Stack Developer" });
    expect(occ[0].skills).toEqual(expect.stringContaining("LiteLLM"));
    expect(occ[1]).toMatchObject({ name: "LLM Gateway Engineer", description: "Enterprise client (Banking). Owned: architecture." });
    expect(occ.every((o) => (o.occupationLocation as Obj).name === "Ho Chi Minh City")).toBe(true);
    expect(person.memberOf).toMatchObject({ "@id": STUDIO_ID, name: "Zillexa" });
  });

  it("links home and CV pages to the person entity", () => {
    const home = homeJsonLd(portfolio) as Obj[];
    expect(home.map((n) => n["@type"]).slice(0, 3)).toEqual(["Person", "WebSite", "ProfilePage"]);
    expect(home[1]).toMatchObject({ publisher: { "@id": PERSON_ID }, inLanguage: "en" });
    expect(home[1].alternateName).toContain("Lê Trần Minh Đạt");
    expect(home[2].mainEntity).toEqual({ "@id": PERSON_ID });
    const studio = home.find((n) => n["@id"] === STUDIO_ID)!;
    expect(studio).toMatchObject({ "@type": "Organization", founder: { "@id": PERSON_ID } });
    expect(home.filter((n) => n["@type"] === "SoftwareSourceCode").map((n) => n.codeRepository)).toEqual([
      "https://github.com/letranminhdat1516/hotwatch",
      "https://github.com/letranminhdat1516/esp32-translator",
    ]);

    const cv = cvJsonLd(portfolio) as Obj[];
    expect(cv[1]).toMatchObject({ "@type": "ProfilePage", url: `${SITE_URL}/cv`, mainEntity: { "@id": PERSON_ID } });
    expect(cv[2]["@type"]).toBe("BreadcrumbList");
  });

  it("reuses one person @id on every page and never emits a second Person identity", () => {
    const mission = { ...portfolio.missions[0], content: "## The problem\n\nText." };
    const pages = [
      homeJsonLd(portfolio),
      cvJsonLd(portfolio),
      projectPageJsonLd(portfolio, mission),
      [articleJsonLd(post, "Le Tran Minh Dat")],
      blogJsonLd([post], "Le Tran Minh Dat"),
    ];
    for (const page of pages) {
      expect(personRefs(page).length).toBeGreaterThan(0);
      const persons = JSON.stringify(page).match(/"@type":"Person"/g) ?? [];
      const ids = JSON.stringify(page).match(new RegExp(`"@type":"Person","@id":"${PERSON_ID}"`, "g")) ?? [];
      expect(persons.length).toBe(ids.length);
    }
  });

  it("gives a project page an Article with real screenshots, authored by the person", () => {
    const mission = { ...portfolio.missions[0], content: "## The problem\n\nText." };
    const [articleNode, personNode] = projectPageJsonLd(portfolio, mission) as Obj[];
    expect(articleNode).toMatchObject({ "@type": "Article", url: `${SITE_URL}/projects/bank-llm-gateway`, author: { "@id": PERSON_ID } });
    expect(articleNode.image).toEqual(expect.arrayContaining([`${SITE_URL}/projects/bank-llm-gateway/01.jpg`]));
    expect(articleNode.about).toMatchObject({ "@type": "CreativeWork", url: `${SITE_URL}/projects/bank-llm-gateway` });
    expect(personNode["@id"]).toBe(PERSON_ID);
  });

  it("is well-formed JSON and free of forbidden wording", () => {
    const all = JSON.stringify([homeJsonLd(portfolio), cvJsonLd(portfolio)]);
    expect(() => JSON.parse(all)).not.toThrow();
    for (const banned of [/Ăng/i, /\.NET/, /lines of code/i, /34 orders/, /202 leads/]) expect(all).not.toMatch(banned);
  });

  it("escapes </script> so CMS content cannot break out of the tag", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    expect(html).not.toContain("</script><script>");
    const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(json).name).toBe("</script><script>alert(1)</script>");
  });
});
