import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const libsql = createClient({
  url: 'file:dev.db'
});

const adapter = new PrismaLibSql(libsql);
process.env.DATABASE_URL = 'file:./dev.db';
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main().catch(console.error);
