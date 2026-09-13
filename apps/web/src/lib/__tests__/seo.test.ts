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
    expect(seo.defaultTitle).toContain("Le Tran Minh Dat");
    expect(seo.defaultDescription.length).toBeLessThanOrEqual(160);
    expect(seo.defaultTitle.length).toBeLessThanOrEqual(60);
  });

  it("uses the dynamic OG image unless a custom one is set", () => {
    expect(ogImage(seoOf(portfolio))).toBe(`${SITE_URL}/opengraph-image`);
    expect(ogImage({ ...seoOf(portfolio), ogImageUrl: "/og.png" })).toBe(`${SITE_URL}/og.png`);
  });

  it("home metadata has canonical, OG, twitter and GSC verification", () => {
    const m = buildHomeMetadata(portfolio);
    expect(m.title).toEqual({ absolute: portfolio.seo!.defaultTitle });
    expect(m.alternates?.canonical).toBe("/");
    expect(m.openGraph).toMatchObject({ url: SITE_URL, siteName: "Le Tran Minh Dat" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
    expect(m.verification).toEqual({ google: "gsc-token" });
  });
});
