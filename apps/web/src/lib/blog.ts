import type { BlogPost, BlogPostSummary } from "@portfolio/types";
import { apiGet } from "./api";

export function getPosts(): Promise<BlogPostSummary[]> {
  return apiGet<BlogPostSummary[]>("/blog", { next: { revalidate: 60 } });
}

export function getPost(slug: string): Promise<BlogPost> {
  return apiGet<BlogPost>(`/blog/${slug}`, { next: { revalidate: 60 } });
}
