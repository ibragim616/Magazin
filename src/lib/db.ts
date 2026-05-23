import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import os from 'os';

let dbPath = './dev.db';

if (process.env.NODE_ENV === 'production') {
  const tmpDir = process.platform === 'win32' ? os.tmpdir() : '/tmp';
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

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${dbPath}`;
}

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export default db;
