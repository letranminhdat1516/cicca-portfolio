import type { BlogPostSummary, Portfolio } from "@portfolio/types";
import { CV_PDF_PATH, absoluteUrl, seoOf } from "./seo";

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** Split an experience description into its lead line and "- " bullets. */
export function splitDescription(description: string): {
  lead: string | null;
  bullets: string[];
} {
  const lines = description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
  const lead = lines.filter((l) => !l.startsWith("- ")).join(" ") || null;
  return { lead, bullets };
}

/**
 * /llms.txt body (https://llmstxt.org) — a plain-markdown briefing that lets
 * generative engines (ChatGPT, Perplexity, Claude, Gemini) answer questions about
 * the site owner accurately and cite the right pages (GEO).
 */
export function buildLlmsTxt(
  data: Portfolio,
  posts: BlogPostSummary[] = [],
): string {
  const seo = seoOf(data);
  const p = data.profile;
  const out: string[] = [];
  const section = (title: string) => out.push("", `## ${title}`, "");

  out.push(`# ${p?.name ?? seo.siteName}`, "", `> ${oneLine(seo.defaultDescription)}`);
  if (p) {
    out.push("", oneLine(`${p.name} — ${p.classRole}, based in ${titleCase(p.region)}. ${p.bio}`));
  }

  section("Key pages");
  out.push(
    `- [Portfolio](${absoluteUrl("/")}): projects, skills, achievements and experience`,
    `- [Résumé](${absoluteUrl("/cv")}): full CV as a web page`,
    `- [Résumé PDF](${absoluteUrl(CV_PDF_PATH)}): one-page printable CV`,
    `- [Blog](${absoluteUrl("/blog")}): engineering notes`,
  );

  if (data.experiences?.length) {
    section("Experience");
    for (const e of data.experiences) {
      out.push(`### ${e.title} — ${e.org} (${e.period})`);
      const { lead, bullets } = splitDescription(e.description);
      if (lead) out.push(oneLine(lead));
      for (const b of bullets) out.push(`- ${oneLine(b)}`);
      out.push("");
    }
    out.pop();
  }

  if (data.missions?.length) {
    section("Projects");
    for (const m of data.missions) {
      out.push(`- **${m.title}** (${m.status.toLowerCase()}): ${oneLine(m.objective)} Stack: ${m.loadout.join(", ")}.`);
    }
  }

  if (data.skillGroups?.length) {
    section("Skills");
    for (const g of data.skillGroups) {
      const name = g.name.split("//")[0].trim();
      out.push(`- ${name}: ${g.items.map((i) => i.n).join(", ")}`);
    }
  }

  if (data.achievements?.length) {
    section("Education & awards");
    for (const a of data.achievements) {
      out.push(`- ${a.title} (${a.year}): ${oneLine(a.description)}`);
    }
  }

  if (posts.length) {
    section("Articles");
    for (const post of posts) {
      out.push(`- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${oneLine(post.excerpt)}`);
    }
  }

  section("Contact");
  if (p?.email) out.push(`- Email: ${p.email}`);
  for (const s of data.socials ?? []) out.push(`- ${s.name}: ${absoluteUrl(s.href)}`);

  if (seo.llmsTxt?.trim()) {
    section("Notes");
    out.push(seo.llmsTxt.trim());
  }

  return out.join("\n") + "\n";
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\bVn\b/, "Vietnam");
}
