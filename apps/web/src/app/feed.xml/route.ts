import { getPosts } from "@/lib/blog";
import { getPortfolio } from "@/lib/portfolio";
import { SITE_URL, seoOf } from "@/lib/seo";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0 feed of the blog: feed readers, Bing and aggregators pick up new
// posts from here without waiting for a recrawl.
export async function GET() {
  const [posts, data] = await Promise.all([
    getPosts().catch(() => []),
    getPortfolio().catch(() => null),
  ]);
  const seo = seoOf(data);
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return [
        "<item>",
        `<title>${esc(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<description>${esc(p.excerpt)}</description>`,
        ...(p.publishedAt ? [`<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>`] : []),
        ...p.tags.map((t) => `<category>${esc(t)}</category>`),
        "</item>",
      ].join("");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(seo.siteName)} — Blog</title>
<link>${SITE_URL}/blog</link>
<description>${esc(seo.defaultDescription)}</description>
<language>en</language>
<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
