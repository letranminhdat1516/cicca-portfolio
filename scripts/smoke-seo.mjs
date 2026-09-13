#!/usr/bin/env node
// Post-deploy smoke test for the live site: availability, SEO and GEO signals.
//   node scripts/smoke-seo.mjs https://letranminhdat.com
const SITE = (process.argv[2] ?? "https://letranminhdat.com").replace(/\/+$/, "");
const host = new URL(SITE).hostname;
let failed = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failed++;
}

async function get(path, init) {
  const res = await fetch(path.startsWith("http") ? path : SITE + path, { redirect: "manual", ...init });
  return { res, body: init?.method === "HEAD" ? "" : await res.text() };
}

const meta = (html, re) => html.match(re)?.[1];
const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap((m) => {
    const d = JSON.parse(m[1]);
    return Array.isArray(d) ? d : [d];
  });

// Home
{
  const { res, body } = await get("/");
  check("home 200", res.status === 200, String(res.status));
  const title = meta(body, /<title>(.*?)<\/title>/s);
  check("home <title> ≤ 60 chars", !!title && title.length <= 60, title);
  const desc = meta(body, /<meta name="description" content="(.*?)"/);
  check("meta description 70–160 chars", !!desc && desc.length >= 70 && desc.length <= 160, `${desc?.length}`);
  check("canonical → site root", body.includes(`<link rel="canonical" href="${SITE}"`) || body.includes(`<link rel="canonical" href="${SITE}/"`));
  check("og:image absolute", new RegExp(`<meta property="og:image" content="${SITE}/`).test(body));
  check("twitter card", body.includes('name="twitter:card" content="summary_large_image"'));
  check("single <h1>", (body.match(/<h1[\s>]/g) ?? []).length === 1);
  check("html lang", /<html[^>]+lang="en"/.test(body));
  const ld = jsonLd(body);
  const person = ld.find((n) => n["@type"] === "Person");
  check("JSON-LD Person", !!person?.name && !!person?.jobTitle, person?.name);
  check("JSON-LD Person alumniOf + sameAs", !!person?.alumniOf?.length && !!person?.sameAs?.length);
  check("JSON-LD WebSite + ProfilePage", ld.some((n) => n["@type"] === "WebSite") && ld.some((n) => n["@type"] === "ProfilePage"));
  check("CV content rendered", body.includes("LLM Gateway Engineer") && body.includes("FPT University"));
  check("no placeholder links", !/href="#"|example\.com/.test(body));
}

// Résumé page
{
  const { res, body } = await get("/cv");
  check("/cv 200", res.status === 200);
  check("/cv canonical", body.includes(`<link rel="canonical" href="${SITE}/cv"`));
  check("/cv BreadcrumbList", jsonLd(body).some((n) => n["@type"] === "BreadcrumbList"));
  check("/cv lists all CV roles", ["LLM Gateway Engineer", "AI Agent Consultant Engineer", "Accounting Application Developer", "AI Team Lead, Computer Vision", "AI Agent Engineer", "Freelance Software Engineer, Team Lead"].every((t) => body.includes(t)));
}

// PDF
{
  const { res } = await get("/cv/letranminhdat-cv.pdf", { method: "HEAD" });
  check("CV PDF served", res.status === 200 && res.headers.get("content-type") === "application/pdf");
  check("CV PDF noindex (reference contact details)", (res.headers.get("x-robots-tag") ?? "").includes("noindex"));
}

// Crawl files
{
  const { res, body } = await get("/robots.txt");
  check("robots.txt 200", res.status === 200);
  check("robots allows AI crawlers", /User-Agent: GPTBot/i.test(body) && /User-Agent: ClaudeBot/i.test(body) && /User-Agent: PerplexityBot/i.test(body));
  check("robots blocks /admin", body.includes("Disallow: /admin"));
  check("robots sitemap absolute", body.includes(`Sitemap: ${SITE}/sitemap.xml`));

  const sm = await get("/sitemap.xml");
  check("sitemap has / and /cv", sm.res.status === 200 && sm.body.includes(`<loc>${SITE}/cv</loc>`) && sm.body.includes(`<loc>${SITE}/</loc>`));

  const llms = await get("/llms.txt");
  check("llms.txt 200 text/plain", llms.res.status === 200 && (llms.res.headers.get("content-type") ?? "").startsWith("text/plain"));
  check("llms.txt profile briefing", llms.body.startsWith("# ") && ["## Experience", "## Projects", "## Skills", "## Education & awards", "## Contact"].every((h) => llms.body.includes(h)));

  const og = await get("/opengraph-image", { method: "HEAD" });
  check("OG image png", og.res.status === 200 && (og.res.headers.get("content-type") ?? "").startsWith("image/png"));
}

// API through same-origin rewrite
{
  const { res, body } = await get("/api/content");
  check("/api/content 200", res.status === 200);
  check("API returns CV profile", JSON.parse(body).profile?.classRole === "AI-Native Full-Stack Developer");
  const h = await get("/api/health");
  check("/api/health ok", h.res.status === 200 && JSON.parse(h.body).db === true);
}

// Admin must not be indexed
{
  const { res, body } = await get("/admin");
  check("admin noindex", /noindex/.test(res.headers.get("x-robots-tag") ?? "") || /<meta name="robots" content="noindex/.test(body));
}

// Canonical host redirects
if (!host.startsWith("localhost")) {
  const { res } = await get(`https://www.${host}/cv`);
  check("www → apex 301/308", [301, 308].includes(res.status) && res.headers.get("location") === `${SITE}/cv`, `${res.status} ${res.headers.get("location")}`);
}

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
