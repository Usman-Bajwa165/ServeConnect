import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@gmail.com' },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 12),
        fullName: 'System Administrator',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin seeded');
  } else {
    console.log('ℹ️ Admin already exists, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
