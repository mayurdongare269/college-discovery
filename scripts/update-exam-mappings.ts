import { prisma } from '../lib/prisma';

async function updateExamMappings() {
  console.log('Updating exam mappings for colleges...');

  // IITs - JEE Advanced only
  await prisma.college.updateMany({
    where: {
      shortName: {
        contains: 'IIT',
      },
    },
    data: {
      acceptedExams: 'JEE_ADVANCED',
    },
  });
  console.log('✓ Updated IITs to JEE_ADVANCED');

  // NITs - JEE Main
  await prisma.college.updateMany({
    where: {
      shortName: {
        contains: 'NIT',
      },
    },
    data: {
      acceptedExams: 'JEE_MAIN',
    },
  });
  console.log('✓ Updated NITs to JEE_MAIN');

  // IIITs - JEE Main
  await prisma.college.updateMany({
    where: {
      shortName: {
        contains: 'IIIT',
      },
    },
    data: {
      acceptedExams: 'JEE_MAIN',
    },
  });
  console.log('✓ Updated IIITs to JEE_MAIN');

  // Maharashtra colleges - MHT-CET and JEE Main
  await prisma.college.updateMany({
    where: {
      state: 'Maharashtra',
      shortName: {
        notIn: ['IIT Bombay'], // Exclude IITs
      },
    },
    data: {
      acceptedExams: 'MHT_CET,JEE_MAIN',
    },
  });
  console.log('✓ Updated Maharashtra colleges to MHT_CET,JEE_MAIN');

  // BITS Pilani - JEE Main and BITSAT
  await prisma.college.updateMany({
    where: {
      shortName: 'BITS Pilani',
    },
    data: {
      acceptedExams: 'JEE_MAIN',
    },
  });

  // VIT, SRM, Manipal - JEE Main
  await prisma.college.updateMany({
    where: {
      OR: [
        { shortName: { contains: 'VIT' } },
        { shortName: { contains: 'SRM' } },
        { shortName: { contains: 'Manipal' } },
      ],
    },
    data: {
      acceptedExams: 'JEE_MAIN',
    },
  });
  console.log('✓ Updated private colleges');

  // DTU, NSUT, IIITD - JEE Main
  await prisma.college.updateMany({
    where: {
      state: 'Delhi',
    },
    data: {
      acceptedExams: 'JEE_MAIN',
    },
  });
  console.log('✓ Updated Delhi colleges to JEE_MAIN');

  console.log('✓ Exam mappings updated successfully!');
  await prisma.$disconnect();
}

updateExamMappings().catch((error) => {
  console.error('Error updating exam mappings:', error);
  process.exit(1);
});
