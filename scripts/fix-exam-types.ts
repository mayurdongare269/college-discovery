import { PrismaClient, ExamType, Category } from '@prisma/client';

const prisma = new PrismaClient();

// These colleges were wrongly tagged as JEE_ADVANCED — fix them back to JEE_MAIN
const wronglyTagged = ['LNMIIT', 'IITRAM', 'KIIT', 'JIIT Noida'];

const branches = [
  'Computer Science and Engineering',
  'Information Technology',
  'AI and Data Science',
  'Electronics and Communication',
  'Mechanical',
  'Civil',
];

function getJEEMainCutoff(category: Category, year: number): number {
  let baseScore = 0;
  switch (category) {
    case Category.OPEN: baseScore = 92 + Math.random() * 7.5; break;
    case Category.OBC:  baseScore = 80 + Math.random() * 10;  break;
    case Category.EWS:  baseScore = 85 + Math.random() * 8;   break;
    case Category.SC:   baseScore = 65 + Math.random() * 18;  break;
    case Category.ST:   baseScore = 60 + Math.random() * 18;  break;
  }
  return Math.round((baseScore + (year - 2023) * 0.5) * 100) / 100;
}

async function main() {
  console.log('Fixing wrongly-tagged colleges...');

  // Fix acceptedExams back to JEE_MAIN
  await prisma.college.updateMany({
    where: { shortName: { in: wronglyTagged } },
    data: { acceptedExams: 'JEE_MAIN' },
  });
  console.log('✓ Reverted acceptedExams to JEE_MAIN');

  // Get those colleges and fix their cutoffs
  const colleges = await prisma.college.findMany({
    where: { shortName: { in: wronglyTagged } },
    include: { courses: true },
  });

  for (const college of colleges) {
    const courseIds = college.courses.map(c => c.id);

    // Remove JEE_ADVANCED cutoffs
    await prisma.cutoff.deleteMany({
      where: { courseId: { in: courseIds }, examType: ExamType.JEE_ADVANCED },
    });

    // Add JEE_MAIN cutoffs
    const cutoffData = [];
    for (const course of college.courses) {
      for (const year of [2023, 2024, 2025]) {
        for (const category of [Category.OPEN, Category.OBC, Category.EWS, Category.SC, Category.ST]) {
          const branchName = branches[Math.floor(Math.random() * branches.length)];
          cutoffData.push({
            examType: ExamType.JEE_MAIN,
            category,
            branch: branchName,
            cutoffScore: getJEEMainCutoff(category, year),
            year,
            courseId: course.id,
          });
        }
      }
    }
    await prisma.cutoff.createMany({ data: cutoffData });
    console.log(`✓ Fixed ${college.shortName}`);
  }

  // Final counts
  const counts = await Promise.all([
    prisma.cutoff.count({ where: { examType: 'MHT_CET' } }),
    prisma.cutoff.count({ where: { examType: 'JEE_MAIN' } }),
    prisma.cutoff.count({ where: { examType: 'JEE_ADVANCED' } }),
  ]);
  const iits = await prisma.college.findMany({
    where: { acceptedExams: { contains: 'JEE_ADVANCED' } },
    select: { shortName: true, acceptedExams: true },
  });

  console.log('\n=== Final Counts ===');
  console.log('MHT_CET:', counts[0]);
  console.log('JEE_MAIN:', counts[1]);
  console.log('JEE_ADVANCED:', counts[2]);
  console.log('\nIIT colleges:', iits.map(c => c.shortName));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
