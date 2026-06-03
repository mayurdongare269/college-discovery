import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const examType = searchParams.get('examType');
    const score = parseFloat(searchParams.get('score') || '0');
    const category = searchParams.get('category') || 'OPEN';
    const preferredState = searchParams.get('preferredState') || '';
    const preferredBranch = searchParams.get('preferredBranch') || '';

    if (!examType || !score) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {
      acceptedExams: {
        contains: examType,
      },
    };

    if (preferredState) {
      where.state = preferredState;
    }

    // Fetch colleges with cutoffs
    const colleges = await prisma.college.findMany({
      where,
      include: {
        courses: {
          include: {
            cutoffs: {
              where: {
                examType: examType as any,
                category: category as any,
                year: 2024, // Latest year
                ...(preferredBranch && {
                  branch: {
                    contains: preferredBranch,
                    mode: 'insensitive',
                  },
                }),
              },
              orderBy: {
                cutoffScore: 'asc',
              },
              take: 1,
            },
          },
        },
      },
    });

    // Categorize colleges
    const safe: any[] = [];
    const target: any[] = [];
    const dream: any[] = [];

    colleges.forEach((college) => {
      // Find minimum cutoff for this college
      let minCutoff = Infinity;
      college.courses.forEach((course) => {
        course.cutoffs.forEach((cutoff) => {
          if (cutoff.cutoffScore < minCutoff) {
            minCutoff = cutoff.cutoffScore;
          }
        });
      });

      if (minCutoff === Infinity) return; // No cutoff data

      const collegeData = {
        id: college.id,
        name: college.name,
        shortName: college.shortName,
        location: college.location,
        state: college.state,
        fees: college.fees,
        rating: college.rating,
        placementScore: college.placementScore,
        nirfRank: college.nirfRank,
        cutoff: minCutoff,
        difference: score - minCutoff,
      };

      if (score >= minCutoff + 5) {
        safe.push(collegeData);
      } else if (score >= minCutoff - 5) {
        target.push(collegeData);
      } else {
        dream.push(collegeData);
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        safe: safe.slice(0, 10),
        target: target.slice(0, 10),
        dream: dream.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
