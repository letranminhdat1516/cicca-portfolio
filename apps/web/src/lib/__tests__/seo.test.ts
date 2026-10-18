import { describe, expect, it } from "vitest";
import { SITE_URL, absoluteUrl, buildHomeMetadata, ogImage, seoOf } from "@/lib/seo";
import { portfolio } from "./fixture";

describe("seo helpers", () => {
  it("builds absolute URLs without doubling slashes", () => {
    expect(absoluteUrl("/cv")).toBe(`${SITE_URL}/cv`);
    expect(absoluteUrl("cv")).toBe(`${SITE_URL}/cv`);
    expect(absoluteUrl("https://x.dev/a")).toBe("https://x.dev/a");
  });

  it("falls back to branded defaults when the CMS has no SEO row", () => {
    const seo = seoOf(null);
    expect(seo.defaultTitle).toBe("Le Tran Minh Dat (Lê Trần Minh Đạt) — AI-Native Software Engineer");
    expect(seo.defaultDescription.length).toBeLessThanOrEqual(160);
    expect(seo.defaultTitle.length).toBeLessThanOrEqual(65);
  });

  it("uses the dynamic OG image unless a custom one is set", () => {
    expect(ogImage(seoOf(portfolio))).toBe(`${SITE_URL}/opengraph-image`);
    expect(ogImage({ ...seoOf(portfolio), ogImageUrl: "/og.png" })).toBe(`${SITE_URL}/og.png`);
  });

  it("home metadata has canonical, OG, twitter and GSC verification", () => {
    const m = buildHomeMetadata(portfolio);
    expect(m.title).toEqual({ absolute: portfolio.seo!.defaultTitle });
    expect(m.alternates?.canonical).toBe("/");
    expect(m.alternates?.types).toHaveProperty("application/rss+xml");
    expect(m.openGraph).toMatchObject({
      url: SITE_URL,
      siteName: "Le Tran Minh Dat",
      locale: "en_US",
      alternateLocale: ["vi_VN"],
      firstName: "Dat",
      lastName: "Le",
      username: "cicca",
    });
    const [img] = m.openGraph!.images as { alt: string }[];
    expect(img.alt).toContain("Lê Trần Minh Đạt");
    expect(m.authors).toEqual([{ name: "Le Tran Minh Dat", url: SITE_URL }]);
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
    expect(m.verification).toEqual({ google: "gsc-token" });
  });
});
