import type { BlogPost, BlogPostSummary, Portfolio } from "@portfolio/types";
import { CV_PDF_PATH, NATIVE_NAME, SITE_URL, absoluteUrl, ogImage, projectPath, seoOf } from "@/lib/seo";
import { buildFaq } from "@/lib/faq";
import { wordCount } from "@/lib/blog";

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
const BLOG_ID = `${SITE_URL}/blog#blog`;

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
    alternateName: [NATIVE_NAME, "Le Tran Minh Dat", "Dat Le"].filter(
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
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: seo.defaultTitle,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    // Real edit time from the CMS — a date that changes on every request
    // teaches crawlers to ignore it.
    dateModified: (seo.updatedAt ?? new Date().toISOString()).slice(0, 10),
    mainEntity: { "@id": PERSON_ID },
  };

  const nodes: object[] = [personJsonLd(portfolio), website, profilePage];
  const projects = projectsJsonLd(portfolio);
  if (projects) nodes.push(projects);
  const faq = faqJsonLd(portfolio);
  if (faq) nodes.push(faq);
  return nodes;
}

/** Portfolio projects as an ItemList of works authored by the person. */
export function projectsJsonLd(portfolio: Portfolio): object | null {
  const missions = portfolio.missions ?? [];
  if (!missions.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects`,
    name: `Projects by ${portfolio.profile?.name ?? seoOf(portfolio).siteName}`,
    numberOfItems: missions.length,
    itemListElement: missions.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        "@id": `${SITE_URL}/#project-${m.slug}`,
        name: m.title,
        description: m.objective.replace(/\s+/g, " ").trim(),
        keywords: m.loadout.join(", "),
        creativeWorkStatus: m.status === "ACTIVE" ? "In production" : "Completed",
        url: absoluteUrl(projectPath(m)),
        author: { "@id": PERSON_ID },
      },
    })),
  };
}

export function faqJsonLd(portfolio: Portfolio): object | null {
  const faqs = buildFaq(portfolio);
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    about: { "@id": PERSON_ID },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function cvJsonLd(portfolio: Portfolio): object[] {
  return [
    personJsonLd(portfolio),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: `${portfolio.profile?.name ?? ""} — Résumé`.trim(),
      url: `${SITE_URL}/cv`,
      inLanguage: "en",
      dateModified: seoOf(portfolio).updatedAt?.slice(0, 10),
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
  const url = `${SITE_URL}/blog/${post.slug}`;
  const author = { "@type": "Person", "@id": PERSON_ID, name: authorName ?? "Author", url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    keywords: post.tags?.join(", "),
    wordCount: post.content ? wordCount(post.content) : undefined,
    inLanguage: "en",
    image: absoluteUrl(post.coverImage ?? `/blog/${post.slug}/og`),
    url,
    author,
    publisher: author,
    isPartOf: { "@id": BLOG_ID },
    mainEntityOfPage: url,
  };
}

/** The blog index: a Blog entity listing its posts. */
export function blogJsonLd(posts: BlogPostSummary[], authorName?: string): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": BLOG_ID,
      name: `${authorName ?? "Engineering"} — Blog`,
      url: `${SITE_URL}/blog`,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": PERSON_ID },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.publishedAt ?? undefined,
        author: { "@id": PERSON_ID },
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ];
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
