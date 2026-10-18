import type { Metadata } from "next";
import type { Portfolio, SeoSettings } from "@portfolio/types";
import { BOTH_NAMES, IDENTITY } from "./identity";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const CV_PDF_PATH = "/cv/letranminhdat-cv.pdf";

/** The owner's name with Vietnamese diacritics — how local searchers type it. */
export const NATIVE_NAME = IDENTITY.nativeName;

/** Open Graph locales: the site is English, the name is Vietnamese. */
const OG_LOCALE = { locale: "en_US", alternateLocale: ["vi_VN"] };

const FALLBACK: SeoSettings = {
  siteName: "Le Tran Minh Dat",
  defaultTitle: `${BOTH_NAMES} — AI-Native Software Engineer`,
  defaultDescription:
    "AI-native software engineer in Ho Chi Minh City. I build AI agents and the backend they run on: an enterprise bank AI gateway, MCP commerce and voice agents.",
  keywords: [
    "Le Tran Minh Dat",
    "Lê Trần Minh Đạt",
    "cicca",
    "AI-native software engineer",
    "AI agent developer",
    "LLM gateway",
    "MCP server",
    "RAG",
    "LiveKit voice agent",
    "Zillexa",
    "Ho Chi Minh City",
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
  const imageAlt = `${BOTH_NAMES} — ${profile?.classRole || IDENTITY.jobTitle}`;

  return {
    // `absolute` so the root title template ("%s — <brand>") isn't appended —
    // defaultTitle already contains the brand, which would double it otherwise.
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    authors: [{ name: profile?.name || IDENTITY.name, url: SITE_URL }],
    creator: profile?.name || IDENTITY.name,
    alternates: alternatesFor("/"),
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: seo.siteName,
      title,
      description,
      ...OG_LOCALE,
      // og:profile tags name the person behind the page for link previews.
      firstName: IDENTITY.givenName,
      lastName: IDENTITY.familyName,
      username: IDENTITY.handle,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
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
      ...OG_LOCALE,
      title,
      description,
      // Dimensions are only known for the generated 1200×630 card.
      images: [{ url: image, ...(opts.image ? {} : { width: 1200, height: 630 }), alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: title }],
      creator: seo.twitterHandle ?? undefined,
    },
  };
}

/** A project has a page of its own once a case study has been written for it. */
export function projectPath(m: { slug: string; content?: string | null }): string {
  return m.content?.trim() ? `/projects/${m.slug}` : `/#${m.slug}`;
}
