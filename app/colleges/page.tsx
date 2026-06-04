'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import CollegeCard from '@/components/college-card';
import Loading from '@/components/loading';
import ErrorState from '@/components/error-state';
import EmptyState from '@/components/empty-state';

interface College {
  id: number;
  name: string;
  shortName: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementScore: number;
  nirfRank: number | null;
}

const AI_SUGGESTIONS = [
  'Best AI colleges in Maharashtra',
  'Top IITs for Computer Science',
  'Affordable colleges under 1 lakh fees',
  'Good placement colleges in Pune',
  'NIT colleges for Electronics',
  'Best colleges for MHT-CET students',
];

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    examType: '',
    course: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchColleges = async (currentFilters = filters, currentPage = page) => {
    setLoading(true);
    setError('');
    setAiSearchActive(false);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.state && { state: currentFilters.state }),
        ...(currentFilters.examType && { examType: currentFilters.examType }),
        ...(currentFilters.course && { course: currentFilters.course }),
      });

      const response = await fetch(`/api/colleges?${params}`);
      const data = await response.json();

      if (data.success) {
        setColleges(data.data);
        setTotal(data.total);
      } else {
        setError('Failed to fetch colleges');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async (query: string) => {
    if (!query.trim()) {
      fetchColleges();
      return;
    }
    setLoading(true);
    setError('');
    setAiSearchActive(true);
    try {
      const res = await fetch(`/api/ai/search?q=${encodeURIComponent(query)}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setColleges(data.data);
        setTotal(data.data.length);
      } else {
        setError('AI search failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchColleges(filters, page);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [page, filters]);

  const handleAIQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAISearch(aiQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Colleges</h1>
          <p className="text-gray-600">Discover top colleges across India — search naturally with AI</p>
        </div>

        {/* AI Smart Search */}
        <div className="bg-blue-600 rounded-xl p-5 mb-6 text-white">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="font-semibold">AI Smart Search</span>
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <form onSubmit={handleAIQuerySubmit} className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder='Try: "Best AI colleges in Maharashtra" or "Affordable colleges under 1 lakh"'
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Search
            </button>
            {aiSearchActive && (
              <button
                type="button"
                onClick={() => { setAiQuery(''); setAiSearchActive(false); fetchColleges(); }}
                className="px-4 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-all"
              >
                Clear
              </button>
            )}
          </form>
          <div className="flex flex-wrap gap-2 mt-3">
            {AI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setAiQuery(s); handleAISearch(s); }}
                className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Standard Filters */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 mb-8">
          <div className="flex items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Standard Filters</span>
            {aiSearchActive && (
              <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                AI search active — filters disabled
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search colleges..."
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); setAiSearchActive(false); setAiQuery(''); }}
              disabled={aiSearchActive}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <select
              value={filters.state}
              onChange={(e) => { setFilters({ ...filters, state: e.target.value }); setPage(1); setAiSearchActive(false); }}
              disabled={aiSearchActive}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Delhi">Delhi</option>
              <option value="Telangana">Telangana</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
            <select
              value={filters.examType}
              onChange={(e) => { setFilters({ ...filters, examType: e.target.value }); setPage(1); setAiSearchActive(false); }}
              disabled={aiSearchActive}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Exams</option>
              <option value="MHT_CET">MHT-CET</option>
              <option value="JEE_MAIN">JEE Main</option>
              <option value="JEE_ADVANCED">JEE Advanced</option>
            </select>
            <select
              value={filters.course}
              onChange={(e) => { setFilters({ ...filters, course: e.target.value }); setPage(1); setAiSearchActive(false); }}
              disabled={aiSearchActive}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Courses</option>
              <option value="Computer">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="AI">AI & Data Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchColleges()} />
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200">
            <EmptyState
              icon="🔍"
              title="No colleges found"
              description="Try adjusting your filters or search with different keywords"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {aiSearchActive ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></span>
                    AI found <strong className="text-gray-900 mx-1">{colleges.length}</strong> colleges
                  </span>
                ) : (
                  <>Showing <strong className="text-gray-900 mx-1">{colleges.length}</strong> of <strong className="text-gray-900 mx-1">{total}</strong> colleges</>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {colleges.map((college) => (
                <CollegeCard key={college.id} {...college} />
              ))}
            </div>

            {/* Pagination — only for non-AI search */}
            {!aiSearchActive && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ← Previous
                </button>
                <span className="px-6 py-3 font-medium text-gray-900">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={colleges.length < 12}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
