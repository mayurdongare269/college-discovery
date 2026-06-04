import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const iits = await prisma.college.findMany({
    where: { name: { contains: 'Institute of Technology' } },
    select: { shortName: true, acceptedExams: true },
    orderBy: { shortName: 'asc' },
  });
  console.log('IIT-type colleges and their acceptedExams:');
  iits.forEach(c => console.log(`  ${c.shortName}: ${c.acceptedExams}`));

  const iitDelhiCheck = await prisma.college.findFirst({
    where: { shortName: 'IIT Delhi' },
    select: { shortName: true, acceptedExams: true },
  });
  console.log('\nIIT Delhi:', iitDelhiCheck);

  await prisma.$disconnect();
}
main().catch(console.error);
