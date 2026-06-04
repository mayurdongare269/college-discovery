'use client';

import { useState } from 'react';
import RecommendationCard from '@/components/recommendation-card';
import toast from 'react-hot-toast';

interface RecommendationData {
  id: number;
  name: string;
  shortName: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementScore: number;
  nirfRank: number | null;
  cutoff: number;
  difference: number;
  matchScore: number;
  reason: string;
  relevantCourse?: string;
  type: string;
  ownership: string;
}

interface Results {
  safe: RecommendationData[];
  target: RecommendationData[];
  dream: RecommendationData[];
}

export default function RecommendationsPage() {
  const [form, setForm] = useState({
    examType: '',
    score: '',
    category: 'OPEN',
    preferredBranch: '',
    preferredState: '',
    budget: '',
  });
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [counselingGuidance, setCounselingGuidance] = useState('');
  const [counselingLoading, setCounselingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'safe' | 'target' | 'dream'>('safe');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.examType || !form.score) {
      toast.error('Please enter exam type and score');
      return;
    }
    setLoading(true);
    setResults(null);
    setCounselingGuidance('');

    try {
      const params = new URLSearchParams({
        examType: form.examType,
        score: form.score,
        category: form.category,
        ...(form.preferredBranch && { preferredBranch: form.preferredBranch }),
        ...(form.preferredState && { preferredState: form.preferredState }),
        ...(form.budget && { budget: form.budget }),
      });

      const res = await fetch(`/api/recommendations?${params}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        const total = (data.data.safe?.length || 0) + (data.data.target?.length || 0) + (data.data.dream?.length || 0);
        if (total === 0) {
          toast('No colleges found matching your criteria. Try relaxing some filters.', { icon: 'ℹ️' });
        } else {
          toast.success(`Found ${total} colleges matching your profile!`);
        }
      } else {
        toast.error('Failed to get recommendations');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCounseling = async () => {
    if (!results) return;
    setCounselingLoading(true);
    try {
      const res = await fetch('/api/ai/counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: form.examType,
          score: parseFloat(form.score),
          category: form.category,
          preferredBranch: form.preferredBranch,
          recommendations: results,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCounselingGuidance(data.data.guidance);
      } else {
        toast.error('Could not generate guidance');
      }
    } catch {
      toast.error('Failed to generate counseling guidance');
    } finally {
      setCounselingLoading(false);
    }
  };

  const totalResults = results
    ? (results.safe?.length || 0) + (results.target?.length || 0) + (results.dream?.length || 0)
    : 0;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Recommendations</h1>
          <p className="text-gray-600">Get personalized college recommendations based on your exam score and preferences</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">1</span>
            Your Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type *</label>
                <select
                  value={form.examType}
                  onChange={(e) => setForm({ ...form, examType: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Exam</option>
                  <option value="MHT_CET">MHT-CET</option>
                  <option value="JEE_MAIN">JEE Main</option>
                  <option value="JEE_ADVANCED">JEE Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Score / Percentile *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  placeholder="e.g. 95.5"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="OPEN">OPEN / General</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Branch</label>
                <select
                  value={form.preferredBranch}
                  onChange={(e) => setForm({ ...form, preferredBranch: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Branch</option>
                  <option value="Computer">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="AI">AI & Data Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred State</label>
                <select
                  value={form.preferredState}
                  onChange={(e) => setForm({ ...form, preferredState: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Budget (₹/year)</label>
                <input
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. 200000"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your profile...
                  </span>
                ) : (
                  '🎯 Get AI Recommendations'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {results && totalResults > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Safe Colleges', count: results.safe?.length || 0, color: 'bg-green-50 border-green-200 text-green-700', icon: '✅' },
                { label: 'Target Colleges', count: results.target?.length || 0, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: '🎯' },
                { label: 'Dream Colleges', count: results.dream?.length || 0, color: 'bg-purple-50 border-purple-200 text-purple-700', icon: '⭐' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label.toLowerCase().split(' ')[0] as any)}
                  className={`${item.color} border-2 rounded-xl p-4 text-center hover:shadow-md transition-all ${activeTab === item.label.toLowerCase().split(' ')[0] ? 'shadow-md ring-2 ring-offset-1' : ''}`}
                >
                  <div className="text-3xl font-bold">{item.count}</div>
                  <div className="text-sm font-semibold mt-1">{item.icon} {item.label}</div>
                </button>
              ))}
            </div>

            {/* AI Counseling Button */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Get AI Counseling Strategy</h3>
                  <p className="text-white/80 text-sm">Get personalized admission strategy and form-filling advice from our AI counselor</p>
                </div>
                <button
                  onClick={handleGetCounseling}
                  disabled={counselingLoading}
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-70 whitespace-nowrap"
                >
                  {counselingLoading ? '⏳ Generating...' : '🤖 Get AI Strategy'}
                </button>
              </div>

              {counselingGuidance && (
                <div className="mt-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="font-semibold mb-2 text-white">AI Counselor Advice:</h4>
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{counselingGuidance}</p>
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div>
              {/* Safe */}
              {activeTab === 'safe' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-700 text-lg">✅</span>
                    Safe Colleges
                    <span className="ml-3 text-sm font-normal text-gray-500">Your score is well above cutoff</span>
                  </h2>
                  {results.safe?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.safe.map((college) => (
                        <RecommendationCard key={college.id} {...college} type="safe" />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No safe colleges found. Try adjusting your score or filters.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Target */}
              {activeTab === 'target' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-700 text-lg">🎯</span>
                    Target Colleges
                    <span className="ml-3 text-sm font-normal text-gray-500">Your score is near the cutoff — apply strategically</span>
                  </h2>
                  {results.target?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.target.map((college) => (
                        <RecommendationCard key={college.id} {...college} type="target" />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">🎯</div>
                      <p>No target colleges found for this score range.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Dream */}
              {activeTab === 'dream' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 text-purple-700 text-lg">⭐</span>
                    Dream Colleges
                    <span className="ml-3 text-sm font-normal text-gray-500">Aspirational — still worth applying</span>
                  </h2>
                  {results.dream?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.dream.map((college) => (
                        <RecommendationCard key={college.id} {...college} type="dream" />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">⭐</div>
                      <p>No dream colleges found in this range.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {results && totalResults === 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try changing your exam type, score, or removing filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
