# Design Spec: Portfolio "Player Profile" → Full-stack (Next.js + NestJS)

**Date:** 2026-06-23
**Status:** Approved

## 1. Context & Goal

A gaming/cyberpunk-themed portfolio page ("Player Profile") currently exists as a
design-tool export: `project/Player Profile.dc.html` + `project/support.js`.

- `support.js` (1527 lines) is a **generated React 18 runtime** from a design tool (custom
  tags `<x-dc>`, `<sc-for>`, `<sc-if>`, `<helmet>`). It will be **discarded** in the refactor.
- The valuable parts inside `.dc.html`: a clear **design system**, a structured **data model**
  (missions/skills/achievements/socials/stats/profile), and reusable **animations** (particle
  canvas, cursor trail, radar chart, count-up, typewriter, scroll-reveal, 3D tilt, XP bar).

**Goal:** turn this static page into a **flexible full-stack portfolio**. The owner adds blog
posts, projects, experiences, and shared resources through an **admin panel** (no code edits),
backed by **NestJS + Postgres**, with **strong SEO** for the blog.

## 2. Decisions

| Area | Choice | Rationale |
|---|---|---|
| Frontend | Next.js (App Router) | SEO for blog: SSR/SSG/ISR, Metadata API, sitemap, JSON-LD |
| Backend | NestJS REST API | Structured, modular backend the owner wants |
| Database | Postgres + Prisma | Typed schema, migrations, easy seeding |
| Content mgmt | Admin panel with login | Form-based CRUD, no code edits to add content |
| Approach | Full-stack in a monorepo | Built in parallel, one repo |

## 3. Architecture

```
portfolio/                       # monorepo root (pnpm workspaces + Turborepo)
├── apps/
│   ├── web/                     # Next.js — public site + /admin route group
│   └── api/                     # NestJS — REST API + auth
├── packages/
│   ├── design-tokens/           # colors, fonts, clip-paths, animation config (shared)
│   └── types/                   # shared TS types / DTOs (web ↔ api)
├── docker-compose.yml           # Postgres (+ api) for local dev
├── pnpm-workspace.yaml
└── turbo.json
```

`web` calls `api` over REST. Public pages use Server Components + fetch with `revalidate`
(ISR) — dynamic yet SEO-friendly. Admin pages are client-side with JWT auth. The legacy
`project/` folder is kept as reference until design + data are ported, then removed.

### 3.1 Design system (ported from `.dc.html`)
- **Tokens** → `packages/design-tokens` + Tailwind config:
  - Colors: `#b026ff` (purple/epic), `#22d3ee` (cyan/rare), `#ff2d9b` (pink), `#ffd23f`
    (gold/legendary), `#4ade80` (success), bg `#08070f`/`#0a0a12`, text `#e8e8f0`.
  - Fonts: Orbitron (title), Space Grotesk (UI), Inter (body), JetBrains Mono (mono).
  - 18px chamfered clip-paths, angled buttons, hexagon avatar; neon `text-shadow`/`box-shadow`.
- **Animations → React hooks**: `useParticles` (70-particle canvas), `useCursorTrail`,
  `useCountUp`, `useTypewriter`, `useScrollReveal` (IntersectionObserver), `useTilt`, XP bar
  fill. All respect `prefers-reduced-motion` and clean up RAF.
- **Components**: `<RadarChart>` (5-stat pentagon canvas), `<AchievementToast>`, `<XPBar>`,
  `<MissionCard>`, `<SkillCard>`, `<HudNav>` (scroll progress + telemetry), `<CinematicBg>`.

### 3.2 Data model (Prisma)
- `User` — admin login (email, passwordHash, role).
- `Profile` (singleton) — name, classRole, tagline, bio, level, rank, region, email,
  xpCurrent, xpMax, avatarUrl.
- `Stat` — label, value, order (5 radar axes).
- `Counter` — label, value, suffix, color, order.
- `Project` (mission) — code, slug, title, objective, difficulty, impact, status,
  statusColor, loadout[], content, order.
- `Skill` — groupName, name, rarity(enum), level(0-100), tip, order.
- `Achievement` — year, title, description, color, order.
- `Social` — label, name, href, order.
- `Experience` — title, org, period, description, order.
- `Resource` — title, description, url, repoUrl, tags[].
- `BlogPost` — slug, title, excerpt, content(markdown), tags[], coverImage, published,
  publishedAt, createdAt, updatedAt.
- **Bilingual EN/VI**: key text fields get nullable `...Vi` variants (fallback to EN);
  rolled out incrementally, not an MVP blocker.

### 3.3 API (NestJS)
- `auth` module: JWT login + guard on mutations.
- One module per entity: `profile`, `stats`, `counters`, `projects`, `skills`,
  `achievements`, `socials`, `experiences`, `resources`, `blog`.
- Public `GET` open; `POST/PATCH/DELETE` require JWT guard.
- DTOs + `class-validator`; `@nestjs/swagger` for API docs.

## 4. Milestones

- **M0 — Scaffold**: pnpm workspaces + Turborepo; `apps/web` (Next.js), `apps/api` (NestJS),
  `packages/design-tokens`, `packages/types`; Postgres via docker-compose; Prisma init.
  `pnpm dev` brings up both apps.
- **M1 — Design foundation**: tokens/fonts/Tailwind; `<CinematicBg>`, `<HudNav>`, Hero +
  animation hooks; temporary TS-config data to verify visual parity with the original.
- **M2 — Backend core + wire**: full Prisma schema; NestJS modules + public GET APIs; seed DB
  from `.dc.html` data; switch sections to fetch from API (ISR).
- **M3 — Auth + Admin**: JWT auth; `/admin` route group with login; form CRUD for profile,
  projects, skills, achievements, socials, experiences, resources.
- **M4 — Blog**: BlogPost model; admin markdown editor; public `/blog` + `/blog/[slug]`; full
  SEO (metadata, OG image, JSON-LD Article, sitemap, RSS).
- **M5 — Polish + Deploy**: finish remaining animations; accessibility (focus-visible,
  keyboard, reduced-motion); responsive; EN/VI i18n; site-wide SEO; deploy.

### Deploy (proposed)
- `web` → Vercel. `api` + Postgres → Railway / Render / Fly.io (or self-hosted VPS + Docker).
- Env: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`.

## 5. Verification (end-to-end)
1. `docker compose up -d postgres` → `pnpm --filter api prisma migrate dev && prisma db seed`.
2. `pnpm dev` (web :3000, api :3001). Public page matches original visuals (colors/fonts/
   animations), responsive at 900px/560px, reduced-motion works.
3. Log into `/admin` → create a BlogPost + a Project → reload public page, new content appears.
4. SEO: blog post source has `<title>`, meta description, OG tags, JSON-LD; `/sitemap.xml`
   and `/robots.txt` resolve.
5. Tests: NestJS e2e for auth + CRUD; Playwright smoke test for web; Lighthouse
   SEO/Perf/A11y > 90 on the public page.
