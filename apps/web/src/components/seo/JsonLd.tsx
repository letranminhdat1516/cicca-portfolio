import type { BlogPost, Portfolio } from "@portfolio/types";
import { SITE_URL, ogImage, seoOf } from "@/lib/seo";

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

export function homeJsonLd(portfolio: Portfolio): object[] {
  const seo = seoOf(portfolio);
  const { profile, socials, skillGroups } = portfolio;
  const sameAs = [...(socials ?? []).map((s) => s.href)].filter(
    (v): v is string => Boolean(v) && v !== "#",
  );
  const skills = (skillGroups ?? []).flatMap((g) => g.items.map((i) => i.n));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name,
    jobTitle: profile?.classRole,
    description: profile?.bio,
    email: profile?.email ? `mailto:${profile.email}` : undefined,
    url: SITE_URL,
    image: ogImage(seo),
    knowsAbout: skills.slice(0, 25),
    sameAs,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.siteName,
    url: SITE_URL,
    description: seo.defaultDescription,
    inLanguage: "en",
    author: { "@type": "Person", name: profile?.name },
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: { "@type": "Person", name: profile?.name },
  };

  return [person, website, profilePage];
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
    author: { "@type": "Person", name: authorName ?? "Author" },
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
