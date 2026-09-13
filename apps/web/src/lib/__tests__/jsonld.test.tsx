import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLd, PERSON_ID, cvJsonLd, homeJsonLd, personJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { portfolio } from "./fixture";

type Obj = Record<string, unknown>;

describe("JSON-LD", () => {
  const person = personJsonLd(portfolio) as Obj;

  it("describes the person with stable @id, location and education", () => {
    expect(person["@type"]).toBe("Person");
    expect(person["@id"]).toBe(PERSON_ID);
    expect(person.jobTitle).toBe("AI-Native Full-Stack Developer");
    expect(person.address).toMatchObject({ addressLocality: "Ho Chi Minh City", addressCountry: "VN" });
    expect(person.alumniOf).toEqual([{ "@type": "CollegeOrUniversity", name: "FPT University" }]);
    expect(person.award).toEqual(["Top 4 — Viettel AI Race"]);
    expect(person.knowsLanguage).toEqual(["Vietnamese", "English"]);
    expect(person.knowsAbout).toEqual(["Hybrid RAG"]);
    expect(person.alternateName).toContain("Lê Trần Minh Đạt");
  });

  it("only lists real external profiles in sameAs", () => {
    expect(person.sameAs).toEqual(["https://github.com/letranminhdat1516"]);
  });

  it("marks current roles as occupations using the lead line only", () => {
    expect(person.hasOccupation).toEqual([
      { "@type": "Occupation", name: "LLM Gateway Engineer", description: "Owned: architecture." },
    ]);
  });

  it("links home and CV pages to the person entity", () => {
    const home = homeJsonLd(portfolio) as Obj[];
    expect(home.map((n) => n["@type"])).toEqual(["Person", "WebSite", "ProfilePage"]);
    expect(home[2].mainEntity).toEqual({ "@id": PERSON_ID });

    const cv = cvJsonLd(portfolio) as Obj[];
    expect(cv[1]).toMatchObject({ "@type": "ProfilePage", url: `${SITE_URL}/cv` });
    expect(cv[2]["@type"]).toBe("BreadcrumbList");
  });

  it("escapes </script> so CMS content cannot break out of the tag", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    expect(html).not.toContain("</script><script>");
    const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    expect(JSON.parse(json).name).toBe("</script><script>alert(1)</script>");
  });
});
