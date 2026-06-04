import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if query is about specific college
    const collegeQuery = message.toLowerCase();
    let retrievedContext = context || '';

    // Retrieve relevant college data for RAG
    if (collegeQuery.includes('college') || collegeQuery.includes('admission') || 
        collegeQuery.includes('cutoff') || collegeQuery.includes('placement')) {
      
      // Extract potential college names or search terms
      const colleges = await prisma.college.findMany({
        take: 5,
        include: {
          courses: {
            include: {
              cutoffs: {
                where: { year: 2024 },
                take: 3,
              },
            },
            take: 3,
          },
        },
        orderBy: { nirfRank: 'asc' },
      });

      // Build context from database
      const dbContext = colleges.map(c => `
${c.shortName} (${c.name}):
- Location: ${c.location}, ${c.state}
- Type: ${c.type}
- Fees: ₹${c.fees.toLocaleString()}/year
- Rating: ${c.rating}/5
- Placement Score: ${c.placementScore}%
- NIRF Rank: ${c.nirfRank || 'Not ranked'}
- Courses: ${c.courses.map(course => course.name).join(', ')}
- Recent Cutoffs: ${c.courses.flatMap(course => 
    course.cutoffs.map(cutoff => 
      `${cutoff.branch} (${cutoff.category}): ${cutoff.cutoffScore}%`
    )
  ).join(', ')}
      `).join('\n---\n');

      retrievedContext = dbContext + '\n\n' + retrievedContext;
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, retrievedContext);

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
