import { getPortfolio } from "@/lib/portfolio";
import { getFullPosts } from "@/lib/blog";
import { buildLlmsFullTxt } from "@/lib/llms";

// /llms-full.txt — everything an answer engine needs in one fetch: the profile
// briefing from /llms.txt followed by each article's full markdown.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [data, posts] = await Promise.all([
      getPortfolio(),
      getFullPosts().catch(() => []),
    ]);
    return new Response(buildLlmsFullTxt(data, posts), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    });
  } catch {
    return new Response("Temporarily unavailable\n", { status: 503, headers: { "Retry-After": "60" } });
  }
}
