# Next.js web — build context is the monorepo root.
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS build
# Manifests first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
COPY packages/design-tokens/package.json packages/design-tokens/
RUN pnpm install --frozen-lockfile
# Sources
COPY packages packages
COPY apps/web apps/web
# Baked at build time — rebuild the image whenever the domain or API host changes:
#  - NEXT_PUBLIC_* are inlined into the browser bundle (tracker, admin, SEO URLs)
#  - API_INTERNAL_URL is the /api/* rewrite target (Next evaluates rewrites at build)
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_SITE_URL=""
ARG API_INTERNAL_URL="http://portfolio-api:3001"
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV API_INTERNAL_URL=$API_INTERNAL_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @portfolio/web build

# Minimal runtime from the standalone output.
FROM base AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
