import { PrismaClient } from '@prisma/client';
import { applyCvContent } from './content/cv';

// Push the CV content (prisma/content/cv.ts) into an existing database without
// touching the admin account, blog posts or analytics.
//   pnpm --filter @portfolio/api exec ts-node prisma/sync-cv.ts
const prisma = new PrismaClient();

applyCvContent(prisma)
  .then(() => console.log('CV content synced.'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
