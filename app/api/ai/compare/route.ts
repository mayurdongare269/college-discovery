import { NextRequest, NextResponse } from 'next/server';
import { generateCollegeComparison } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { collegeIds } = await request.json();

    if (!collegeIds || collegeIds.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least 2 colleges required for comparison' },
        { status: 400 }
      );
    }

    // Fetch colleges with details
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: collegeIds.map((id: string) => parseInt(id)) },
      },
      include: {
        courses: {
          include: {
            cutoffs: {
              where: { year: 2024 },
              orderBy: { cutoffScore: 'asc' },
              take: 5,
            },
          },
        },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Could not find colleges' },
        { status: 404 }
      );
    }

    // Generate AI comparison
    const comparison = await generateCollegeComparison(colleges);

    if (!comparison.success) {
      return NextResponse.json(
        { success: false, error: comparison.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        comparison: comparison.data,
        colleges: colleges.map(c => ({
          id: c.id,
          name: c.name,
          shortName: c.shortName,
          location: c.location,
          fees: c.fees,
          rating: c.rating,
          placementScore: c.placementScore,
          nirfRank: c.nirfRank,
        })),
        provider: comparison.provider,
      },
    });
  } catch (error) {
    console.error('AI Comparison error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate comparison' },
      { status: 500 }
    );
  }
}
