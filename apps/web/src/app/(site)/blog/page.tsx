import type { Metadata } from "next";
import { getFullPosts, getPosts, wordCount } from "@/lib/blog";
import { getPortfolio } from "@/lib/portfolio";
import { pageMetadata, seoOf } from "@/lib/seo";
import { TOPICS, formatPostDate, readMinutes, topicOf } from "@/lib/blogTopics";
import { JsonLd, blogJsonLd } from "@/components/seo/JsonLd";
import { BlogIndex, type PostCard } from "@/components/blog/BlogIndex";
import { ACCENT } from "@/data/home";
import { Highlight, MONO } from "@/components/site/ui";

export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Engineering notes by Le Tran Minh Dat on LLM gateways, RAG agents and full-stack delivery.";
const INTRO = "Field notes on shipping LLM systems, running my own cluster, and what broke along the way.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = seoOf(await getPortfolio().catch(() => null));
  return pageMetadata({ seo, path: "/blog", title: "Blog", description: DESCRIPTION });
}

export default async function BlogPage() {
  const [posts, full, authorName] = await Promise.all([
    getPosts(),
    // Bodies only feed the reading time; a failure just hides it.
    getFullPosts().catch(() => []),
    getPortfolio()
      .then((d) => d.profile?.name)
      .catch(() => undefined),
  ]);
  const words = new Map(full.map((p) => [p.slug, wordCount(p.content)]));
  const cards: PostCard[] = posts.map((p) => {
    const w = words.get(p.slug);
    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags,
      topic: topicOf(p.tags),
      date: formatPostDate(p.publishedAt),
      isoDate: p.publishedAt,
      read: w ? `${readMinutes(w)} min` : null,
      coverImage: p.coverImage,
    };
  });
  const topics = TOPICS.filter((t) => cards.some((c) => c.topic === t));

  return (
    <main>
      <JsonLd data={blogJsonLd(posts, authorName)} />
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px 24px 40px",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px 64px",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ ...MONO, fontSize: 12, letterSpacing: "0.08em", color: "#6FA8FF" }}>BLOG</span>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98, letterSpacing: "-0.04em" }}>
            Notes from <Highlight big>the desk</Highlight>
          </h1>
          <p style={{ margin: 0, maxWidth: 600, fontSize: 19, color: "#C9D4F2" }}>{INTRO}</p>
        </div>
        <a
          href="/feed.xml"
          style={{
            flex: "0 0 auto",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1.5px solid #E8EEFF",
            padding: "12px 20px",
            borderRadius: 999,
            fontWeight: 500,
          }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1.2" fill={ACCENT} />
          </svg>
          Subscribe via RSS
        </a>
      </section>
      <BlogIndex posts={cards} topics={topics} />
    </main>
  );
}
