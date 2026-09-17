#!/usr/bin/env node
// Push every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver). Bing's index
// also backs ChatGPT search and Copilot, so this is the fastest way to get an
// edit in front of those answer engines. Run after a deploy or content change:
//   node scripts/indexnow.mjs https://letranminhdat.com
const SITE = (process.argv[2] ?? "https://letranminhdat.com").replace(/\/+$/, "");
const KEY = "b661cba392ab41dc8896277072a9e6c7"; // served at /<KEY>.txt (apps/web/public)

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) {
  console.error("sitemap has no URLs");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).hostname,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow ${res.status} — ${urlList.length} URL(s) submitted`);
process.exit(res.ok ? 0 : 1);
