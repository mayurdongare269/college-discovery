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
  switch (category) {
    case Category.OPEN: baseScore = 97 + Math.random() * 2.5; break;
    case Category.OBC:  baseScore = 94 + Math.random() * 3;   break;
    case Category.EWS:  baseScore = 95 + Math.random() * 2.5; break;
    case Category.SC:   baseScore = 88 + Math.random() * 7;   break;
    case Category.ST:   baseScore = 85 + Math.random() * 8;   break;
  }
  return Math.round((baseScore + (year - 2023) * 0.3) * 100) / 100;
}

async function main() {
  // All colleges that should be JEE_ADVANCED but were missed
  const iitNames = ['IIT Delhi'];

  for (const name of iitNames) {
    const college = await prisma.college.findFirst({
      where: { shortName: name },
      include: { courses: true },
    });
    if (!college) { console.log(`Not found: ${name}`); continue; }

    // Fix acceptedExams
    await prisma.college.update({
      where: { id: college.id },
      data: { acceptedExams: 'JEE_ADVANCED' },
    });

    // Remove JEE_MAIN / MHT_CET cutoffs
    const courseIds = college.courses.map(c => c.id);
    await prisma.cutoff.deleteMany({
      where: { courseId: { in: courseIds }, examType: { in: [ExamType.JEE_MAIN, ExamType.MHT_CET] } },
    });

    // Add JEE_ADVANCED cutoffs
    const cutoffData = [];
    for (const course of college.courses) {
      for (const year of [2023, 2024, 2025]) {
        for (const category of Object.values(Category) as Category[]) {
          cutoffData.push({
            examType: ExamType.JEE_ADVANCED,
            category,
            branch: branches[Math.floor(Math.random() * branches.length)],
            cutoffScore: getJEEAdvancedCutoff(category, year),
            year,
            courseId: course.id,
          });
        }
      }
    }
    await prisma.cutoff.createMany({ data: cutoffData });
    console.log(`✓ Fixed ${name} — ${cutoffData.length} JEE_ADVANCED cutoffs added`);
  }

  // Final summary
  const jeeAdv = await prisma.cutoff.count({ where: { examType: 'JEE_ADVANCED' } });
  const iits = await prisma.college.findMany({
    where: { acceptedExams: { contains: 'JEE_ADVANCED' } },
    select: { shortName: true },
  });
  console.log('\nJEE_ADVANCED cutoffs total:', jeeAdv);
  console.log('IIT colleges:', iits.map(c => c.shortName));

  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
