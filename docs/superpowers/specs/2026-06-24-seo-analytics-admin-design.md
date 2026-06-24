# SEO/GEO + Analytics Dashboard + Admin Redesign — Design

**Date:** 2026-06-24
**Project:** PLAYER_01.sys portfolio (`apps/web` Next.js 16, `apps/api` NestJS + Prisma + Postgres)
**Status:** Approved (user delegated all decisions)

## Goals

Three user-requested capabilities:

1. **SEO + GEO** — make the site discoverable in both classic search engines (Google) and
   generative AI engines (ChatGPT, Perplexity, Gemini). All meta editable from the CMS.
2. **Analytics dashboard in admin** — show visitor counts, traffic trends, top pages/referrers,
   an on-page SEO health score, and a Search Console panel (active once deployed).
3. **Admin UI redesign** — replace amateur emoji icons with a professional icon set; polish layout.

## Decisions (chosen on user's behalf)

- **Analytics source: self-hosted + Search Console scaffold.** First-party pageview tracking
  written to the app's own Postgres so it works locally and in production with full data ownership;
  a Google Search Console integration is scaffolded (UI + config slot) and activates after deploy +
  domain verification, since real impression/click/ranking data only exists for a verified domain.
- **Icons: `lucide-react`** — clean professional line icons, replaces all emoji in admin.
- **`metadataBase`** derives from `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) so it is
  correct in every environment without hardcoding a domain.
- **Privacy-first tracking:** anonymous, cookieless, respects Do-Not-Track; no PII stored.

## Part 1 — SEO & GEO (apps/web)

New/changed files:
- `app/robots.ts` — allow crawl, point to sitemap, allow AI crawlers.
- `app/opengraph-image.tsx` — branded neon OG image (ImageResponse).
- `app/(site)/page.tsx` — `generateMetadata()` with title, description, keywords, canonical,
  OpenGraph, Twitter Card, all sourced from `SeoSettings` + profile content.
- `components/seo/JsonLd.tsx` — renders structured data:
  - Home: `Person` + `WebSite` + `ProfilePage`.
  - Blog list/post: `Article` + `BreadcrumbList`.
  Structured data is the key lever for both Google rich results and GEO (AI engines parse JSON-LD).
- `app/llms.txt/route.ts` — emits an `llms.txt` (GEO: guides AI crawlers to key content).
- `app/sitemap.ts` — expand to include home, blog index, all posts, with lastmod.
- Root `layout.tsx` — add `metadataBase`, default OpenGraph/Twitter, verification tag slot.
- Semantic HTML / alt-text passes on key components.

## Part 2 — Analytics (apps/api + apps/web)

### Data model (Prisma)
- `PageView { id, path, referrer?, country?, device?, sessionHash?, createdAt }`
  — `sessionHash` is a salted daily hash of IP+UA for unique-visitor counting without storing PII.
- `SeoSettings { id, siteName, defaultTitle, defaultDescription, keywords[], ogImageUrl?,
  twitterHandle?, gscVerification?, llmsTxt?, updatedAt }` — singleton row, editable in admin.

### Backend (NestJS `analytics` module)
- `POST /analytics/collect` (public, no auth) — accepts `{ path, referrer }`; server derives
  country/device from headers, computes `sessionHash`; rate-limited; ignores admin paths & bots.
- `GET /analytics/summary?range=30d` (JWT) — aggregates: totals, unique visitors, today vs range,
  daily time series, top paths, top referrers, device split.
- `GET /analytics/seo-health` (JWT) — computes on-page SEO score by inspecting current SeoSettings
  + content (title/description length, presence of OG/JSON-LD/sitemap/robots, keyword set, etc.).
- SeoSettings exposed read-only via `GET /content` (so web can render meta) and read/write via the
  existing admin CRUD pattern.

### Web tracking
- `components/analytics/Tracker.tsx` — client component, fires one `navigator.sendBeacon` to
  `/analytics/collect` on route load; bails if DNT enabled; no cookies.

## Part 3 — Admin redesign + dashboard

- Add `lucide-react`; map every emoji to a lucide icon (Target, Wrench, Trophy, Briefcase, Package,
  Radio, Link, Star, Hexagon, FileText, Download, Check, …) across `AdminApp.tsx`, `adminSchema.ts`,
  `Preview.tsx`.
- **Dashboard (`AdminApp` overview tab)**:
  - Stat cards: total pageviews, unique visitors, pages/session, today vs 30d.
  - 30-day traffic line chart — hand-rolled SVG (no heavy chart lib).
  - Top pages, top referrers, device split lists.
  - **SEO Health panel** — score + checklist of passing/failing on-page items (works locally).
  - **Search Console panel** — "Connect after deploy" state; shows where GSC data will appear.
- Keep the neon design language but reduce "toy" feel: consistent icon sizing, calmer accents.

## Build order

1. DB + backend (models, migration, analytics module, SeoSettings CRUD).
2. SEO/GEO on web (metadata, JSON-LD, robots, OG image, llms.txt, sitemap).
3. Web tracking beacon.
4. Admin dashboard (analytics widgets + SEO health + GSC placeholder).
5. Icon replacement + UI polish.
6. End-to-end verification.

## Non-goals / deferred

- Live Google Search Console / GA4 API calls (needs deployed verified domain) — scaffolded only.
- Cookie-based session analytics, funnels, A/B testing.
- Real-time dashboards / websockets.

## Testing

- API: unit/e2e for collect + summary aggregation and seo-health scorer.
- Web: build must succeed with API reachable; verify rendered `<head>` has OG/Twitter/JSON-LD;
  confirm a pageview row is written and surfaces in the dashboard.
