-- AlterTable
ALTER TABLE "SeoSettings" ADD COLUMN     "githubUsername" TEXT;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "basis" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'evidence';

-- CreateTable
CREATE TABLE "GithubStats" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "publicRepos" INTEGER NOT NULL DEFAULT 0,
    "totalStars" INTEGER NOT NULL DEFAULT 0,
    "memberSince" TEXT,
    "topLanguages" JSONB NOT NULL DEFAULT '[]',
    "topRepos" JSONB NOT NULL DEFAULT '[]',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubStats_pkey" PRIMARY KEY ("id")
);
