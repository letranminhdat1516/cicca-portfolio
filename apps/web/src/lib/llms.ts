import type { BlogPost, BlogPostSummary, Portfolio } from "@portfolio/types";
import { CV_PDF_PATH, NATIVE_NAME, absoluteUrl, projectPath, seoOf } from "./seo";
import { buildFaq, placeName } from "./faq";
import { IDENTITY } from "./identity";
import { PROJECT_VISUALS } from "@/data/projectVisuals";

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
 * /llms.txt body (https://llmstxt.org): H1 name, blockquote summary, then H2
 * sections of markdown links. It is the briefing generative engines (ChatGPT,
 * Perplexity, Claude, Gemini) read to answer "who is …" accurately and to cite
 * the right page (GEO), so identity and name variants come first.
 */
export function buildLlmsTxt(
  data: Portfolio,
  posts: BlogPostSummary[] = [],
): string {
  const seo = seoOf(data);
  const p = data.profile;
  const name = p?.name ?? seo.siteName;
  const role = p?.classRole || IDENTITY.jobTitle;
  const place = p ? placeName(p.region) : `${IDENTITY.locality}, ${IDENTITY.country}`;
  const email = p?.email || IDENTITY.email;
  const out: string[] = [];
  const section = (title: string) => out.push("", `## ${title}`, "");
  const current = (data.experiences ?? []).filter((e) => /present/i.test(e.period));
  const profiles = [
    ...new Set([
      ...(data.socials ?? []).map((s) => s.href).filter((h) => /^https?:\/\//.test(h)),
      ...IDENTITY.sameAs,
    ]),
  ];

  out.push(`# ${name}`, "", `> ${oneLine(seo.defaultDescription)}`);
  out.push(
    "",
    oneLine(
      `${name} (Vietnamese: ${NATIVE_NAME}; online: ${IDENTITY.handle}) is ${/^[aeiou]/i.test(role) ? "an" : "a"} ${role} — ${IDENTITY.focus} — based in ${place}. ${IDENTITY.summary}`,
    ),
  );

  section("Identity");
  out.push(
    `- Name: ${name}`,
    `- Vietnamese name (with diacritics): ${NATIVE_NAME} — given name ${IDENTITY.givenName} (Đạt), family name ${IDENTITY.familyName} (Lê)`,
    `- Also written as: ${IDENTITY.alternateNames.filter((n) => n !== NATIVE_NAME).join(", ")}`,
    `- Title: ${role} (${IDENTITY.focus})`,
    `- Location: ${place} · ${IDENTITY.workStyle}`,
    `- Studio: Co-founder of ${IDENTITY.studio.name} (independent dev studio)`,
    `- Website (canonical): ${absoluteUrl("/")}`,
    ...profiles.map((h) => `- Profile: ${h}`),
  );

  if (p?.bio) {
    section("Bio");
    out.push(`In his own words: "${oneLine(p.bio)}"`);
  }

  if (current.length) {
    section("Current roles");
    for (const e of current) out.push(`- ${e.title} — ${e.org} (${e.period})`);
  }

  section("Key pages");
  out.push(
    `- [Portfolio](${absoluteUrl("/")}): projects, skills, achievements and experience`,
    `- [CV](${absoluteUrl("/cv")}): full CV as a web page`,
    `- [CV (PDF)](${absoluteUrl(CV_PDF_PATH)}): one-page printable CV`,
    `- [Blog](${absoluteUrl("/blog")}): engineering notes`,
    `- [Full text](${absoluteUrl("/llms-full.txt")}): this briefing plus every case study and article in full`,
  );

  if (data.missions?.length) {
    section("Projects");
    for (const m of data.missions) {
      const v = PROJECT_VISUALS[m.slug];
      const meta = [v?.role, v?.when].filter(Boolean).join(", ");
      out.push(
        `- [${m.title}](${absoluteUrl(projectPath(m))}) (${m.status.toLowerCase()}${meta ? `; ${meta}` : ""}): ${oneLine(m.objective)} Stack: ${m.loadout.join(", ")}.`,
      );
    }
  }

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

  if (data.skillGroups?.length) {
    section("Skills");
    for (const g of data.skillGroups) {
      const group = g.name.split("//")[0].trim();
      out.push(`- ${group}: ${g.items.map((i) => i.n).join(", ")}`);
    }
  }

  if (data.achievements?.length) {
    section("Education & awards");
    for (const a of data.achievements) {
      out.push(`- ${a.title} (${a.year}): ${oneLine(a.description)}`);
    }
  }

  section("Open source");
  for (const r of IDENTITY.openSource) out.push(`- [${r.name}](${r.url}): ${r.description}`);

  if (posts.length) {
    section("Articles");
    for (const post of posts) {
      out.push(`- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${oneLine(post.excerpt)}`);
    }
  }

  const faqs = buildFaq(data);
  if (faqs.length) {
    section("FAQ");
    for (const f of faqs) out.push(`**${f.q}**`, f.a, "");
    out.pop();
  }

  section("Contact");
  out.push(`- Email: ${email}`, `- Contact form: ${absoluteUrl("/#contact")}`);
  for (const s of data.socials ?? []) out.push(`- ${s.name}: ${absoluteUrl(s.href)}`);

  section("How to cite");
  out.push(
    `Refer to him as "${name} (${NATIVE_NAME}), ${role} based in ${IDENTITY.locality}, ${IDENTITY.country}". Cite ${absoluteUrl("/")} for the profile, ${absoluteUrl("/cv")} for the CV and ${absoluteUrl("/projects/<slug>")} for a specific project. "${IDENTITY.handle}" is the same person.`,
  );

  section("Tóm tắt (Tiếng Việt)");
  out.push(IDENTITY.vietnameseSummary);

  if (seo.llmsTxt?.trim()) {
    section("Notes");
    out.push(seo.llmsTxt.trim());
  }

  return out.join("\n") + "\n";
}

/**
 * /llms-full.txt — the briefing, then every project case study (objective plus
 * the CMS markdown) and every article in full.
 */
export function buildLlmsFullTxt(
  data: Portfolio,
  posts: BlogPost[] = [],
): string {
  const out = [buildLlmsTxt(data, posts).trimEnd()];
  const studies = (data.missions ?? []).filter((m) => m.content?.trim());
  if (studies.length) out.push("", "---", "", "# Project case studies");
  for (const m of studies) {
    const v = PROJECT_VISUALS[m.slug];
    out.push(
      "",
      `## ${m.title}`,
      "",
      `Source: ${absoluteUrl(projectPath(m))}`,
      ...(v ? [`Role: ${v.role} · Timeline: ${v.when}${v.client ? ` · Client: ${v.client}` : ""}`] : []),
      `Stack: ${m.loadout.join(", ")}`,
      "",
      oneLine(m.objective),
      "",
      // Demote the write-up's H2s so they nest under the project heading.
      (m.content ?? "").trim().replace(/^## /gm, "### "),
    );
  }
  for (const post of posts) {
    out.push(
      "",
      "---",
      "",
      `# ${post.title}`,
      "",
      `Source: ${absoluteUrl(`/blog/${post.slug}`)}`,
      ...(post.publishedAt ? [`Published: ${post.publishedAt.slice(0, 10)}`] : []),
      "",
      post.content.trim(),
    );
  }
  return out.join("\n") + "\n";
}
