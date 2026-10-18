"use client";
import { useState } from "react";
import Link from "next/link";
import { ACCENT } from "@/data/home";
import type { Topic } from "@/lib/blogTopics";
import { MONO } from "@/components/site/ui";

export interface PostCard {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  topic: Topic;
  date: string | null;
  isoDate: string | null;
  /** "6 min read", or null when the body could not be read. */
  read: string | null;
  coverImage: string | null;
}

/** Filter chips with real post counts: "All 3", "LLM 2", … Only topics that have posts. */
export function topicCounts(posts: Pick<PostCard, "topic">[], topics: readonly Topic[]): { topic: "All" | Topic; count: number }[] {
  const counts = topics
    .map((t) => ({ topic: t as "All" | Topic, count: posts.filter((p) => p.topic === t).length }))
    .filter((c) => c.count > 0);
  return [{ topic: "All", count: posts.length }, ...counts];
}

function Cover({ post }: { post: PostCard }) {
  return post.coverImage ? (
    // Covers are arbitrary CMS URLs, so a plain <img> (no remotePatterns needed).
    // eslint-disable-next-line @next/next/no-img-element
    <img src={post.coverImage} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 300 }} />
  ) : (
    <div
      className="ph"
      aria-hidden="true"
      style={{ ...MONO, height: "100%", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#8C97B8" }}
    >
      {post.tags[0] ? `#${post.tags[0]}` : "notes"}
    </div>
  );
}

/** topic · date · N min read — each part only when known. */
function Meta({ post, latest }: { post: PostCard; latest?: boolean }) {
  const parts = [
    <span key="t" style={{ color: "#6FA8FF" }}>
      {post.topic}
    </span>,
    post.date && (
      <time key="d" dateTime={post.isoDate ?? undefined}>
        {post.date}
      </time>
    ),
    post.read && <span key="r">{post.read}</span>,
  ].filter(Boolean);
  return (
    <div style={{ ...MONO, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 12, color: "#8C97B8" }}>
      {latest && <span style={{ background: ACCENT, color: "#FFFFFF", padding: "4px 10px", borderRadius: 999, marginRight: 4 }}>LATEST</span>}
      {parts.flatMap((p, i) => (i ? [<span key={`s${i}`} aria-hidden="true">·</span>, p] : [p]))}
    </div>
  );
}

/** Topic filter + featured post + list. Every post is in the server HTML on first paint. */
export function BlogIndex({ posts, topics }: { posts: PostCard[]; topics: readonly Topic[] }) {
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const list = topic === "All" ? posts : posts.filter((p) => p.topic === topic);
  const featured = topic === "All" ? posts[0] : undefined;
  const rest = featured ? list.slice(1) : list;
  const chips = topicCounts(posts, topics);

  return (
    <>
      {chips.length > 2 && (
        <section aria-label="Filter by topic" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {chips.map(({ topic: t, count }) => {
              const on = t === topic;
              return (
                <button
                  key={t}
                  type="button"
                  className="btn-reset topic-chip"
                  aria-pressed={on}
                  onClick={() => setTopic(t)}
                  style={{
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 18px",
                    borderRadius: 999,
                    fontSize: 15,
                    background: on ? ACCENT : "rgba(10,16,52,0.7)",
                    color: "#FFFFFF",
                    border: on ? `1px solid ${ACCENT}` : "1px solid rgba(111,168,255,0.35)",
                    boxShadow: on ? "0 0 24px rgba(47,107,255,0.45)" : undefined,
                  }}
                >
                  {t}
                  <span style={{ ...MONO, fontSize: 12, color: on ? "#DCE4FF" : "#8C97B8" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {featured && (
        <section aria-label="Latest post" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 56px" }}>
          <Link
            href={`/blog/${featured.slug}`}
            className="card"
            style={{
              textDecoration: "none",
              color: "#E8EEFF",
              background: "rgba(10,16,52,0.7)",
              border: "1px solid rgba(111,168,255,0.25)",
              borderRadius: 32,
              overflow: "hidden",
              display: "flex",
              flexWrap: "wrap",
              boxShadow: "0 30px 60px -40px rgba(47,123,255,0.45)",
            }}
          >
            <div style={{ flex: "7 1 420px", minHeight: 300 }}>
              <Cover post={featured} />
            </div>
            <div
              style={{
                flex: "5 1 360px",
                minWidth: 0,
                padding: "clamp(28px, 4vw, 48px)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <Meta post={featured} latest />
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.03em", textWrap: "balance" }}>
                {featured.title}
              </h2>
              <p style={{ margin: 0, fontSize: 17, color: "#C9D4F2" }}>{featured.excerpt}</p>
              <span style={{ fontWeight: 600, color: "#6FA8FF" }}>Read the note →</span>
            </div>
          </Link>
        </section>
      )}

      <section aria-label={topic === "All" ? "More posts" : `${topic} posts`} style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {rest.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: "none", borderTop: "1px solid rgba(111,168,255,0.2)" }}>
            {rest.map((p) => (
              <li key={p.slug} style={{ borderBottom: "1px solid rgba(111,168,255,0.2)" }}>
                <Link href={`/blog/${p.slug}`} className="post-row">
                  <Meta post={p} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(22px, 2.4vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em", textWrap: "balance" }}>
                      {p.title}
                    </h3>
                    {p.excerpt && <p style={{ margin: 0, fontSize: 16, color: "#C9D4F2", maxWidth: "68ch" }}>{p.excerpt}</p>}
                  </div>
                  <span aria-hidden="true" className="post-row-ar">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {list.length === 0 && (
          <p style={{ margin: 0, padding: "48px 0", textAlign: "center", color: "#8C97B8" }}>
            {posts.length ? "Nothing under this topic yet." : "No posts yet. Check back soon."}
          </p>
        )}
      </section>
    </>
  );
}
