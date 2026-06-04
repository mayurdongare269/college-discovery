import { prisma } from '../lib/prisma';

async function main() {
  const mhtCet = await prisma.cutoff.count({ where: { examType: 'MHT_CET' } });
  const jeeMain = await prisma.cutoff.count({ where: { examType: 'JEE_MAIN' } });
  const jeeAdv = await prisma.cutoff.count({ where: { examType: 'JEE_ADVANCED' } });
  const totalColleges = await prisma.college.count();
  const maharashtraColleges = await prisma.college.count({ where: { state: 'Maharashtra' } });
  const iits = await prisma.college.count({ where: { acceptedExams: { contains: 'JEE_ADVANCED' } } });
  
  console.log('=== DATABASE STATUS ===');
  console.log('Total colleges:', totalColleges);
  console.log('Maharashtra colleges:', maharashtraColleges);
  console.log('IIT colleges (JEE_ADVANCED):', iits);
  console.log('MHT_CET cutoffs:', mhtCet);
  console.log('JEE_MAIN cutoffs:', jeeMain);
  console.log('JEE_ADVANCED cutoffs:', jeeAdv);
  
  // Sample colleges with their examTypes
  const sample = await prisma.college.findMany({ take: 5, select: { shortName: true, acceptedExams: true } });
  console.log('\nSample acceptedExams:', sample);
  
  await prisma.$disconnect();
}

main().catch(console.error);
