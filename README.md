# PLAYER_01.sys — Portfolio

A game/cyberpunk-themed developer portfolio with a real backend and admin CMS.

- **Frontend** — Next.js 16 (App Router), React 19, Tailwind v4. SEO-friendly via SSG/ISR.
- **Backend** — NestJS + Prisma + PostgreSQL.
- **Admin** — JWT-protected `/admin` panel to edit all content (profile, projects, skills,
  achievements, socials, experiences, resources, blog) without touching code.
- **Blog** — markdown posts with per-post metadata, OpenGraph, JSON-LD, and a sitemap.

## Monorepo layout

```
apps/
  web/    Next.js — public site (route group "(site)") + /admin
  api/    NestJS — REST API + auth + Prisma
packages/
  design-tokens/   shared colors & fonts
  types/           shared TS types (Portfolio, BlogPost, …)
docs/superpowers/  design spec + implementation plans
```

## Prerequisites

- Node >= 20, pnpm 9, Docker (for Postgres).

## Setup

```bash
cp .env.example .env            # then edit secrets
# generate a strong JWT secret:
openssl rand -hex 32            # paste into JWT_SECRET in .env AND apps/api/.env

pnpm install
docker compose up -d postgres   # starts Postgres on :5432

# database: migrate + seed (creates the admin user from ADMIN_EMAIL/ADMIN_PASSWORD)
pnpm --filter @portfolio/api prisma migrate dev
pnpm --filter @portfolio/api prisma db seed
```

> `apps/api/.env` needs `DATABASE_URL` and `JWT_SECRET` for the Prisma CLI and runtime.
> The API refuses to start if `JWT_SECRET` is missing or shorter than 16 characters.

## Run (dev)

```bash
pnpm dev          # turbo runs web (:3000) + api (:3001)
```

- Public site → http://localhost:3000
- Admin → http://localhost:3000/admin  (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- API → http://localhost:3001 (`/health`, `/content`, `/blog`, `/auth/login`, `/admin/*`)

## Build

```bash
pnpm --filter @portfolio/api build
# the web build fetches the API to prerender pages, so the API must be reachable:
pnpm --filter @portfolio/api start &     # or have it running
pnpm --filter @portfolio/web build
```

## Environment variables

| Var | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | api | Postgres connection string |
| `JWT_SECRET` | api | >=16 chars; generate with `openssl rand -hex 32` |
| `CORS_ORIGINS` | api | comma-separated allowed origins (default `http://localhost:3000`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | api (seed) | the single admin account |
| `NEXT_PUBLIC_API_URL` | web | base URL of the API |
| `NEXT_PUBLIC_SITE_URL` | web | public site URL (used in sitemap) |

## Deploy (suggested)

- **web** → Vercel (Next.js native; set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`).
- **api + Postgres** → Railway / Render / Fly.io, or a VPS with Docker Compose.
  Set `DATABASE_URL`, a strong `JWT_SECRET`, `CORS_ORIGINS` (your web origin),
  `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Run `prisma migrate deploy` then `prisma db seed`.

## Content editing

Log into `/admin`. Each collection has a JSON editor per item plus an "Add" form;
the profile has its own editor. Changes hit the API and appear on the public site
within the ISR window (~60s) or immediately on next request.
```
