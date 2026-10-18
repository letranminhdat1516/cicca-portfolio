import { getPortfolio } from "@/lib/portfolio";
import { getPosts } from "@/lib/blog";
import { buildLlmsTxt } from "@/lib/llms";

// /llms.txt — the emerging convention that helps generative engines
// (ChatGPT, Perplexity, Claude, Gemini) understand and cite this site (GEO).
// Also served at /.well-known/llms.txt through a rewrite in next.config.ts.
export const dynamic = "force-dynamic";

export async function GET() {
  let body: string;
  try {
    const [data, posts] = await Promise.all([
      getPortfolio(),
      getPosts().catch(() => []),
    ]);
    body = buildLlmsTxt(data, posts);
  } catch {
    body = [
      "# Le Tran Minh Dat",
      "",
      "> AI-Native Software Engineer in Ho Chi Minh City, Vietnam (Lê Trần Minh Đạt, also known as cicca) — AI agents, LLM gateways, RAG and voice agents.",
      "",
      "- [Portfolio](https://letranminhdat.com/): projects, experience and contact",
      "- [CV](https://letranminhdat.com/cv): full CV as a web page",
      "",
    ].join("\n");
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
