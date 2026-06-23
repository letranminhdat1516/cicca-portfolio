# M0 — Monorepo Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a pnpm + Turborepo monorepo with a Next.js web app, a NestJS API (Prisma + Postgres), and two shared packages, so `pnpm dev` brings both apps up and the API connects to a running Postgres.

**Architecture:** Single repo, pnpm workspaces orchestrated by Turborepo. `apps/web` (Next.js App Router, TS, Tailwind) and `apps/api` (NestJS, TS, Prisma). `packages/design-tokens` and `packages/types` are shared internal libs. Postgres runs via docker-compose for local dev.

**Tech Stack:** pnpm 9, Turborepo, Next.js (App Router) + TypeScript + Tailwind, NestJS + TypeScript, Prisma, Postgres 16 (docker), Node 25.

## Global Constraints

- Package manager: **pnpm** only (no npm/yarn lockfiles committed).
- Node engine: **>=20** (dev machine is 25.6.1).
- All apps/packages TypeScript, `strict: true`.
- Ports: web **3000**, api **3001**, Postgres **5432**.
- Internal packages referenced via workspace protocol `workspace:*`.
- No secrets committed: real values live in `.env` (gitignored); `.env.example` is committed.

---

### Task 1: Monorepo root + git

**Files:**
- Create: `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, `.nvmrc`

**Interfaces:**
- Produces: workspace globs `apps/*`, `packages/*`; turbo tasks `dev`, `build`, `lint`. Root scripts `pnpm dev`, `pnpm build`, `pnpm lint`.

- [ ] **Step 1: `git init` and create `.gitignore`**

```bash
cd /Users/cicca/Documents/profile/portfolio
git init
```

`.gitignore`:
```
node_modules/
.next/
dist/
.env
.env*.local
*.log
.DS_Store
.turbo/
coverage/
```

- [ ] **Step 2: Root `package.json`**

```json
{
  "name": "portfolio",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": { "turbo": "^2.3.3" }
}
```

- [ ] **Step 3: `pnpm-workspace.yaml`, `.npmrc`, `.nvmrc`, `turbo.json`**

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```
`.npmrc`: `auto-install-peers=true`
`.nvmrc`: `20`
`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "lint": {}
  }
}
```

- [ ] **Step 4: Verify**

Run: `pnpm install`
Expected: completes, creates `pnpm-lock.yaml`, no app errors (workspaces empty so far).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: init monorepo root (pnpm + turborepo)"
```

---

### Task 2: Postgres via docker-compose

**Files:**
- Create: `docker-compose.yml`, `.env.example`, `.env`

**Interfaces:**
- Produces: Postgres on `localhost:5432`, db `portfolio`, user `portfolio`, password `portfolio`. `DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio?schema=public`.

- [ ] **Step 1: `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: portfolio-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
      POSTGRES_DB: portfolio
    ports:
      - "5432:5432"
    volumes:
      - portfolio-pgdata:/var/lib/postgresql/data
volumes:
  portfolio-pgdata:
```

- [ ] **Step 2: `.env.example` (committed) and `.env` (gitignored)**

Both contain:
```
DATABASE_URL=postgresql://portfolio:portfolio@localhost:5432/portfolio?schema=public
JWT_SECRET=change-me-in-prod
NEXT_PUBLIC_API_URL=http://localhost:3001
API_PORT=3001
```

- [ ] **Step 3: Verify Postgres comes up**

Run: `docker compose up -d postgres && sleep 3 && docker exec portfolio-postgres pg_isready -U portfolio`
Expected: `accepting connections`.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml .env.example && git commit -m "chore: add postgres docker-compose + env example"
```

---

### Task 3: NestJS API app + Prisma

**Files:**
- Create: `apps/api/` (NestJS project), `apps/api/prisma/schema.prisma`, `apps/api/src/prisma/prisma.service.ts`, `apps/api/src/prisma/prisma.module.ts`, `apps/api/src/health/health.controller.ts`
- Modify: `apps/api/src/app.module.ts`, `apps/api/src/main.ts`, `apps/api/package.json`

**Interfaces:**
- Consumes: `DATABASE_URL` from root `.env`.
- Produces: API on port 3001; `GET /health` → `{ status: "ok", db: true }`; `PrismaService` (injectable, extends `PrismaClient`, connects onModuleInit).

- [ ] **Step 1: Scaffold NestJS into `apps/api`**

```bash
cd /Users/cicca/Documents/profile/portfolio/apps
pnpm dlx @nestjs/cli@^10 new api --package-manager pnpm --skip-git
```
Then set `apps/api/package.json` name to `@portfolio/api` and add scripts: `"dev": "nest start --watch"`.

- [ ] **Step 2: Install Prisma + config + dotenv loading**

```bash
cd /Users/cicca/Documents/profile/portfolio/apps/api
pnpm add @prisma/client @nestjs/config && pnpm add -D prisma
pnpm dlx prisma init --datasource-provider postgresql
```
Point Prisma at the root env: in `apps/api/prisma/schema.prisma` datasource, `url = env("DATABASE_URL")`; create `apps/api/.env` symlink-free by loading root env — set `ConfigModule.forRoot({ isGlobal: true, envFilePath: "../../.env" })` in `app.module.ts`. For Prisma CLI, run commands with `dotenv` or copy `DATABASE_URL`; simplest: add `apps/api/.env` containing the same `DATABASE_URL` (gitignored).

- [ ] **Step 3: Minimal Prisma schema (one model to prove migration works)**

`apps/api/prisma/schema.prisma`:
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model Healthcheck {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
}
```

- [ ] **Step 4: PrismaService + module**

`apps/api/src/prisma/prisma.service.ts`:
```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}
```
`apps/api/src/prisma/prisma.module.ts`:
```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
```

- [ ] **Step 5: Health controller**

`apps/api/src/health/health.controller.ts`:
```ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', db: true };
  }
}
```
Register `PrismaModule` and `HealthController` in `app.module.ts`. In `main.ts`: enable CORS, `app.listen(process.env.API_PORT ?? 3001)`.

- [ ] **Step 6: Migrate + run + verify health**

```bash
cd /Users/cicca/Documents/profile/portfolio/apps/api
pnpm prisma migrate dev --name init
pnpm dev &   # nest start --watch
sleep 8 && curl -s http://localhost:3001/health
```
Expected: `{"status":"ok","db":true}`. Stop the bg process after.

- [ ] **Step 7: Commit**

```bash
cd /Users/cicca/Documents/profile/portfolio
git add -A && git commit -m "feat(api): scaffold NestJS + Prisma + health endpoint"
```

---

### Task 4: Next.js web app

**Files:**
- Create: `apps/web/` (Next.js App Router project), `apps/web/src/app/page.tsx` (replaced), `apps/web/src/lib/api.ts`
- Modify: `apps/web/package.json`, `apps/web/next.config.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_API_URL` env.
- Produces: web on port 3000; home page renders a heading and the API health status fetched from `${NEXT_PUBLIC_API_URL}/health`.

- [ ] **Step 1: Scaffold Next.js into `apps/web`**

```bash
cd /Users/cicca/Documents/profile/portfolio/apps
pnpm create next-app@latest web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-pnpm
```
Set `apps/web/package.json` name to `@portfolio/web`; ensure scripts include `"dev": "next dev -p 3000"`.

- [ ] **Step 2: API client helper**

`apps/web/src/lib/api.ts`:
```ts
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
```

- [ ] **Step 3: Home page proves end-to-end fetch**

`apps/web/src/app/page.tsx`:
```tsx
import { apiGet } from '@/lib/api';

export default async function Home() {
  let health = 'unknown';
  try {
    const h = await apiGet<{ status: string }>('/health', { cache: 'no-store' });
    health = h.status;
  } catch { health = 'unreachable'; }
  return (
    <main style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>PLAYER_01.sys — scaffold OK</h1>
      <p>API health: {health}</p>
    </main>
  );
}
```
Add `.env.local` in `apps/web` (gitignored) with `NEXT_PUBLIC_API_URL=http://localhost:3001`.

- [ ] **Step 4: Verify web renders + reaches API**

```bash
# with api running on 3001:
cd /Users/cicca/Documents/profile/portfolio/apps/web && pnpm dev &
sleep 8 && curl -s http://localhost:3000 | grep -o "scaffold OK"
```
Expected: `scaffold OK`. Stop bg process after.

- [ ] **Step 5: Commit**

```bash
cd /Users/cicca/Documents/profile/portfolio
git add -A && git commit -m "feat(web): scaffold Next.js app with API health check"
```

---

### Task 5: Shared packages (design-tokens, types)

**Files:**
- Create: `packages/design-tokens/package.json`, `packages/design-tokens/src/index.ts`, `packages/design-tokens/tsconfig.json`
- Create: `packages/types/package.json`, `packages/types/src/index.ts`, `packages/types/tsconfig.json`
- Modify: `apps/web/package.json` (add deps), `apps/web/src/app/page.tsx` (consume a token)

**Interfaces:**
- Produces:
  - `@portfolio/design-tokens` exports `colors` (`{ purple:'#b026ff', cyan:'#22d3ee', pink:'#ff2d9b', gold:'#ffd23f', success:'#4ade80', bg:'#08070f', bgAlt:'#0a0a12', text:'#e8e8f0' }`), `fonts` (`{ title:'Orbitron', ui:'Space Grotesk', body:'Inter', mono:'JetBrains Mono' }`).
  - `@portfolio/types` exports placeholder interface `Profile` (`{ name: string; classRole: string; tagline: string }`) — expanded in M2.

- [ ] **Step 1: `packages/design-tokens`**

`package.json`:
```json
{ "name": "@portfolio/design-tokens", "version": "0.0.0", "private": true,
  "main": "./src/index.ts", "types": "./src/index.ts" }
```
`src/index.ts`:
```ts
export const colors = {
  purple: '#b026ff', cyan: '#22d3ee', pink: '#ff2d9b', gold: '#ffd23f',
  success: '#4ade80', bg: '#08070f', bgAlt: '#0a0a12', text: '#e8e8f0',
} as const;
export const fonts = {
  title: 'Orbitron', ui: 'Space Grotesk', body: 'Inter', mono: 'JetBrains Mono',
} as const;
```
`tsconfig.json`: `{ "compilerOptions": { "strict": true, "skipLibCheck": true, "module": "esnext", "moduleResolution": "bundler" } }`

- [ ] **Step 2: `packages/types`**

`package.json`:
```json
{ "name": "@portfolio/types", "version": "0.0.0", "private": true,
  "main": "./src/index.ts", "types": "./src/index.ts" }
```
`src/index.ts`:
```ts
export interface Profile { name: string; classRole: string; tagline: string; }
```
`tsconfig.json`: same as design-tokens.

- [ ] **Step 3: Wire into web + consume a token**

In `apps/web/package.json` dependencies add:
```json
"@portfolio/design-tokens": "workspace:*",
"@portfolio/types": "workspace:*"
```
Run `pnpm install` at root. Update `page.tsx` heading style to use `colors.cyan`:
```tsx
import { colors } from '@portfolio/design-tokens';
// ...
<h1 style={{ color: colors.cyan }}>PLAYER_01.sys — scaffold OK</h1>
```

- [ ] **Step 4: Verify build + token applied**

```bash
cd /Users/cicca/Documents/profile/portfolio && pnpm install
cd apps/web && pnpm build
```
Expected: build succeeds (resolves workspace packages). Optionally run dev and confirm cyan heading.

- [ ] **Step 5: Commit**

```bash
cd /Users/cicca/Documents/profile/portfolio
git add -A && git commit -m "feat: add shared design-tokens and types packages"
```

---

### Task 6: Verify `pnpm dev` runs both apps

**Files:**
- Modify: none (turbo already configured); confirm both apps expose a `dev` script.

**Interfaces:**
- Produces: `pnpm dev` at root starts web (3000) + api (3001) concurrently via Turborepo.

- [ ] **Step 1: Start Postgres then `pnpm dev`**

```bash
cd /Users/cicca/Documents/profile/portfolio
docker compose up -d postgres
pnpm dev &
sleep 12
```

- [ ] **Step 2: Verify both endpoints**

```bash
curl -s http://localhost:3001/health
curl -s http://localhost:3000 | grep -o "scaffold OK"
```
Expected: `{"status":"ok","db":true}` and `scaffold OK`. Stop bg process after.

- [ ] **Step 3: Commit any final tweaks**

```bash
git add -A && git commit -m "chore: verify turbo dev runs web + api" --allow-empty
```

---

## Self-Review

**Spec coverage (M0 portion of spec §3 + §4):** monorepo root ✓ (T1), Postgres docker ✓ (T2), NestJS+Prisma ✓ (T3), Next.js ✓ (T4), design-tokens + types packages ✓ (T5), `pnpm dev` both apps ✓ (T6). M0 milestone fully covered. M1–M5 are out of scope for this plan (separate plans).

**Placeholder scan:** No TBD/TODO. The minimal `Healthcheck` model and `Profile` interface are intentional minimal stubs proving the toolchain, expanded in M2 — not placeholders within M0's deliverable.

**Type consistency:** `apiGet<T>` signature consistent across T4/T5; `colors`/`fonts` const objects consistent; `PrismaService` name consistent T3→later.

## Execution
Inline execution chosen (user directive "làm đi"). Proceed task-by-task with verification at each step.
