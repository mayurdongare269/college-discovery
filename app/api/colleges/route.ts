import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Handle single college fetch by ID
    const id = searchParams.get('id');
    if (id) {
      const college = await prisma.college.findUnique({
        where: { id: parseInt(id) },
        include: {
          courses: {
            include: {
              cutoffs: {
                take: 5,
                orderBy: { year: 'desc' },
              },
            },
          },
        },
      });

      if (!college) {
        return NextResponse.json(
          { success: false, error: 'College not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: [college],
      });
    }

    // Regular search/filter logic
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const examType = searchParams.get('examType') || '';
    const course = searchParams.get('course') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    // Filter by exam type - CRITICAL: Only show colleges that accept this exam
    if (examType) {
      where.acceptedExams = {
        contains: examType,
      };
    }

    if (course) {
      where.courses = {
        some: {
          name: { contains: course, mode: 'insensitive' },
        },
      };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        include: {
          courses: {
            include: {
              cutoffs: {
                take: 5,
                orderBy: { year: 'desc' },
                ...(examType && { where: { examType: examType as any } }),
              },
            },
            take: 3,
          },
        },
        orderBy: { nirfRank: 'asc' },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: colleges,
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}
