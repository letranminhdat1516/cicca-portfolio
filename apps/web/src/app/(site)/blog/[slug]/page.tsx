import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, isThin, wordCount } from "@/lib/blog";
import { formatPostDate, readMinutes, topicOf } from "@/lib/blogTopics";
import { extractHeadings } from "@/lib/toc";
import { MONO, Tag } from "@/components/site/ui";
import { Markdown } from "@/components/blog/Markdown";
import { TOC_MIN, Toc } from "@/components/blog/Toc";
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

  const profile = await getPortfolio()
    .then((d) => d.profile)
    .catch(() => undefined);
  const authorName = profile?.name;

  const date = formatPostDate(post.publishedAt);
  const words = wordCount(post.content);
  const read = words ? `${readMinutes(words)} min read` : null;
  const topic = topicOf(post.tags);
  const headings = extractHeadings(post.content);
  const hasToc = headings.length >= TOC_MIN;

  return (
    <main className="post">
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
      <div className={hasToc ? "post-grid has-toc" : "post-grid"}>
        <header className="post-head">
          <Link href="/blog" style={{ ...MONO, textDecoration: "none", fontSize: 13, color: "#8C97B8", padding: "10px 0", display: "inline-block" }}>
            ← All notes
          </Link>
          <div style={{ ...MONO, marginTop: 28, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 12, color: "#8C97B8" }}>
            <span style={{ color: "#6FA8FF" }}>{topic}</span>
            {date && post.publishedAt && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt}>{date}</time>
              </>
            )}
            {read && (
              <>
                <span aria-hidden="true">·</span>
                <span>{read}</span>
              </>
            )}
          </div>
          <h1
            style={{
              margin: "16px 0 0",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "#F2F5FF",
              textWrap: "balance",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ margin: "20px 0 0", fontSize: "clamp(19px, 2vw, 22px)", lineHeight: 1.45, color: "#C9D4F2", textWrap: "pretty" }}>{post.excerpt}</p>
          )}
          {authorName && (
            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
              {profile?.avatarUrl ? (
                // CMS avatar URL, so a plain <img> (no remotePatterns needed).
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" width={40} height={40} style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(111,168,255,0.35)" }} />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#2F6BFF",
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    boxShadow: "0 0 20px rgba(47,107,255,0.5)",
                  }}
                >
                  {authorName.trim().charAt(0).toUpperCase()}
                </span>
              )}
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                <span style={{ fontWeight: 600, color: "#E8EEFF" }}>{authorName}</span>
                {profile?.classRole && <span style={{ fontSize: 14, color: "#8C97B8" }}>{profile.classRole}</span>}
              </span>
            </div>
          )}
          {post.coverImage && (
            // CMS cover URL, so a plain <img> (no remotePatterns needed).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                marginTop: 36,
                borderRadius: 24,
                border: "1px solid rgba(111,168,255,0.25)",
              }}
            />
          )}
          <div className="beam" aria-hidden="true" style={{ margin: "36px 0 8px" }} />
        </header>

        <Toc headings={headings} />

        <div className="post-body">
          <article className="md md-article">
            <Markdown>{post.content}</Markdown>
          </article>
          {post.tags.length > 0 && (
            <ul aria-label="Tags" style={{ margin: "40px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {post.tags.map((t) => (
                <li key={t}>
                  <Tag size={13}>{t}</Tag>
                </li>
              ))}
            </ul>
          )}
          <Link href="/blog" style={{ ...MONO, marginTop: 40, textDecoration: "none", fontSize: 13, color: "#6FA8FF", padding: "10px 0", display: "inline-block" }}>
            ← All notes
          </Link>
        </div>
      </div>
    </main>
  );
}
