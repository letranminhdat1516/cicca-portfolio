# NestJS API — build context is the monorepo root.
FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS build
# Manifests first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/
COPY packages/design-tokens/package.json packages/design-tokens/
RUN pnpm install --frozen-lockfile
# Sources
COPY packages packages
COPY apps/api apps/api
RUN pnpm --filter @portfolio/api exec prisma generate
RUN pnpm --filter @portfolio/api build

# Runtime carries the full build (incl. generated Prisma client + prisma CLI for
# migrate/seed). Same alpine base so the musl Prisma engine matches.
FROM build AS run
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3001
# Apply migrations on boot, then start.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main"]
