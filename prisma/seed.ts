import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed a couple of demo users
  await prisma.user.upsert({
    where: { id: 'S1234' },
    update: {},
    create: { id: 'S1234', displayName: 'Demo Student 1', totalPoints: 20 },
  });
  await prisma.user.upsert({
    where: { id: 'S5678' },
    update: {},
    create: { id: 'S5678', displayName: 'Demo Student 2', totalPoints: 45 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

