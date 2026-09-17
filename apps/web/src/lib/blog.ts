import type { BlogPost, BlogPostSummary } from "@portfolio/types";
import { apiGet } from "./api";

export function getPosts(): Promise<BlogPostSummary[]> {
  return apiGet<BlogPostSummary[]>("/blog", { next: { revalidate: 60 } });
}

export function getPost(slug: string): Promise<BlogPost> {
  return apiGet<BlogPost>(`/blog/${slug}`, { next: { revalidate: 60 } });
}

/** Every published post with its body (the list endpoint returns summaries only). */
export async function getFullPosts(): Promise<BlogPost[]> {
  const summaries = await getPosts();
  const posts = await Promise.all(summaries.map((p) => getPost(p.slug).catch(() => null)));
  return posts.filter((p): p is BlogPost => p !== null);
}

// Below this a post is a stub: it stays readable and linked, but is kept out of
// search indexes and the sitemap so it cannot drag the site's quality signal down.
const THIN_WORDS = 200;

export const wordCount = (markdown: string) => markdown.trim().split(/\s+/).filter(Boolean).length;
export const isThin = (post: Pick<BlogPost, "content">) => wordCount(post.content) < THIN_WORDS;
