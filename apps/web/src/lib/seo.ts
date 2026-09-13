import type { Metadata } from "next";
import type { Portfolio, SeoSettings } from "@portfolio/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const CV_PDF_PATH = "/cv/letranminhdat-cv.pdf";

const FALLBACK: SeoSettings = {
  siteName: "Le Tran Minh Dat",
  defaultTitle: "Le Tran Minh Dat — AI-Native Full-Stack Developer",
  defaultDescription:
    "AI-native full-stack developer in Ho Chi Minh City. Shipped 6 production systems: a bank LLM gateway, RAG agents, a VAS ERP and real-time computer vision.",
  keywords: [
    "Le Tran Minh Dat",
    "Lê Trần Minh Đạt",
    "AI-native full-stack developer",
    "LLM gateway engineer",
    "AI agent engineer",
    "RAG",
    "NestJS",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Kubernetes",
    "resume",
  ],
  ogImageUrl: null,
  twitterHandle: null,
  gscVerification: null,
  llmsTxt: null,
};

export function seoOf(p?: Portfolio | null): SeoSettings {
  return p?.seo ?? FALLBACK;
}

/** Turn a site-relative path into an absolute URL; absolute URLs pass through. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Absolute URL for an OG image — custom if set, else the dynamic /opengraph-image. */
export function ogImage(seo: SeoSettings): string {
  return absoluteUrl(seo.ogImageUrl || "/opengraph-image");
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
    authors: profile?.name ? [{ name: profile.name, url: SITE_URL }] : undefined,
    creator: profile?.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: seo.siteName,
      title,
      description,
      locale: "en_US",
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
