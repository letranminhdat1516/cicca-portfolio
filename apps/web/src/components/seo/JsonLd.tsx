import type { BlogPost, BlogPostSummary, Mission, Portfolio } from "@portfolio/types";
import { CV_PDF_PATH, NATIVE_NAME, SITE_URL, absoluteUrl, ogImage, projectPath, seoOf } from "@/lib/seo";
import { buildFaq } from "@/lib/faq";
import { wordCount } from "@/lib/blog";
import { IDENTITY } from "@/lib/identity";
import { PROJECT_VISUALS } from "@/data/projectVisuals";

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
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const STUDIO_ID = `${SITE_URL}/#zillexa`;
const BLOG_ID = `${SITE_URL}/blog#blog`;
const projectId = (slug: string) => `${SITE_URL}/#project-${slug}`;

// Parse "B.Eng. Software Engineering — FPT University" style achievement titles.
const EDUCATION_RE = /^(.+?)\s+—\s+(.*University.*)$/i;
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** A compact Person reference for author/publisher fields: same @id everywhere. */
export function personRef(name?: string | null): object {
  return { "@type": "Person", "@id": PERSON_ID, name: name || IDENTITY.name, url: SITE_URL };
}

const city = {
  "@type": "City",
  name: IDENTITY.locality,
  containedInPlace: { "@type": "Country", name: IDENTITY.country },
};

function university(name: string): object {
  const u = IDENTITY.university;
  return {
    "@type": "CollegeOrUniversity",
    name,
    ...(name === u.name ? { sameAs: u.sameAs, address: { "@type": "PostalAddress", addressLocality: u.locality, addressCountry: IDENTITY.countryCode } } : {}),
  };
}

/** The Person entity every page references by @id. */
export function personJsonLd(portfolio: Portfolio): object {
  const seo = seoOf(portfolio);
  const { profile, socials, skillGroups, achievements, experiences } = portfolio;
  const name = profile?.name || IDENTITY.name;
  const profiles = (socials ?? [])
    .map((s) => s.href)
    .filter((h): h is string => Boolean(h) && /^https?:\/\//.test(h));
  const sameAs = [...new Set([...profiles, ...IDENTITY.sameAs])];

  const groups = skillGroups ?? [];
  const spoken = groups.find((g) => /spoken|language/i.test(g.name));
  const skills = groups
    .filter((g) => g !== spoken)
    .flatMap((g) => g.items.map((i) => i.n));
  const languages = (spoken?.items ?? []).map((i) => i.n.replace(/\s*\(.*\)$/, ""));
  const knowsAbout = [...new Set([...IDENTITY.topics, ...skills])].slice(0, 40);

  const education = (achievements ?? [])
    .map((a) => a.title.match(EDUCATION_RE))
    .filter((m): m is RegExpMatchArray => Boolean(m));
  const awards = (achievements ?? [])
    .filter((a) => /award/i.test(a.year) || /top \d|prize|winner|champion|runner-up|finalist/i.test(a.title))
    .map((a) => oneLine(a.description ? `${a.title}: ${a.description.replace(/\.$/, "")}` : a.title));
  const current = (experiences ?? []).filter((e) => /present/i.test(e.period));
  const jobTitle = profile?.classRole || IDENTITY.jobTitle;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name,
    alternateName: [...new Set([IDENTITY.name, ...IDENTITY.alternateNames])].filter((n) => n !== name),
    givenName: IDENTITY.givenName,
    familyName: IDENTITY.familyName,
    additionalName: "Tran Minh",
    jobTitle,
    description: oneLine(`${name} (${NATIVE_NAME}) is ${/^[aeiou]/i.test(jobTitle) ? "an" : "a"} ${jobTitle} (${IDENTITY.focus}) based in ${IDENTITY.locality}, ${IDENTITY.country}. ${IDENTITY.summary}`),
    disambiguatingDescription: `${jobTitle} in ${IDENTITY.locality}; co-founder of ${IDENTITY.studio.name}; known online as ${IDENTITY.handle}.`,
    email: `mailto:${profile?.email || IDENTITY.email}`,
    url: SITE_URL,
    mainEntityOfPage: SITE_URL,
    image: profile?.avatarUrl ? absoluteUrl(profile.avatarUrl) : ogImage(seo),
    address: {
      "@type": "PostalAddress",
      addressLocality: IDENTITY.locality,
      addressCountry: IDENTITY.countryCode,
    },
    homeLocation: city,
    nationality: { "@type": "Country", name: IDENTITY.country },
    knowsLanguage: languages.length ? languages : ["Vietnamese", "English"],
    knowsAbout,
    alumniOf: education.map((m) => university(m[2])),
    hasCredential: education.map((m) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      educationalLevel: "Bachelor's degree",
      name: m[1],
      recognizedBy: university(m[2]),
    })),
    award: awards.length ? awards : undefined,
    hasOccupation: [
      {
        "@type": "Occupation",
        name: jobTitle,
        description: IDENTITY.focus,
        occupationLocation: city,
        skills: knowsAbout.join(", "),
      },
      ...current.map((e) => ({
        "@type": "Occupation",
        name: e.title,
        description: oneLine(`${e.org}. ${e.description.split("\n")[0]}`),
        occupationLocation: city,
      })),
    ],
    memberOf: { "@type": "Organization", "@id": STUDIO_ID, name: IDENTITY.studio.name },
    subjectOf: {
      "@type": "DigitalDocument",
      name: `${name} — CV`,
      encodingFormat: "application/pdf",
      url: absoluteUrl(CV_PDF_PATH),
    },
    sameAs,
  };
}

/** Zillexa, the studio the person co-founded. */
export function studioJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": STUDIO_ID,
    name: IDENTITY.studio.name,
    description: IDENTITY.studio.description,
    foundingDate: IDENTITY.studio.since,
    founder: { "@id": PERSON_ID },
    member: { "@id": PERSON_ID },
  };
}

/** Public repositories authored by the person. */
export function openSourceJsonLd(): object[] {
  return IDENTITY.openSource.map((r) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${r.url}#code`,
    name: r.name,
    description: r.description,
    codeRepository: r.url,
    url: r.url,
    ...("language" in r ? { programmingLanguage: r.language } : {}),
    author: { "@id": PERSON_ID },
  }));
}

export function websiteJsonLd(portfolio: Portfolio): object {
  const seo = seoOf(portfolio);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: seo.siteName,
    alternateName: [NATIVE_NAME, IDENTITY.handle, "letranminhdat.com"],
    url: SITE_URL,
    description: seo.defaultDescription,
    inLanguage: "en",
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

export function homeJsonLd(portfolio: Portfolio): object[] {
  const seo = seoOf(portfolio);

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
    about: { "@id": PERSON_ID },
  };

  const nodes: object[] = [personJsonLd(portfolio), websiteJsonLd(portfolio), profilePage];
  const projects = projectsJsonLd(portfolio);
  if (projects) nodes.push(projects);
  const faq = faqJsonLd(portfolio);
  if (faq) nodes.push(faq);
  nodes.push(studioJsonLd(), ...openSourceJsonLd());
  return nodes;
}

/** Absolute URLs of a project's real screenshots (/projects/<slug>/NN.jpg). */
export function projectImages(slug: string): string[] {
  return (PROJECT_VISUALS[slug]?.images ?? []).map((i) => absoluteUrl(i.src));
}

/** One project as a CreativeWork authored by the person. */
function projectWork(m: Mission): object {
  const images = projectImages(m.slug);
  const visual = PROJECT_VISUALS[m.slug];
  return {
    "@type": "CreativeWork",
    "@id": projectId(m.slug),
    name: m.title,
    description: oneLine(m.objective),
    abstract: visual?.tagline,
    about: m.loadout.map((t) => ({ "@type": "Thing", name: t })),
    keywords: m.loadout.join(", "),
    genre: visual?.domain,
    creativeWorkStatus: m.status === "ACTIVE" ? "In production" : "Completed",
    url: absoluteUrl(projectPath(m)),
    ...(images.length ? { image: images[0] } : {}),
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
  };
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
      item: projectWork(m),
    })),
  };
}

/** A project case-study page: the Article, the work it is about, the person and a breadcrumb. */
export function projectPageJsonLd(portfolio: Portfolio, m: Mission): object[] {
  const url = `${SITE_URL}/projects/${m.slug}`;
  const images = projectImages(m.slug);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: m.title,
      description: oneLine(m.objective),
      keywords: m.loadout.join(", "),
      articleSection: "Case study",
      inLanguage: "en",
      url,
      mainEntityOfPage: url,
      image: images.length ? images : absoluteUrl("/opengraph-image"),
      dateModified: seoOf(portfolio).updatedAt ?? undefined,
      wordCount: m.content?.trim() ? wordCount(m.content) : undefined,
      about: projectWork(m),
      author: personRef(portfolio.profile?.name),
      publisher: { "@id": PERSON_ID },
      isPartOf: { "@id": WEBSITE_ID },
    },
    personJsonLd(portfolio),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/#work" },
      { name: m.title, path: `/projects/${m.slug}` },
    ]),
  ];
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
      inLanguage: f.lang ?? "en",
      acceptedAnswer: { "@type": "Answer", text: f.a, inLanguage: f.lang ?? "en" },
    })),
  };
}

export function cvJsonLd(portfolio: Portfolio): object[] {
  return [
    personJsonLd(portfolio),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/cv#profilepage`,
      name: `${portfolio.profile?.name ?? ""} — CV`.trim(),
      url: `${SITE_URL}/cv`,
      inLanguage: "en",
      dateModified: seoOf(portfolio).updatedAt?.slice(0, 10),
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "CV", path: "/cv" },
    ]),
  ];
}

export function articleJsonLd(post: BlogPost, authorName?: string): object {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const author = personRef(authorName);
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
