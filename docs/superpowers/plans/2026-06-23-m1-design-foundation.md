# M1 — Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Port the "Player Profile" design system into the Next.js app — fonts, color tokens, cinematic background, HUD nav, and the Hero section with its signature animations — driven by temporary TS-config data, visually faithful to the original `.dc.html`.

**Architecture:** Tailwind v4 CSS-first theme (`@theme` in globals.css) holds color/font tokens. Reusable client-side animation hooks live in `apps/web/src/hooks`. Presentational sections live in `apps/web/src/components`. Content comes from `apps/web/src/data/profile.ts` (temp; replaced by API in M2).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, next/font/google, Canvas 2D.

## Global Constraints

- Colors (exact): purple `#b026ff`, cyan `#22d3ee`, pink `#ff2d9b`, gold `#ffd23f`, success `#4ade80`, bg `#08070f`, bgAlt `#0a0a12`, text `#e8e8f0`. Source of truth: `@portfolio/design-tokens`.
- Fonts: Orbitron (title), Space Grotesk (ui), Inter (body), JetBrains Mono (mono).
- All animation hooks MUST respect `prefers-reduced-motion` and clean up RAF/listeners on unmount.
- Animations run only client-side (`'use client'`); sections that only render markup stay server components.
- Visual parity target: matches original colors/fonts/layout; responsive at 900px and 560px.

---

### Task 1: Fonts, color tokens, base styles, keyframes

**Files:**
- Modify: `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`

**Interfaces:**
- Produces: CSS vars `--color-purple/cyan/pink/gold/success/bg/bg-alt/text`; font vars `--font-title/ui/body/mono`; global keyframes `gridPan, scan, pulseGlow, floatY, sweep, blink, toastIn, flick`; body bg `#08070f`.

- [ ] **Step 1:** Replace fonts in `layout.tsx` with Orbitron, Space_Grotesk, Inter, JetBrains_Mono (next/font/google), each exposing a CSS variable; set `<html lang="en">` with all four variables; set metadata title/description.
- [ ] **Step 2:** Rewrite `globals.css`: `@import "tailwindcss"`; `@theme { --color-*; --font-* }` mapping tokens; base body `background:#08070f;color:#e8e8f0`; `::selection`; neon scrollbar; all keyframes from original; `@media (prefers-reduced-motion: reduce)` global damping.
- [ ] **Step 3: Verify** `pnpm --filter @portfolio/web build` succeeds; run dev, confirm dark bg + fonts load.
- [ ] **Step 4: Commit** `feat(web): design tokens, fonts, base styles & keyframes`.

---

### Task 2: Temp data config

**Files:**
- Create: `apps/web/src/data/profile.ts`

**Interfaces:**
- Produces: typed exports `profile, stats, counters, missions, skillGroups, achievements, socials, navItems` mirroring the data shapes inventoried from `.dc.html` (see spec §3.2). Used by sections until M2 wires the API.

- [ ] **Step 1:** Define TS types + seed values copied from the original `renderVals()` (name placeholder, classRole, tagline, bio, level 42, xp 7400/10000, 5 radar stats `[95,82,78,64,72]`, 4 counters, 4 missions, 3 skill groups, 5 achievements, 4 socials, 5 nav items).
- [ ] **Step 2: Verify** `tsc`/build passes (imported in later tasks).
- [ ] **Step 3: Commit** `feat(web): temp profile data config`.

---

### Task 3: Animation hooks

**Files:**
- Create: `apps/web/src/hooks/useReducedMotion.ts`, `useParticles.ts`, `useScrollReveal.ts`, `useCountUp.ts`, `useTypewriter.ts`, `useTilt.ts`

**Interfaces:**
- Produces:
  - `useReducedMotion(): boolean`
  - `useParticles(canvasRef, opts?)` — 70-particle field, cyan/purple, wraps edges, glow; no-op when reduced.
  - `useScrollReveal<T extends HTMLElement>(): RefObject<T>` — adds reveal on intersection.
  - `useCountUp(target, durationMs?)` — returns animated number, starts when its ref intersects; returns `{ value, ref }`.
  - `useTypewriter(words: string[], opts?)` — returns currently-typed string with blinking handled by CSS.
  - `useTilt<T extends HTMLElement>()` — returns ref applying 3D perspective tilt on mousemove.

- [ ] **Step 1:** Implement each hook as `'use client'`, porting logic from the original `componentDidMount`; all honor `useReducedMotion()` and clean up in the effect's return.
- [ ] **Step 2: Verify** typecheck via build.
- [ ] **Step 3: Commit** `feat(web): animation hooks (particles, reveal, countup, typewriter, tilt)`.

---

### Task 4: CinematicBg component

**Files:**
- Create: `apps/web/src/components/CinematicBg.tsx`
- Modify: `apps/web/src/app/layout.tsx` (mount `<CinematicBg />` behind content)

**Interfaces:**
- Consumes: `useParticles`.
- Produces: fixed full-viewport background (z-0): radial purple+cyan glow, animated 60px grid (masked), particle `<canvas id="bgCanvas">`, scanline overlay. Content wrapper sits at z-10.

- [ ] **Step 1:** Build `CinematicBg` (`'use client'`) replicating the original fixed background div + canvas + scanline; wire `useParticles`.
- [ ] **Step 2:** In `layout.tsx`, render `<CinematicBg />` then a `relative z-10` wrapper around `{children}`.
- [ ] **Step 3: Verify** dev shows animated grid + drifting particles over dark bg; reduced-motion stops them.
- [ ] **Step 4: Commit** `feat(web): cinematic animated background`.

---

### Task 5: HUD nav

**Files:**
- Create: `apps/web/src/components/HudNav.tsx`
- Modify: `apps/web/src/app/layout.tsx` (mount above content)

**Interfaces:**
- Consumes: `navItems` from data config.
- Produces: fixed top nav: brand `P1` + `PLAYER_01.sys`, anchor links to `#about/#missions/#inventory/#trophies/#contact`, and a top scroll-progress bar (gradient cyan→purple→pink) tracking scroll %.

- [ ] **Step 1:** Build `HudNav` (`'use client'` for scroll listener) with brand, links, and scroll-progress bar; hover underline cyan.
- [ ] **Step 2:** Mount in `layout.tsx`.
- [ ] **Step 3: Verify** nav sticks; progress bar fills on scroll; links jump to sections.
- [ ] **Step 4: Commit** `feat(web): HUD sticky nav + scroll progress`.

---

### Task 6: Hero section

**Files:**
- Create: `apps/web/src/components/Hero.tsx`, `apps/web/src/components/XpBar.tsx`
- Modify: `apps/web/src/app/page.tsx` (render `<Hero />`)

**Interfaces:**
- Consumes: `profile` data; `useTypewriter`, `useCountUp`.
- Produces: 2-col hero (status line + name + typed class line w/ blinking caret + tagline + XP bar + CTAs + socials | hexagon avatar + animated level + region). Collapses to 1 col < 900px.

- [ ] **Step 1:** Build `XpBar` (animated fill to `xpCurrent/xpMax`, count-up label).
- [ ] **Step 2:** Build `Hero` replicating the original player-card layout, fonts, glow, clip-paths; typed role via `useTypewriter`; level via `useCountUp`.
- [ ] **Step 3:** Replace `page.tsx` body with `<Hero />` (keep API health check removed; that was scaffold-only).
- [ ] **Step 4: Verify** dev shows hero matching original look; responsive < 900px; reduced-motion safe.
- [ ] **Step 5: Commit** `feat(web): hero player-card section with XP bar & typed role`.

---

## Self-Review

**Spec coverage (M1 of spec §4):** tokens/fonts/Tailwind ✓ (T1); CinematicBg ✓ (T4); HudNav ✓ (T5); Hero + animation hooks ✓ (T3,T6); temp TS data ✓ (T2). Remaining sections (about/missions/inventory/trophies/contact) are deferred to a follow-up M1.5 or folded into M2 wiring — noted, not silently dropped.

**Placeholder scan:** Player name stays a deliberate placeholder (owner fills via admin in M3); not a plan placeholder.

**Type consistency:** hook signatures above are the contract used by T4/T6; data export names in T2 match consumers in T5/T6.
