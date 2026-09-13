import type { BlogPost, Portfolio } from "@portfolio/types";
import { CV_PDF_PATH, SITE_URL, absoluteUrl, ogImage, seoOf } from "@/lib/seo";

/**
 * Structured data (schema.org JSON-LD). This is the single highest-leverage signal
 * for BOTH Google rich results AND generative engines (ChatGPT/Perplexity/Gemini
 * parse JSON-LD to understand and cite a page), i.e. SEO + GEO.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  // Escape `<` so CMS content containing "</script>" cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Parse "B.Eng. Software Engineering — FPT University" style achievement titles.
const EDUCATION_RE = /^(.+?)\s+—\s+(.*University.*)$/i;

/** The Person entity every page references by @id. */
export function personJsonLd(portfolio: Portfolio): object {
  const seo = seoOf(portfolio);
  const { profile, socials, skillGroups, achievements, experiences } = portfolio;
  const sameAs = (socials ?? [])
    .map((s) => s.href)
    .filter((h): h is string => Boolean(h) && /^https?:\/\//.test(h));

  const groups = skillGroups ?? [];
  const spoken = groups.find((g) => /spoken|language/i.test(g.name));
  const skills = groups
    .filter((g) => g !== spoken)
    .flatMap((g) => g.items.map((i) => i.n));
  const languages = (spoken?.items ?? []).map((i) => i.n.replace(/\s*\(.*\)$/, ""));

  const education = (achievements ?? [])
    .map((a) => a.title.match(EDUCATION_RE))
    .filter((m): m is RegExpMatchArray => Boolean(m));
  const awards = (achievements ?? [])
    .filter((a) => /award/i.test(a.year) || /top \d|prize|winner|champion/i.test(a.title))
    .map((a) => a.title);
  const current = (experiences ?? []).filter((e) => /present/i.test(e.period));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile?.name,
    alternateName: ["Lê Trần Minh Đạt", "Le Tran Minh Dat", "Dat Le"].filter(
      (n) => n !== profile?.name,
    ),
    jobTitle: profile?.classRole,
    description: profile?.bio,
    email: profile?.email ? `mailto:${profile.email}` : undefined,
    url: SITE_URL,
    image: profile?.avatarUrl ? absoluteUrl(profile.avatarUrl) : ogImage(seo),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    knowsAbout: skills.slice(0, 30),
    knowsLanguage: languages.length ? languages : undefined,
    alumniOf: education.map((m) => ({
      "@type": "CollegeOrUniversity",
      name: m[2],
    })),
    hasCredential: education.map((m) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: m[1],
      recognizedBy: { "@type": "CollegeOrUniversity", name: m[2] },
    })),
    award: awards.length ? awards : undefined,
    hasOccupation: current.map((e) => ({
      "@type": "Occupation",
      name: e.title,
      description: e.description.split("\n")[0],
    })),
    subjectOf: {
      "@type": "DigitalDocument",
      name: `${profile?.name ?? "Résumé"} — Résumé`,
      encodingFormat: "application/pdf",
      url: absoluteUrl(CV_PDF_PATH),
    },
    sameAs,
  };
}

export function homeJsonLd(portfolio: Portfolio): object[] {
  const seo = seoOf(portfolio);

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: seo.siteName,
    url: SITE_URL,
    description: seo.defaultDescription,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE_URL,
    isPartOf: { "@id": WEBSITE_ID },
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: { "@id": PERSON_ID },
  };

  return [personJsonLd(portfolio), website, profilePage];
}

export function cvJsonLd(portfolio: Portfolio): object[] {
  return [
    personJsonLd(portfolio),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: `${portfolio.profile?.name ?? ""} — Résumé`.trim(),
      url: `${SITE_URL}/cv`,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Résumé", path: "/cv" },
    ]),
  ];
}

export function articleJsonLd(post: BlogPost, authorName?: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    keywords: post.tags?.join(", "),
    image: post.coverImage ?? `${SITE_URL}/opengraph-image`,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", "@id": PERSON_ID, name: authorName ?? "Author" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
