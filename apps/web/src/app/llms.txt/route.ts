import { getPortfolio } from "@/lib/portfolio";
import { getPosts } from "@/lib/blog";
import { buildLlmsTxt } from "@/lib/llms";

// /llms.txt — the emerging convention that helps generative engines
// (ChatGPT, Perplexity, Claude, Gemini) understand and cite this site (GEO).
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
      "> AI-native full-stack developer in Ho Chi Minh City — LLM gateways, RAG agents, ERP and computer vision.",
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
