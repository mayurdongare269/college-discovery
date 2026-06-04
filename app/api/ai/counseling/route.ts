import { NextRequest, NextResponse } from 'next/server';
import { generateCounselingGuidance } from '@/lib/ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { examType, score, category, preferredBranch, recommendations } = await request.json();

    if (!examType || !score || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate counseling guidance
    const guidance = await generateCounselingGuidance(
      examType,
      score,
      category,
      preferredBranch || 'Computer Engineering',
      recommendations
    );

    if (!guidance.success) {
      return NextResponse.json(
        { success: false, error: guidance.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        guidance: guidance.data,
        provider: guidance.provider,
      },
    });
  } catch (error) {
    console.error('Counseling API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate guidance' },
      { status: 500 }
    );
  }
}
