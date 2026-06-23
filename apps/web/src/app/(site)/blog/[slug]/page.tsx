import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, getPosts } from "@/lib/blog";

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    // API unreachable at build time — pages render on demand via ISR instead.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    return {
      title: `${post.title} — PLAYER_01.sys`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt ?? undefined,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return { title: "Not found" };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    keywords: post.tags.join(", "),
  };

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-32 pb-24">
      <script
        type="application/ld+json"
        // Escape `<` so admin-authored fields can't break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/blog"
        className="text-[12px] tracking-widest no-underline"
        style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee" }}
      >
        ◂ ALL DISPATCHES
      </Link>
      <h1
        className="mt-4 font-bold"
        style={{
          fontFamily: "var(--font-title), sans-serif",
          fontSize: "clamp(28px,5vw,44px)",
          color: "#fff",
          textShadow: "0 0 20px rgba(176,38,255,0.35)",
        }}
      >
        {post.title}
      </h1>
      {post.publishedAt && (
        <div className="mt-2 text-[12px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}>
          {new Date(post.publishedAt).toISOString().slice(0, 10)} · {post.tags.map((t) => `#${t}`).join(" ")}
        </div>
      )}
      <article className="md mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
