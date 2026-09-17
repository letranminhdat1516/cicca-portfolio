import type { Metadata } from "next";
import type { Portfolio, SeoSettings } from "@portfolio/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const CV_PDF_PATH = "/cv/letranminhdat-cv.pdf";

/** The owner's name with Vietnamese diacritics — how local searchers type it. */
export const NATIVE_NAME = "Lê Trần Minh Đạt";

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

/**
 * Machine-readable alternates advertised in <head>. A page's `alternates`
 * replaces the root layout's, so every canonical is built through here.
 */
export function alternatesFor(path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: path,
    types: {
      "text/plain": [{ url: "/llms.txt", title: "LLM-readable profile" }],
      "application/rss+xml": [{ url: "/feed.xml", title: "Le Tran Minh Dat — Blog" }],
    },
  };
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
    alternates: alternatesFor("/"),
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

/**
 * Metadata for an inner page. Next replaces (not merges) a parent's `openGraph`
 * and `twitter` objects, so every page must restate site name, locale and the
 * share image or it ships without an og:image.
 */
export function pageMetadata(opts: {
  seo: SeoSettings;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  image?: string | null;
  keywords?: string[];
  noindex?: boolean;
  openGraph?: NonNullable<Metadata["openGraph"]>;
}): Metadata {
  const { seo, path, title, description } = opts;
  const image = opts.image ? absoluteUrl(opts.image) : ogImage(seo);
  return {
    title: opts.absoluteTitle ? { absolute: title } : title,
    description,
    keywords: opts.keywords,
    // Spread, not `robots: undefined` — an explicit key would wipe the root default.
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: alternatesFor(path),
    openGraph: {
      type: "website",
      ...opts.openGraph,
      url: path,
      siteName: seo.siteName,
      locale: "en_US",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: seo.twitterHandle ?? undefined,
    },
  };
}

/** A project has a page of its own once a case study has been written for it. */
export function projectPath(m: { slug: string; content?: string | null }): string {
  return m.content?.trim() ? `/projects/${m.slug}` : `/#${m.slug}`;
}
