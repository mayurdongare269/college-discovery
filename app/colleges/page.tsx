'use client';

import { useState, useEffect } from 'react';
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

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    examType: '',
    course: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchColleges = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.search && { search: filters.search }),
        ...(filters.state && { state: filters.state }),
        ...(filters.examType && { examType: filters.examType }),
        ...(filters.course && { course: filters.course }),
      });

      const response = await fetch(`/api/colleges?${params}`);
      const data = await response.json();

      if (data.success) {
        setColleges(data.data);
        setTotal(data.total);
      } else {
        setError('Failed to fetch colleges');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Colleges</h1>
          <p className="text-gray-600">Discover top colleges across India</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search colleges..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
            />
            <select
              value={filters.state}
              onChange={(e) => {
                setFilters({ ...filters, state: e.target.value });
                setPage(1);
              }}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={(e) => {
                setFilters({ ...filters, examType: e.target.value });
                setPage(1);
              }}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Exams</option>
              <option value="MHT_CET">MHT-CET</option>
              <option value="JEE_MAIN">JEE Main</option>
            </select>
            <select
              value={filters.course}
              onChange={(e) => {
                setFilters({ ...filters, course: e.target.value });
                setPage(1);
              }}
              className="px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <ErrorState message={error} onRetry={fetchColleges} />
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border">
            <EmptyState
              icon="🔍"
              title="No colleges found"
              description="Try adjusting your filters to see more results"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {colleges.length} of {total} colleges
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {colleges.map((college) => (
                <CollegeCard key={college.id} {...college} />
              ))}
            </div>

            {/* Pagination */}
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
