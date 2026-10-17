import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, isThin, wordCount } from "@/lib/blog";
import { formatPostDate, readMinutes } from "@/lib/blogTopics";
import { MONO, Tag } from "@/components/site/ui";
import { getPortfolio } from "@/lib/portfolio";
import { SITE_URL, pageMetadata, seoOf } from "@/lib/seo";
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    const seo = seoOf(await getPortfolio().catch(() => null));
    return pageMetadata({
      seo,
      path: `/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      image: post.coverImage ?? `/blog/${slug}/og`,
      noindex: isThin(post),
      openGraph: {
        type: "article",
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt ?? undefined,
        authors: [SITE_URL],
        tags: post.tags,
      },
    });
  } catch {
    return { title: "Not found", robots: { index: false, follow: false } };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const authorName = await getPortfolio()
    .then((d) => d.profile?.name)
    .catch(() => undefined);

  const date = formatPostDate(post.publishedAt);
  const read = `${readMinutes(wordCount(post.content))} min`;

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 96px" }}>
      <JsonLd
        data={[
          articleJsonLd(post, authorName),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <Link href="/blog" style={{ ...MONO, textDecoration: "none", fontSize: 13, color: "#8C97B8", padding: "8px 0", display: "inline-block" }}>
        ← All posts
      </Link>
      <h1
        style={{
          margin: "20px 0 0",
          fontWeight: 800,
          fontSize: "clamp(36px, 5.5vw, 64px)",
          lineHeight: 1.02,
          letterSpacing: "-0.035em",
          color: "#F2F5FF",
        }}
      >
        {post.title}
      </h1>
      <div style={{ ...MONO, marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 12, color: "#8C97B8" }}>
        {date && post.publishedAt && <time dateTime={post.publishedAt}>{date}</time>}
        {date && <span aria-hidden="true">·</span>}
        <span>{read}</span>
        {post.tags.map((t) => (
          <Tag key={t} size={12}>
            {t}
          </Tag>
        ))}
      </div>
      <div className="beam" aria-hidden="true" style={{ margin: "32px 0 8px" }} />
      <article className="md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
