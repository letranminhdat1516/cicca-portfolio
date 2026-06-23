import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog — PLAYER_01.sys",
  description: "Dev logs, mission write-ups, and notes from the field.",
};

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <main className="mx-auto max-w-[820px] px-6 pt-32 pb-20">
      <SectionHeader index="LOG" label="DISPATCHES" title="BLOG" />
      <div className="flex flex-col gap-5">
        {posts.length === 0 && (
          <p style={{ color: "#9a9ab8" }}>No dispatches yet. Check back soon.</p>
        )}
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block p-5 no-underline transition-transform hover:-translate-y-1"
            style={{
              background: "rgba(10,10,18,0.7)",
              border: "1px solid rgba(176,38,255,0.2)",
              clipPath:
                "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))",
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[20px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
                {p.title}
              </h2>
              {p.publishedAt && (
                <span className="shrink-0 text-[11px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}>
                  {new Date(p.publishedAt).toISOString().slice(0, 10)}
                </span>
              )}
            </div>
            <p className="mt-2 text-[14px] leading-6" style={{ color: "#a8a8c2" }}>
              {p.excerpt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="px-2 py-1 text-[10px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.2)" }}>
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
