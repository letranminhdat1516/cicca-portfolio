import { getPortfolio } from "@/lib/portfolio";
import { getPosts } from "@/lib/blog";
import { SITE_URL, seoOf } from "@/lib/seo";

// /llms.txt — the emerging convention that helps generative engines
// (ChatGPT, Perplexity, Claude, Gemini) understand and cite this site (GEO).
export const revalidate = 60;

export async function GET() {
  const lines: string[] = [];
  try {
    const [data, posts] = await Promise.all([
      getPortfolio(),
      getPosts().catch(() => []),
    ]);
    const seo = seoOf(data);
    const p = data.profile;

    lines.push(`# ${seo.siteName}`);
    lines.push("");
    lines.push(`> ${seo.defaultDescription}`);
    lines.push("");
    if (p) {
      lines.push(
        `${p.name} — ${p.classRole}. ${p.bio}`.replace(/\s+/g, " ").trim(),
      );
      lines.push("");
    }

    lines.push("## Key Pages");
    lines.push(`- [Portfolio home](${SITE_URL}/): overview, skills, experience`);
    lines.push(`- [Blog](${SITE_URL}/blog): articles on engineering and design`);
    lines.push("");

    if (data.missions?.length) {
      lines.push("## Projects");
      for (const m of data.missions) {
        lines.push(`- ${m.title}: ${m.objective} (stack: ${m.loadout.join(", ")})`);
      }
      lines.push("");
    }

    if (posts.length) {
      lines.push("## Articles");
      for (const post of posts) {
        lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`);
      }
      lines.push("");
    }

    if (data.socials?.length) {
      lines.push("## Links");
      for (const s of data.socials) lines.push(`- ${s.label}: ${s.href}`);
      lines.push("");
    }
  } catch {
    lines.length = 0;
    lines.push("# Lê Trần Minh Đạt");
    lines.push("");
    lines.push(
      "> Creative full-stack & AI developer — production AI agents, real-time systems, and full-stack web apps.",
    );
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
