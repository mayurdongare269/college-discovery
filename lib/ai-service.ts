import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Groq configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
  provider?: 'gemini' | 'groq';
}

/**
 * Generate AI response with automatic fallback from Gemini to Groq
 */
export async function generateAIResponse(
  prompt: string,
  context?: string
): Promise<AIResponse> {
  // Try Gemini first
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = context 
      ? `Context:\n${context}\n\nUser Query:\n${prompt}\n\nProvide a helpful, accurate response based on the context provided.`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text,
      provider: 'gemini',
    };
  } catch (geminiError) {
    console.error('Gemini API failed, falling back to Groq:', geminiError);
    
    // Fallback to Groq
    try {
      const fullPrompt = context 
        ? `Context:\n${context}\n\nUser Query:\n${prompt}\n\nProvide a helpful, accurate response based on the context provided.`
        : prompt;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful college counseling assistant. Provide accurate, practical advice based on the context provided.',
            },
            {
              role: 'user',
              content: fullPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || 'No response generated';

      return {
        success: true,
        data: text,
        provider: 'groq',
      };
    } catch (groqError) {
      console.error('Groq API also failed:', groqError);
      return {
        success: false,
        error: 'Both AI services are currently unavailable. Please try again later.',
      };
    }
  }
}

/**
 * Calculate match score for a college based on user preferences
 */
export function calculateMatchScore(
  college: any,
  userScore: number,
  cutoff: number,
  preferredBranch?: string,
  preferredState?: string,
  budget?: number
): number {
  let score = 0;

  // Score compatibility (40 points)
  const scoreDiff = userScore - cutoff;
  if (scoreDiff >= 10) score += 40;
  else if (scoreDiff >= 5) score += 35;
  else if (scoreDiff >= 0) score += 30;
  else if (scoreDiff >= -5) score += 20;
  else score += 10;

  // Branch preference (20 points)
  if (preferredBranch && college.courses?.some((c: any) => 
    c.name.toLowerCase().includes(preferredBranch.toLowerCase())
  )) {
    score += 20;
  } else if (college.courses?.length > 0) {
    score += 10;
  }

  // State preference (10 points)
  if (preferredState && college.state === preferredState) {
    score += 10;
  } else if (preferredState) {
    score += 5;
  } else {
    score += 8;
  }

  // Fees compatibility (15 points)
  if (budget) {
    if (college.fees <= budget) score += 15;
    else if (college.fees <= budget * 1.2) score += 10;
    else if (college.fees <= budget * 1.5) score += 5;
  } else {
    score += 10;
  }

  // Placement strength (10 points)
  if (college.placementScore >= 90) score += 10;
  else if (college.placementScore >= 80) score += 8;
  else if (college.placementScore >= 70) score += 6;
  else score += 4;

  // Rating (5 points)
  score += Math.min(college.rating, 5);

  return Math.min(Math.round(score), 100);
}

/**
 * Generate explanation for why a college is recommended
 */
export function generateRecommendationReason(
  college: any,
  userScore: number,
  cutoff: number,
  matchScore: number,
  preferredBranch?: string
): string {
  const reasons: string[] = [];

  const scoreDiff = userScore - cutoff;
  
  if (scoreDiff >= 10) {
    reasons.push(`your score is ${scoreDiff.toFixed(1)} percentile above the previous cutoff`);
  } else if (scoreDiff >= 5) {
    reasons.push(`your score is ${scoreDiff.toFixed(1)} percentile above the cutoff with good chances`);
  } else if (scoreDiff >= 0) {
    reasons.push(`your score matches the previous cutoff`);
  } else {
    reasons.push(`this is an aspirational target with a ${Math.abs(scoreDiff).toFixed(1)} percentile gap`);
  }

  if (college.placementScore >= 85) {
    reasons.push('excellent placement record');
  } else if (college.placementScore >= 75) {
    reasons.push('strong placement record');
  }

  if (college.nirfRank && college.nirfRank <= 50) {
    reasons.push(`top ${college.nirfRank} NIRF ranking`);
  } else if (college.nirfRank && college.nirfRank <= 100) {
    reasons.push('highly ranked institution');
  }

  if (preferredBranch && college.courses?.some((c: any) => 
    c.name.toLowerCase().includes(preferredBranch.toLowerCase())
  )) {
    reasons.push(`${preferredBranch} program available`);
  }

  if (college.rating >= 4.5) {
    reasons.push('highly rated by students');
  }

  return `Recommended because ${reasons.join(', ')}.`;
}

/**
 * Generate college comparison using AI
 */
export async function generateCollegeComparison(
  colleges: any[]
): Promise<AIResponse> {
  const context = colleges.map((c, i) => `
College ${i + 1}: ${c.shortName}
- Location: ${c.location}, ${c.state}
- Fees: ₹${c.fees.toLocaleString()}
- Rating: ${c.rating}/5
- Placement Score: ${c.placementScore}%
- NIRF Rank: ${c.nirfRank || 'Not ranked'}
- Type: ${c.type}
  `).join('\n');

  const prompt = `Compare these colleges and provide:
1. Key strengths of each college
2. Key weaknesses of each college
3. Placement comparison
4. Fee-to-value analysis
5. Final recommendation based on the data

Be specific and data-driven. Format the response clearly.`;

  return generateAIResponse(prompt, context);
}

/**
 * Generate counseling guidance based on user profile
 */
export async function generateCounselingGuidance(
  examType: string,
  score: number,
  category: string,
  preferredBranch: string,
  recommendations: any
): Promise<AIResponse> {
  const context = `
Student Profile:
- Exam: ${examType}
- Score: ${score} percentile
- Category: ${category}
- Preferred Branch: ${preferredBranch}

Available Colleges:
Safe Colleges: ${recommendations.safe?.length || 0}
Target Colleges: ${recommendations.target?.length || 0}
Dream Colleges: ${recommendations.dream?.length || 0}

Top Safe: ${recommendations.safe?.[0]?.shortName || 'None'}
Top Target: ${recommendations.target?.[0]?.shortName || 'None'}
Top Dream: ${recommendations.dream?.[0]?.shortName || 'None'}
  `;

  const prompt = `Based on this student's profile, provide:
1. Admission chances analysis
2. College selection strategy
3. Application form priority (which colleges to apply first)
4. Backup plan recommendations
5. Branch vs College trade-off advice

Be practical and encouraging. Focus on actionable guidance.`;

  return generateAIResponse(prompt, context);
}
