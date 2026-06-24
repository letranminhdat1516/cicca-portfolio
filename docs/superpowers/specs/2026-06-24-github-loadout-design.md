# GitHub Integration + Evidence-Grounded Loadout — Design

**Date:** 2026-06-24
**Project:** PLAYER_01.sys portfolio
**Status:** Approved (hybrid approach; user chose unauth + auto-derived language levels)

## Problem

Two issues:
1. The site has no link to the developer's real GitHub activity (no objective proof).
2. EQUIPPED LOADOUT skill `level` (0–100) and `rarity` are hand-typed with no stated basis, so they read as arbitrary.

## Decisions

- **GitHub API: unauthenticated** public REST, results cached in Postgres (24h TTL) to stay under
  the 60 req/hr limit and survive rate-limits/outages. No token, so no contribution-graph and
  language share is computed from each repo's **primary language**, not exact bytes.
- **GitHub display: real numbers, no inflated letter-rank.** Account is modest (26 repos, 10
  followers, 2 stars); an "S/A+" badge would read as inflated and hurt credibility. Show honest
  stats instead.
- **Skill levels: auto-derived from GitHub for matching language skills.** Only skills whose name
  matches a detected GitHub language are recomputed. Unmatched GitHub languages appear in the
  GitHub section only (never injected into the loadout). A skill with `source = "self"` is pinned
  and skipped by the sync.
- **Rarity is derived from level** (single source of truth), replacing the independent hand-set rarity.

## Username

`letranminhdat1516` (stored in `SeoSettings.githubUsername`, editable in admin).

## Part 1 — Backend (`github` module, NestJS)

### Data model (Prisma)
- `GithubStats` singleton (`id = 1`): `username`, `name`, `avatarUrl`, `followers`, `publicRepos`,
  `totalStars`, `memberSince`, `topLanguages` (Json: `[{name, repos, pct}]`),
  `topRepos` (Json: `[{name, url, stars, forks, language, description}]`), `fetchedAt`.
- `Skill` gains: `source` (`"github" | "evidence" | "self"`, default `"evidence"`) and
  `basis` (String?, e.g. `"Primary language in 4 public repos"`).
- `SeoSettings` gains `githubUsername` (String?).

### Service
- `fetchAndCache(username)`: GET `/users/{u}` + `/users/{u}/repos?per_page=100&sort=pushed`
  (paginate if needed). Exclude forks. Aggregate stars, languages (count repos per primary
  language → pct), top 6 repos by stars. Write `GithubStats`. On failure return existing cache.
- `getStats()`: return cache; refetch if `fetchedAt` older than 24h.
- `syncSkillLevels()`: for each detected language with weight `w = Σ(1 + log2(1+stars))` per repo,
  `maxW = max(w)`; `level = round(45 + 50 * w/maxW)` (≈45–95). For each existing Skill whose name
  case-insensitively equals the language and whose `source !== "self"`: set `level`, derived
  `rarity`, `source = "github"`, `basis = "Primary language in N public repos"`.
- Rarity helper: `legendary ≥ 85, epic ≥ 70, rare ≥ 50, common < 50` (shared, also used in
  content service when returning skills).

### Endpoints
- `GET /content` includes a `github` snapshot (from cache).
- `POST /admin/github/refresh` (JWT): force `fetchAndCache` + `syncSkillLevels`, return fresh stats.
- `githubUsername` editable via `/admin/seo`.

## Part 2 — Web display (`GithubRecord.tsx`)

New homepage section `GITHUB // FIELD RECORD` (placed after Inventory):
- Stat tiles: public repos, total stars, followers, "member since YYYY".
- Top-languages bar (from `topLanguages`).
- Top-repos showcase: up to 6 cards (name links to repo, stars/forks, language, description).
- Hidden entirely if `github` is null (fetch failed and no cache).

## Part 3 — Loadout with basis (`Inventory.tsx`)

- Each skill card shows a small **source badge**: `GH` (github-measured) or `✦` (evidence) and,
  on hover/title, the `basis` string.
- Rarity label/colour now reflects the derived rarity.
- Levels for TypeScript/Python become github-measured; AI/architecture skills keep evidence basis
  (authored `basis` linking to Missions).

## Admin

- New "GitHub" view: current snapshot + "Refresh from GitHub" button; edit `githubUsername`.
- Skill form gains `source` (select) and `basis` (text) fields.

## Data flow

admin sets username → service fetches (cache 24h) → `syncSkillLevels` maps languages → matching
skills → `/content` returns `github` + skills (with `source`/`basis`, derived rarity) → web renders
GitHub section + loadout badges.

## Error handling

Fetch failure / rate-limit / missing username → serve cache or `null`; web hides the GitHub section;
skill sync is a no-op (existing levels stay). Analytics-style: never break the page.

## Testing

- Unit: language aggregation, level formula, rarity derivation, skill-name matching — with a
  fixture GitHub payload (incl. forks excluded, unmatched languages ignored).
- Integration: `/content` includes `github`; refresh updates cache; a matching skill's level/source
  flips after sync; a `source="self"` skill is left untouched.

## Non-goals

- Authenticated GitHub (contribution graph, exact language bytes) — documented upgrade path.
- Auto-creating skills for GitHub languages with no existing skill.
- Letter-grade GitHub rank.
