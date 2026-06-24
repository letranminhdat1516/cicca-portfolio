-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "device" TEXT,
    "sessionHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'PLAYER_01.sys',
    "defaultTitle" TEXT NOT NULL DEFAULT 'PLAYER_01.sys — Portfolio',
    "defaultDescription" TEXT NOT NULL DEFAULT 'A game-themed developer portfolio: missions, skills, achievements, and a blog.',
    "keywords" TEXT[],
    "ogImageUrl" TEXT,
    "twitterHandle" TEXT,
    "gscVerification" TEXT,
    "llmsTxt" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");
