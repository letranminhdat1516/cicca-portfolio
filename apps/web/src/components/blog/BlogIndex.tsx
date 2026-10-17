"use client";
import { useState } from "react";
import Link from "next/link";
import { ACCENT } from "@/data/home";
import type { Topic } from "@/lib/blogTopics";
import { MONO, Tag } from "@/components/site/ui";

export interface PostCard {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  topic: Topic;
  date: string | null;
  isoDate: string | null;
  read: string | null;
  coverImage: string | null;
}

function Cover({ post, minHeight }: { post: PostCard; minHeight?: number }) {
  return post.coverImage ? (
    // Covers are arbitrary CMS URLs, so a plain <img> (no remotePatterns needed).
    // eslint-disable-next-line @next/next/no-img-element
    <img src={post.coverImage} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight }} />
  ) : (
    <div
      className="ph"
      aria-hidden="true"
      style={{ ...MONO, height: "100%", minHeight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#8C97B8" }}
    >
      {post.tags[0] ? `#${post.tags[0]}` : "notes"}
    </div>
  );
}

function Meta({ post, latest }: { post: PostCard; latest?: boolean }) {
  return (
    <div style={{ ...MONO, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 12, color: "#8C97B8" }}>
      {latest && <span style={{ background: ACCENT, color: "#FFFFFF", padding: "4px 10px", borderRadius: 999 }}>LATEST</span>}
      {post.date && <time dateTime={post.isoDate ?? undefined}>{post.date}</time>}
      {post.date && post.read && <span aria-hidden="true">·</span>}
      {post.read && <span>{post.read}</span>}
    </div>
  );
}

/** Topic filter + featured post + grid. Every post is in the server HTML on first paint. */
export function BlogIndex({ posts, topics }: { posts: PostCard[]; topics: Topic[] }) {
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const list = topic === "All" ? posts : posts.filter((p) => p.topic === topic);
  const featured = topic === "All" ? posts[0] : undefined;
  const grid = featured ? list.slice(1) : list;

  return (
    <>
      {topics.length > 1 && (
        <section aria-label="Filter by topic" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(["All", ...topics] as const).map((t) => {
              const on = t === topic;
              return (
                <button
                  key={t}
                  type="button"
                  className="btn-reset"
                  aria-pressed={on}
                  onClick={() => setTopic(t)}
                  style={{
                    minHeight: 44,
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0 18px",
                    borderRadius: 999,
                    fontSize: 15,
                    background: on ? ACCENT : "rgba(10,16,52,0.7)",
                    color: "#FFFFFF",
                    border: on ? `1px solid ${ACCENT}` : "1px solid rgba(111,168,255,0.35)",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {featured && (
        <section aria-label="Featured post" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 48px" }}>
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
            <div style={{ flex: "1 1 420px", minHeight: 320 }}>
              <Cover post={featured} minHeight={320} />
            </div>
            <div
              style={{
                flex: "1 1 420px",
                minWidth: 0,
                padding: "clamp(28px, 4vw, 48px)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <Meta post={featured} latest />
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                {featured.title}
              </h2>
              <p style={{ margin: 0, fontSize: 17, color: "#C9D4F2" }}>{featured.excerpt}</p>
              <span style={{ fontWeight: 600, color: "#6FA8FF" }}>Read the post →</span>
            </div>
          </Link>
        </section>
      )}

      <section aria-label="All posts" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
        {grid.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
            {grid.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "#E8EEFF",
                  background: "rgba(10,16,52,0.7)",
                  border: "1px solid rgba(111,168,255,0.25)",
                  borderRadius: 24,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ aspectRatio: "16 / 9" }}>
                  <Cover post={p} />
                </div>
                <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 10, flex: "1 1 auto" }}>
                  <Meta post={p} />
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: "#C9D4F2" }}>{p.excerpt}</p>
                  {p.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto", paddingTop: 6 }}>
                      {p.tags.map((t) => (
                        <Tag key={t} size={13}>
                          {t}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
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
