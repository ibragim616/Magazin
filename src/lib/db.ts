import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let dbPath = path.join(process.cwd(), 'dev.db');

if (process.env.NODE_ENV === 'production') {
  // Vercel serverless functions are read-only, except for /tmp
  const tmpDir = process.platform === 'win32' ? require('os').tmpdir() : '/tmp';
  const tmpDbPath = path.join(tmpDir, 'dev.db');
  const localDbPath = dbPath;
  
  try {
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(localDbPath)) {
        fs.copyFileSync(localDbPath, tmpDbPath);
      } else {
        fs.writeFileSync(tmpDbPath, '');
      }
    }
  } catch (err) {
    console.error("Error copying DB:", err);
  }
  
  dbPath = tmpDbPath;
}

const sqlite = new Database(dbPath);
const adapter = new PrismaBetterSqlite3(sqlite);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export default db;
