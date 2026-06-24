import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, getPosts } from "@/lib/blog";
import { getPortfolio } from "@/lib/portfolio";
import {
  JsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";

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
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: `/blog/${slug}`,
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt ?? undefined,
        tags: post.tags,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
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

  const authorName = await getPortfolio()
    .then((d) => d.profile?.name)
    .catch(() => undefined);

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-32 pb-24">
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
