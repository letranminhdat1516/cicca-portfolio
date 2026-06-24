import type { Metadata } from "next";
import type { Portfolio, SeoSettings } from "@portfolio/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const FALLBACK: SeoSettings = {
  siteName: "Lê Trần Minh Đạt",
  defaultTitle: "Lê Trần Minh Đạt — Creative Developer & AI Engineer",
  defaultDescription:
    "Creative full-stack & AI developer. I build production AI agents (Claude Agent SDK, RAG/pgvector), real-time systems, and full-stack web apps — from trading platforms to ERP.",
  keywords: [
    "Lê Trần Minh Đạt",
    "creative developer",
    "full-stack developer",
    "AI engineer",
    "AI agents",
    "Claude Agent SDK",
    "RAG",
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "PostgreSQL",
    "portfolio",
  ],
  ogImageUrl: null,
  twitterHandle: null,
  gscVerification: null,
  llmsTxt: null,
};

export function seoOf(p?: Portfolio | null): SeoSettings {
  return p?.seo ?? FALLBACK;
}

/** Absolute URL for an OG image — custom if set, else the dynamic /opengraph-image. */
export function ogImage(seo: SeoSettings): string {
  if (seo.ogImageUrl) {
    return seo.ogImageUrl.startsWith("http")
      ? seo.ogImageUrl
      : `${SITE_URL}${seo.ogImageUrl}`;
  }
  return `${SITE_URL}/opengraph-image`;
}

/** Full <head> metadata for the home page, sourced from CMS SeoSettings + profile. */
export function buildHomeMetadata(portfolio: Portfolio): Metadata {
  const seo = seoOf(portfolio);
  const { profile } = portfolio;
  const title = seo.defaultTitle;
  const description = seo.defaultDescription;
  const image = ogImage(seo);

  return {
    // `absolute` so the root title template ("%s — <brand>") isn't appended —
    // defaultTitle already contains the brand, which would double it otherwise.
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    authors: profile?.name ? [{ name: profile.name }] : undefined,
    creator: profile?.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: seo.siteName,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: seo.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: seo.twitterHandle ?? undefined,
    },
    verification: seo.gscVerification
      ? { google: seo.gscVerification }
      : undefined,
  };
}
