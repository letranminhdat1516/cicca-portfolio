import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { getPortfolio } from "@/lib/portfolio";
import { pageMetadata, seoOf } from "@/lib/seo";
import { JsonLd, blogJsonLd } from "@/components/seo/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";

export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Engineering notes by Le Tran Minh Dat on LLM gateways, RAG agents and full-stack delivery.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = seoOf(await getPortfolio().catch(() => null));
  return pageMetadata({ seo, path: "/blog", title: "Blog", description: DESCRIPTION });
}

export default async function BlogIndex() {
  const [posts, authorName] = await Promise.all([
    getPosts(),
    getPortfolio()
      .then((d) => d.profile?.name)
      .catch(() => undefined),
  ]);
  return (
    <main className="mx-auto max-w-[820px] px-6 pt-32 pb-20">
      <JsonLd data={blogJsonLd(posts, authorName)} />
      <SectionHeader index="LOG" label="DISPATCHES" />
      <h1
        className="mt-2 mb-3 font-bold"
        style={{ fontFamily: "var(--font-title), sans-serif", fontSize: "clamp(26px,4vw,40px)", color: "#fff" }}
      >
        BLOG
      </h1>
      <p className="mb-8 text-[14px] leading-6" style={{ color: "#a8a8c2" }}>
        {DESCRIPTION}
      </p>
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
