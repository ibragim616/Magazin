import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = "file:./dev.db";

if (process.env.NODE_ENV === 'production') {
  // Vercel serverless functions are read-only, except for /tmp
  const tmpDbPath = '/tmp/dev.db';
  const localDbPath = path.join(process.cwd(), 'dev.db');
  
  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(localDbPath)) {
        fs.copyFileSync(localDbPath, tmpDbPath);
      } else {
        // If it doesn't exist, just create an empty file or let Prisma handle it
        fs.writeFileSync(tmpDbPath, '');
      }
    }
  } catch (err) {
    console.error("Error copying DB to /tmp:", err);
  }
  
  dbUrl = `file:${tmpDbPath}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export default db;
