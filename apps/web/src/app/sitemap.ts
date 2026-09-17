import type { MetadataRoute } from "next";
import type { BlogPostSummary } from "@portfolio/types";
import { getFullPosts, isThin } from "@/lib/blog";
import { getPortfolio } from "@/lib/portfolio";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const latest = (dates: (string | null | undefined)[]): Date | undefined => {
  const times = dates.filter((d): d is string => Boolean(d)).map((d) => new Date(d).getTime());
  return times.length ? new Date(Math.max(...times)) : undefined;
};

// lastModified carries real edit times only. Stamping "now" on every request
// makes crawlers distrust the field and stop using it to schedule recrawls.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPosts, data] = await Promise.all([
    getFullPosts().catch(() => []),
    getPortfolio().catch(() => null),
  ]);
  // Stub posts and projects without a case study are noindex, so they stay out.
  const posts = allPosts.filter((p) => !isThin(p));
  const projects = (data?.missions ?? []).filter((m) => m.content?.trim());
  const contentUpdatedAt = data?.seo?.updatedAt;
  const postDate = (p: BlogPostSummary) => latest([p.updatedAt, p.publishedAt]);
  const content = latest([contentUpdatedAt]);

  return [
    { url: `${SITE_URL}/`, lastModified: content, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/cv`, lastModified: content, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latest(posts.flatMap((p) => [p.updatedAt, p.publishedAt])),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...projects.map((m) => ({
      url: `${SITE_URL}/projects/${m.slug}`,
      lastModified: content,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: postDate(p),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
