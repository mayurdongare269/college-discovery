import { PrismaClient, ExamType, Category } from '@prisma/client';

const prisma = new PrismaClient();

const branches = [
  'Computer Science and Engineering',
  'Information Technology',
  'AI and Data Science',
  'Electronics and Communication',
  'Mechanical',
  'Civil',
];

function getJEEAdvancedCutoff(category: Category, year: number): number {
  let baseScore = 0;
  // JEE Advanced percentile (extremely competitive, top 2-3%)
  switch (category) {
    case Category.OPEN: baseScore = 97 + Math.random() * 2.5; break;
    case Category.OBC:  baseScore = 94 + Math.random() * 3;   break;
    case Category.EWS:  baseScore = 95 + Math.random() * 2.5; break;
    case Category.SC:   baseScore = 88 + Math.random() * 7;   break;
    case Category.ST:   baseScore = 85 + Math.random() * 8;   break;
  }
  const yearAdj = (year - 2023) * 0.3;
  return Math.round((baseScore + yearAdj) * 100) / 100;
}

async function main() {
  console.log('Fixing IIT cutoffs...');

  // Get all IIT colleges
  const iits = await prisma.college.findMany({
    where: { acceptedExams: { contains: 'JEE_ADVANCED' } },
    include: { courses: true },
  });

  console.log(`Found ${iits.length} IIT colleges`);

  // Delete existing JEE_MAIN cutoffs for IITs (they should only use JEE_ADVANCED)
  for (const iit of iits) {
    const courseIds = iit.courses.map(c => c.id);
    
    // Delete old JEE_MAIN / MHT_CET cutoffs
    await prisma.cutoff.deleteMany({
      where: {
        courseId: { in: courseIds },
        examType: { in: [ExamType.JEE_MAIN, ExamType.MHT_CET] },
      },
    });

    // Create JEE_ADVANCED cutoffs
    const cutoffData = [];
    for (const course of iit.courses) {
      for (const year of [2023, 2024, 2025]) {
        for (const category of [Category.OPEN, Category.OBC, Category.EWS, Category.SC, Category.ST]) {
          const branchName = branches[Math.floor(Math.random() * branches.length)];
          cutoffData.push({
            examType: ExamType.JEE_ADVANCED,
            category,
            branch: branchName,
            cutoffScore: getJEEAdvancedCutoff(category, year),
            year,
            courseId: course.id,
          });
        }
      }
    }

    await prisma.cutoff.createMany({ data: cutoffData });
    console.log(`✓ Fixed cutoffs for ${iit.shortName} (${cutoffData.length} entries)`);
  }

  // Verify
  const counts = await Promise.all([
    prisma.cutoff.count({ where: { examType: 'MHT_CET' } }),
    prisma.cutoff.count({ where: { examType: 'JEE_MAIN' } }),
    prisma.cutoff.count({ where: { examType: 'JEE_ADVANCED' } }),
  ]);
  console.log('\n=== Updated Counts ===');
  console.log('MHT_CET:', counts[0]);
  console.log('JEE_MAIN:', counts[1]);
  console.log('JEE_ADVANCED:', counts[2]);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
