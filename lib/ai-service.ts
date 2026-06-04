import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini (FALLBACK)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Groq configuration (PRIMARY)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
  provider?: 'gemini' | 'groq';
}

/**
 * Call Groq API (PRIMARY LLM)
 */
async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // Primary Groq model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned empty content');
  return text;
}

/**
 * Call Gemini API (FALLBACK)
 */
async function callGemini(fullPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Using gemini-1.5-flash as per user request
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  if (!text) throw new Error('Gemini returned empty content');
  return text;
}

/**
 * Generate AI response with Groq PRIMARY → Gemini FALLBACK
 * ARCHITECTURE: Groq first, then Gemini if Groq fails
 */
export async function generateAIResponse(
  prompt: string,
  context?: string
): Promise<AIResponse> {
  const systemPrompt =
    'You are a helpful college counseling assistant for Indian students. Provide accurate, practical advice based on the context provided. Be concise and actionable.';

  const userPrompt = context
    ? `Context about colleges in our platform:\n${context}\n\nStudent question: ${prompt}\n\nAnswer based on the context above.`
    : prompt;

  // ── PRIMARY: Try Groq first ────────────────────────────────────────
  try {
    console.log('[AI] Trying Groq (llama-3.3-70b-versatile)...');
    const text = await callGroq(systemPrompt, userPrompt);
    console.log('[AI] ✓ Groq responded successfully');
    return { success: true, data: text, provider: 'groq' };
  } catch (groqErr) {
    console.warn('[AI] Groq failed:', (groqErr as Error).message);
    console.log('[AI] Falling back to Gemini...');
  }

  // ── FALLBACK: Try Gemini ─────────────────────────────────────────
  try {
    const text = await callGemini(userPrompt);
    console.log('[AI] ✓ Gemini (fallback) responded successfully');
    return { success: true, data: text, provider: 'gemini' };
  } catch (geminiErr) {
    console.error('[AI] ✗ Both Groq and Gemini failed');
    console.error('[AI] Groq error:', (geminiErr as Error).message);
    return {
      success: false,
      error: 'AI service is temporarily unavailable. Please try again in a moment.',
    };
  }
}

/**
 * Calculate match score (0–100) for a college based on user preferences
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

  // Score compatibility (40 pts)
  const diff = userScore - cutoff;
  if (diff >= 10) score += 40;
  else if (diff >= 5) score += 35;
  else if (diff >= 0) score += 30;
  else if (diff >= -5) score += 20;
  else score += 10;

  // Branch preference (20 pts)
  if (
    preferredBranch &&
    college.courses?.some((c: any) =>
      c.name.toLowerCase().includes(preferredBranch.toLowerCase())
    )
  ) {
    score += 20;
  } else if (college.courses?.length > 0) {
    score += 10;
  }

  // State preference (10 pts)
  if (preferredState && college.state === preferredState) score += 10;
  else if (preferredState) score += 5;
  else score += 8;

  // Fees / budget (15 pts)
  if (budget) {
    if (college.fees <= budget) score += 15;
    else if (college.fees <= budget * 1.2) score += 10;
    else if (college.fees <= budget * 1.5) score += 5;
  } else {
    score += 10;
  }

  // Placement strength (10 pts)
  if (college.placementScore >= 90) score += 10;
  else if (college.placementScore >= 80) score += 8;
  else if (college.placementScore >= 70) score += 6;
  else score += 4;

  // Rating (5 pts)
  score += Math.min(college.rating ?? 0, 5);

  return Math.min(Math.round(score), 100);
}

/**
 * Generate a human-readable explanation for why a college is recommended
 */
export function generateRecommendationReason(
  college: any,
  userScore: number,
  cutoff: number,
  matchScore: number,
  preferredBranch?: string
): string {
  const reasons: string[] = [];
  const diff = userScore - cutoff;

  if (diff >= 10) {
    reasons.push(`your score is ${diff.toFixed(1)} percentile above the previous cutoff`);
  } else if (diff >= 5) {
    reasons.push(`your score is ${diff.toFixed(1)} percentile above cutoff with good chances`);
  } else if (diff >= 0) {
    reasons.push('your score matches the previous cutoff');
  } else {
    reasons.push(
      `this is aspirational with a ${Math.abs(diff).toFixed(1)} percentile gap — still worth applying`
    );
  }

  if (college.placementScore >= 85) reasons.push('excellent placement record');
  else if (college.placementScore >= 75) reasons.push('strong placement record');

  if (college.nirfRank && college.nirfRank <= 50) {
    reasons.push(`top-${college.nirfRank} NIRF ranking`);
  } else if (college.nirfRank && college.nirfRank <= 100) {
    reasons.push('highly ranked institution');
  }

  if (
    preferredBranch &&
    college.courses?.some((c: any) =>
      c.name.toLowerCase().includes(preferredBranch.toLowerCase())
    )
  ) {
    reasons.push(`${preferredBranch} program is available`);
  }

  if (college.rating >= 4.5) reasons.push('highly rated by students');

  return `Recommended because ${reasons.join(', ')}.`;
}

/**
 * Generate AI-powered side-by-side college comparison
 */
export async function generateCollegeComparison(colleges: any[]): Promise<AIResponse> {
  const context = colleges
    .map(
      (c, i) => `
College ${i + 1}: ${c.shortName} (${c.name})
- Location: ${c.location}, ${c.state}
- Annual Fees: ₹${c.fees.toLocaleString()}
- Rating: ${c.rating}/5
- Placement Score: ${c.placementScore}%
- NIRF Rank: ${c.nirfRank || 'Not ranked'}
- Type: ${c.type}`
    )
    .join('\n');

  const prompt = `You are comparing ${colleges.length} engineering colleges for an Indian student.
Provide a clear comparison covering:
1. Strengths of each college (2–3 points each)
2. Weaknesses of each college (1–2 points each)
3. Placement comparison
4. Fee-to-value analysis
5. Final recommendation with reasoning

Keep the response structured and practical.`;

  return generateAIResponse(prompt, context);
}

/**
 * Generate personalized admission counseling guidance
 */
export async function generateCounselingGuidance(
  examType: string,
  score: number,
  category: string,
  preferredBranch: string,
  recommendations: any
): Promise<AIResponse> {
  const safe = recommendations.safe ?? [];
  const target = recommendations.target ?? [];
  const dream = recommendations.dream ?? [];

  const context = `
Student Profile:
- Exam: ${examType}
- Score: ${score} percentile
- Category: ${category}
- Preferred Branch: ${preferredBranch || 'Not specified'}

Recommendation Summary:
- Safe Colleges (${safe.length}): ${safe.slice(0, 3).map((c: any) => c.shortName).join(', ') || 'None'}
- Target Colleges (${target.length}): ${target.slice(0, 3).map((c: any) => c.shortName).join(', ') || 'None'}
- Dream Colleges (${dream.length}): ${dream.slice(0, 3).map((c: any) => c.shortName).join(', ') || 'None'}`;

  const prompt = `As an experienced Indian college admissions counselor, provide:
1. Realistic admission chances analysis
2. Recommended form-filling strategy (which colleges to prioritize)
3. Safe backup plan
4. Branch vs College trade-off advice
5. One key tip for this student

Be encouraging, specific, and practical. Keep it under 300 words.`;

  return generateAIResponse(prompt, context);
}
