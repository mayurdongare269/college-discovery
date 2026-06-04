import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateMatchScore, generateRecommendationReason } from '@/lib/ai-service';

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
    const budget = parseFloat(searchParams.get('budget') || '0');

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

    // Fetch colleges with cutoffs (check multiple years for better results)
    const colleges = await prisma.college.findMany({
      where,
      include: {
        courses: {
          include: {
            cutoffs: {
              where: {
                examType: examType as any,
                category: category as any,
                year: { in: [2023, 2024, 2025] }, // Multiple years for better coverage
                ...(preferredBranch && {
                  branch: {
                    contains: preferredBranch,
                    mode: 'insensitive',
                  },
                }),
              },
              orderBy: [
                { year: 'desc' }, // Latest year first
                { cutoffScore: 'asc' },
              ],
              take: 3, // Get multiple cutoffs per course
            },
          },
        },
      },
    });

    // Categorize colleges with more flexible criteria
    const safe: any[] = [];
    const target: any[] = [];
    const dream: any[] = [];

    colleges.forEach((college) => {
      // Find minimum cutoff for this college across all years and courses
      let minCutoff = Infinity;
      let relevantCourseName: string | undefined;
      let latestYear = 0;
      
      college.courses.forEach((course) => {
        course.cutoffs.forEach((cutoff) => {
          if (cutoff.cutoffScore < minCutoff) {
            minCutoff = cutoff.cutoffScore;
            relevantCourseName = course.name;
            latestYear = cutoff.year;
          }
        });
      });

      if (minCutoff === Infinity) return; // No cutoff data

      const matchScore = calculateMatchScore(
        college,
        score,
        minCutoff,
        preferredBranch,
        preferredState,
        budget > 0 ? budget : undefined
      );

      const reason = generateRecommendationReason(
        college,
        score,
        minCutoff,
        matchScore,
        preferredBranch
      );

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
        type: college.type,
        ownership: college.ownership,
        cutoff: minCutoff,
        difference: score - minCutoff,
        matchScore,
        reason,
        relevantCourse: relevantCourseName,
        latestCutoffYear: latestYear,
        courses: college.courses.map((c: any) => ({
          id: c.id,
          name: c.name,
          duration: c.duration,
          seats: c.seats,
        })),
      };

      // More flexible categorization thresholds
      const diff = score - minCutoff;
      
      if (diff >= 5) {
        // Score is 5+ percentile above cutoff - Safe
        safe.push(collegeData);
      } else if (diff >= -5) {
        // Score is within 5 percentile range - Target
        target.push(collegeData);
      } else if (diff >= -20) {
        // Score is within 20 percentile below - Dream
        dream.push(collegeData);
      }
      // Colleges with score more than 20 percentile below are not included
    });

    // Sort by match score
    safe.sort((a, b) => b.matchScore - a.matchScore);
    target.sort((a, b) => b.matchScore - a.matchScore);
    dream.sort((a, b) => b.matchScore - a.matchScore);

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
