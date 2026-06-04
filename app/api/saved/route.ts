import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        college: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges,
    });
  } catch (error) {
    console.error('Error fetching saved colleges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved colleges' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collegeId } = await request.json();

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID required' }, { status: 400 });
    }

    // Check if already saved
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: parseInt(collegeId),
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'College already saved',
        data: existing,
      });
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId: parseInt(collegeId),
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'College saved successfully',
      data: savedCollege,
    });
  } catch (error) {
    console.error('Error saving college:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save college' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Support both query param ?collegeId=X and JSON body { collegeId }
    const { searchParams } = new URL(request.url);
    let collegeId = searchParams.get('collegeId');

    if (!collegeId) {
      try {
        const body = await request.json();
        collegeId = body.collegeId?.toString() ?? null;
      } catch {
        // no body — fall through to 400
      }
    }

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID required' }, { status: 400 });
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: parseInt(collegeId),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'College removed from saved',
    });
  } catch (error) {
    console.error('Error removing saved college:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove saved college' },
      { status: 500 }
    );
  }
}
