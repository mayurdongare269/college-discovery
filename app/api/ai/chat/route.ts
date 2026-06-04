import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponseWithWebFallback } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

// ─────────────────────────────────────────────────────────────────────────────
// Keyword maps
// ─────────────────────────────────────────────────────────────────────────────

const EXAM_KEYWORDS: Record<string, string> = {
  'mht cet': 'MHT_CET',
  'mhtcet': 'MHT_CET',
  'mht-cet': 'MHT_CET',
  'mh cet': 'MHT_CET',
  'cet': 'MHT_CET',
  'jee advanced': 'JEE_ADVANCED',
  'jee adv': 'JEE_ADVANCED',
  'iit jee': 'JEE_ADVANCED',
  'jee main': 'JEE_MAIN',
  'jee mains': 'JEE_MAIN',
  'jee': 'JEE_MAIN', // generic jee defaults to JEE_MAIN unless 'advanced' present
};

const BRANCH_KEYWORDS: Record<string, string> = {
  'computer': 'Computer',
  'cse': 'Computer',
  'cs': 'Computer',
  'information technology': 'Information Technology',
  ' it ': 'Information Technology',
  'ai': 'AI',
  'artificial intelligence': 'AI',
  'data science': 'AI',
  'machine learning': 'AI',
  'electronics': 'Electronics',
  'ece': 'Electronics',
  'e&tc': 'Electronics',
  'mechanical': 'Mechanical',
  'mech': 'Mechanical',
  'civil': 'Civil',
};

const STATE_KEYWORDS: Record<string, string> = {
  'maharashtra': 'Maharashtra',
  'pune': 'Maharashtra',
  'mumbai': 'Maharashtra',
  'nagpur': 'Maharashtra',
  'karnataka': 'Karnataka',
  'bangalore': 'Karnataka',
  'bengaluru': 'Karnataka',
  'tamil nadu': 'Tamil Nadu',
  'chennai': 'Tamil Nadu',
  'delhi': 'Delhi',
  'telangana': 'Telangana',
  'hyderabad': 'Telangana',
  'gujarat': 'Gujarat',
  'ahmedabad': 'Gujarat',
  'rajasthan': 'Rajasthan',
};

// ─────────────────────────────────────────────────────────────────────────────
// Detect exam from message
// ─────────────────────────────────────────────────────────────────────────────
function detectExam(q: string): string | null {
  // Check longer phrases first to avoid 'jee' matching before 'jee advanced'
  const sorted = Object.keys(EXAM_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    if (q.includes(kw)) return EXAM_KEYWORDS[kw];
  }
  return null;
}

function detectBranch(q: string): string | null {
  for (const [kw, val] of Object.entries(BRANCH_KEYWORDS)) {
    if (q.includes(kw)) return val;
  }
  return null;
}

function detectState(q: string): string | null {
  for (const [kw, val] of Object.entries(STATE_KEYWORDS)) {
    if (q.includes(kw)) return val;
  }
  return null;
}

function detectBudget(q: string): number | null {
  const m = q.match(/(\d+(?:\.\d+)?)\s*lakh/);
  return m ? parseFloat(m[1]) * 100_000 : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build smart RAG context from DB
// ─────────────────────────────────────────────────────────────────────────────
async function buildRAGContext(message: string): Promise<{ context: string; collegeCount: number }> {
  const q = message.toLowerCase();

  const detectedExam  = detectExam(q);
  const detectedBranch = detectBranch(q);
  const detectedState  = detectState(q);
  const detectedBudget = detectBudget(q);

  // Build where clause that RESPECTS exam type
  const where: any = {};

  if (detectedExam) {
    where.acceptedExams = { contains: detectedExam };
  }

  if (detectedState) {
    where.state = detectedState;
  }

  if (detectedBudget) {
    where.fees = { lte: detectedBudget };
  }

  // Course/branch filter
  if (detectedBranch) {
    where.courses = {
      some: { name: { contains: detectedBranch, mode: 'insensitive' } },
    };
  }

  // Ordering: placement query → sort by placement, else NIRF rank
  const isPlacementQuery = q.includes('placement') || q.includes('package') || q.includes('job');
  const orderBy = isPlacementQuery
    ? { placementScore: 'desc' as const }
    : { nirfRank: 'asc' as const };

  const colleges = await prisma.college.findMany({
    where,
    take: 8, // Increased from 5 for better coverage
    include: {
      courses: {
        include: {
          cutoffs: {
            where: {
              year: { in: [2023, 2024, 2025] },
              ...(detectedExam && { examType: detectedExam as any }),
            },
            orderBy: { year: 'desc' },
            take: 3,
          },
        },
        take: 4,
      },
    },
    orderBy,
  });

  if (colleges.length === 0) {
    return { context: '', collegeCount: 0 };
  }

  const context = colleges
    .map(c => {
      const cutoffLines = c.courses
        .flatMap(course =>
          course.cutoffs.map(
            cut => `  ${course.name} | ${cut.branch} | ${cut.category} | ${cut.examType} | ${cut.cutoffScore}% (${cut.year})`
          )
        )
        .join('\n');

      return [
        `📍 ${c.shortName} — ${c.name}`,
        `   Location : ${c.location}, ${c.state}`,
        `   Type     : ${c.type} (${c.ownership})`,
        `   Fees     : ₹${c.fees.toLocaleString()}/year`,
        `   Rating   : ${c.rating}/5`,
        `   Placement: ${c.placementScore}%`,
        `   NIRF Rank: ${c.nirfRank ?? 'Not ranked'}`,
        `   Exams    : ${c.acceptedExams}`,
        `   Courses  : ${c.courses.map(co => co.name).join(', ')}`,
        cutoffLines ? `   Cutoffs:\n${cutoffLines}` : '   Cutoffs: No cutoff data available',
      ].join('\n');
    })
    .join('\n\n---\n\n');

  return { context, collegeCount: colleges.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { message, context: clientContext } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const q = message.toLowerCase();
    const detectedExam = detectExam(q);

    // Determine if the question needs college data
    const needsCollegeData =
      q.includes('college') ||
      q.includes('admission') ||
      q.includes('cutoff') ||
      q.includes('placement') ||
      q.includes('fees') ||
      q.includes('rank') ||
      q.includes('branch') ||
      q.includes('score') ||
      q.includes('percentile') ||
      q.includes('seat') ||
      detectedExam !== null;

    let dbContext = '';
    let dbCollegeCount = 0;

    if (needsCollegeData) {
      const rag = await buildRAGContext(message);
      dbContext = rag.context;
      dbCollegeCount = rag.collegeCount;
    }

    // Combine DB context + any client-provided context
    const fullContext = [
      dbContext,
      clientContext || '',
    ]
      .filter(Boolean)
      .join('\n\n');

    // Pass detected exam + coverage flag to the LLM
    const aiResponse = await generateAIResponseWithWebFallback(
      message,
      fullContext || undefined,
      {
        detectedExam,
        dbCollegeCount,
        hasEnoughData: dbCollegeCount >= 3,
      }
    );

    if (!aiResponse.success) {
      return NextResponse.json(
        { success: false, error: aiResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse.data,
        provider: aiResponse.provider,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
