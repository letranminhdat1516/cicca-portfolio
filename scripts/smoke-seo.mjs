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
  // 65: the title carries both spellings of the name.
  check("home <title> ≤ 65 chars, both name forms", !!title && title.length <= 65 && title.includes("Lê Trần Minh Đạt"), title);
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
  check("JSON-LD Person @id", person?.["@id"] === `${SITE}/#person`, person?.["@id"]);
  check("JSON-LD Person alternateName has Lê Trần Minh Đạt + cicca", ["Lê Trần Minh Đạt", "cicca"].every((n) => person?.alternateName?.includes(n)));
  check("JSON-LD sameAs GitHub + LinkedIn", ["github.com/letranminhdat1516", "linkedin.com/in/dat-le-139a85284"].every((h) => person?.sameAs?.some((u) => u.includes(h))));
  check("og:locale:alternate vi_VN", body.includes('property="og:locale:alternate" content="vi_VN"'));
  check("footer shows both names + handle", /© 2026 Le Tran Minh Dat \(<span lang="vi">Lê Trần Minh Đạt<\/span>\) · cicca/.test(body));
  check("JSON-LD WebSite + ProfilePage", ld.some((n) => n["@type"] === "WebSite") && ld.some((n) => n["@type"] === "ProfilePage"));
  check("CV content rendered", body.includes("AI Gateway Platform Engineer") && body.includes("FPT University"));
  check("no placeholder links", !/href="#"|example\.com/.test(body));
  check("JSON-LD projects ItemList + FAQPage", ld.some((n) => n["@type"] === "ItemList") && ld.some((n) => n["@type"] === "FAQPage"));
  check("FAQ rendered in HTML", body.includes("Who is ") && body.includes("<details"));
  check("counters server-rendered (not 0)", !/>0<\/div><div[^>]*>PRODUCTION SYSTEMS/.test(body));
  check("native-script name visible", body.replace(/<script.*?<\/script>/gs, "").includes("Lê Trần Minh Đạt"));
  check("RSS + llms.txt alternates", body.includes('type="application/rss+xml"') && body.includes('href="' + SITE + '/llms.txt"'));
  check("manifest + theme-color", body.includes('rel="manifest"') && body.includes('name="theme-color"'));
  check("no x-powered-by", !res.headers.get("x-powered-by"));
}

// Blog
{
  const { res, body } = await get("/blog");
  check("/blog 200 with og:image", res.status === 200 && new RegExp(`<meta property="og:image" content="${SITE}/`).test(body));
  check("/blog single <h1> + Blog JSON-LD", (body.match(/<h1[\s>]/g) ?? []).length === 1 && jsonLd(body).some((n) => n["@type"] === "Blog"));
  const slug = body.match(/href="\/blog\/([^"/]+)"/)?.[1];
  if (slug) {
    const post = await get(`/blog/${slug}`);
    check("post og:image + twitter:image", /property="og:image"/.test(post.body) && /name="twitter:image"/.test(post.body));
    const og = await get(`/blog/${slug}/og`, { method: "HEAD" });
    check("post share card png", og.res.status === 200 && (og.res.headers.get("content-type") ?? "").startsWith("image/png"));
  }
  const missing = await get("/blog/this-post-does-not-exist");
  check("unknown post → 404 noindex", missing.res.status === 404 && /name="robots" content="noindex/.test(missing.body));
}

// CV page
{
  const { res, body } = await get("/cv");
  check("/cv 200", res.status === 200);
  check("/cv canonical", body.includes(`<link rel="canonical" href="${SITE}/cv"`));
  check("/cv BreadcrumbList", jsonLd(body).some((n) => n["@type"] === "BreadcrumbList"));
  check("/cv shows the Vietnamese name", body.includes('<span lang="vi">Lê Trần Minh Đạt</span>'));
  check("/cv lists all CV roles", ["AI Gateway Platform Engineer", "Backend &amp; AI Engineer", "Co-founder", "AI Agent Consultant Engineer", "Core Full-stack Developer", "AI Team Lead, Computer Vision", "Team Lead, Software Engineer", "IT Support Technician"].every((t) => body.includes(t)));
}

// Project case study
{
  const missions = await get("/api/content").then(({ body }) => JSON.parse(body).missions ?? []).catch(() => []);
  const m = missions.find((x) => x.content?.trim());
  if (m) {
    const { res, body } = await get(`/projects/${m.slug}`);
    check(`/projects/${m.slug} 200 + indexable`, res.status === 200 && !/<meta name="robots" content="noindex/.test(body));
    const article = jsonLd(body).find((n) => n["@type"] === "Article");
    check("project Article authored by #person with screenshots", article?.author?.["@id"] === `${SITE}/#person` && [article?.image].flat().some((u) => String(u).includes(`/projects/${m.slug}/`)));
  } else check("at least one project case study published", false);
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
  const smProjects = [...sm.body.matchAll(/<loc>([^<]*\/projects\/[^<]+)<\/loc>/g)].map((m) => m[1]);
  check("sitemap has /projects/ case studies", smProjects.length > 0, `${smProjects.length} project URLs`);
  check("sitemap has project screenshots (image:image)", sm.body.includes("<image:loc>") && sm.body.includes("/projects/"));

  const llms = await get("/llms.txt");
  check("llms.txt 200 text/plain", llms.res.status === 200 && (llms.res.headers.get("content-type") ?? "").startsWith("text/plain"));
  check("llms.txt profile briefing", llms.body.startsWith("# ") && ["## Experience", "## Projects", "## Skills", "## Education & awards", "## Contact"].every((h) => llms.body.includes(h)));

  const smLast = [...sm.body.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => Date.parse(m[1]));
  check("sitemap lastmod is a real edit time, not now()", smLast.every((t) => Date.now() - t > 60_000));
  check("llms.txt has FAQ", llms.body.includes("## FAQ"));
  check("llms.txt has the Vietnamese name + handle", llms.body.includes("Lê Trần Minh Đạt") && llms.body.includes("cicca"));
  const missions = await get("/api/content").then(({ body }) => JSON.parse(body).missions ?? []).catch(() => []);
  const projectUrls = missions.map((m) => (m.content?.trim() ? `${SITE}/projects/${m.slug}` : `${SITE}/#${m.slug}`));
  const missingProjects = projectUrls.filter((u) => !llms.body.includes(`(${u})`));
  check("llms.txt links every project", missions.length > 0 && missingProjects.length === 0, missingProjects.join(", "));
  check("llms.txt every project has a case study", missions.length > 0 && missions.every((m) => m.content?.trim()), missions.filter((m) => !m.content?.trim()).map((m) => m.slug).join(", "));
  const wk = await get("/.well-known/llms.txt");
  check("/.well-known/llms.txt 200", wk.res.status === 200 && wk.body.startsWith("# "));

  const full = await get("/llms-full.txt");
  check("llms-full.txt 200 text/plain", full.res.status === 200 && (full.res.headers.get("content-type") ?? "").startsWith("text/plain"));
  check("llms-full.txt has project case studies", full.body.includes("# Project case studies"));
  const feed = await get("/feed.xml");
  check("RSS feed", feed.res.status === 200 && feed.body.includes("<rss") && (feed.res.headers.get("content-type") ?? "").includes("rss+xml"));
  const mf = await get("/manifest.webmanifest");
  check("web manifest", mf.res.status === 200 && JSON.parse(mf.body).icons?.length > 0);

  const og = await get("/opengraph-image", { method: "HEAD" });
  check("OG image png", og.res.status === 200 && (og.res.headers.get("content-type") ?? "").startsWith("image/png"));
}

// API through same-origin rewrite
{
  const { res, body } = await get("/api/content");
  check("/api/content 200", res.status === 200);
  check("API returns CV profile", JSON.parse(body).profile?.classRole === "AI-Native Software Engineer");
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
