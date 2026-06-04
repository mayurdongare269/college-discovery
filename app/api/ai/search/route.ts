import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    const q = query.toLowerCase();

    // Smart keyword extraction for semantic-like search
    const examKeywords: Record<string, string> = {
      'jee': 'JEE_MAIN',
      'jee main': 'JEE_MAIN',
      'jee advanced': 'JEE_ADVANCED',
      'mht': 'MHT_CET',
      'mhtcet': 'MHT_CET',
      'mht cet': 'MHT_CET',
      'iit': 'JEE_ADVANCED',
    };

    const branchKeywords: Record<string, string> = {
      'computer': 'Computer',
      'cse': 'Computer',
      'cs': 'Computer',
      'it': 'Information Technology',
      'ai': 'AI',
      'data science': 'AI',
      'machine learning': 'AI',
      'electronics': 'Electronics',
      'mechanical': 'Mechanical',
      'civil': 'Civil',
    };

    // Detect if budget-related
    const isBudgetQuery = q.includes('cheap') || q.includes('affordable') || 
                          q.includes('under') || q.includes('below') || 
                          q.includes('lakh') || q.includes('low fees');

    // Extract budget amount
    let maxBudget: number | null = null;
    const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*lakh/);
    if (lakhMatch) {
      maxBudget = parseFloat(lakhMatch[1]) * 100000;
    }
    
    // Detect placement quality query
    const isPlacementQuery = q.includes('placement') || q.includes('job') || 
                              q.includes('salary') || q.includes('package');

    // Detect top/best query
    const isTopQuery = q.includes('top') || q.includes('best') || q.includes('ranked');

    // Build Prisma where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { shortName: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } },
        { type: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Check for exam type in query
    let detectedExam: string | null = null;
    for (const [keyword, examValue] of Object.entries(examKeywords)) {
      if (q.includes(keyword)) {
        detectedExam = examValue;
        break;
      }
    }

    if (detectedExam) {
      where.acceptedExams = { contains: detectedExam };
      delete where.OR; // Use exam filter as primary
    }

    // Check for branch in query
    let detectedBranch: string | null = null;
    for (const [keyword, branchValue] of Object.entries(branchKeywords)) {
      if (q.includes(keyword)) {
        detectedBranch = branchValue;
        break;
      }
    }

    if (detectedBranch) {
      where.courses = {
        some: {
          name: { contains: detectedBranch, mode: 'insensitive' },
        },
      };
    }

    // Budget filter
    if (maxBudget) {
      where.fees = { lte: maxBudget };
      delete where.OR;
    }

    // Ordering
    let orderBy: any = { nirfRank: 'asc' };
    if (isPlacementQuery) {
      orderBy = { placementScore: 'desc' };
    } else if (isTopQuery) {
      orderBy = [{ nirfRank: 'asc' }, { rating: 'desc' }];
    } else if (isBudgetQuery) {
      orderBy = { fees: 'asc' };
    }

    const colleges = await prisma.college.findMany({
      where,
      take: limit,
      include: {
        courses: {
          select: { name: true },
          take: 3,
        },
      },
      orderBy,
    });

    return NextResponse.json({
      success: true,
      data: colleges,
      total: colleges.length,
      query,
    });
  } catch (error) {
    console.error('AI Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
