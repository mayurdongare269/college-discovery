'use client';

import { useState, useEffect } from 'react';
import CompareTable from '@/components/compare-table';
import { useCompare } from '@/lib/compare-context';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiComparison, setAiComparison] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (compareIds.length === 0) {
      setSelectedColleges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      compareIds.map((id: number) =>
        fetch(`/api/colleges?id=${id}`).then(res => res.json())
      )
    ).then(responses => {
      const colleges = responses
        .filter(r => r.success && r.data && r.data.length > 0)
        .map(r => r.data[0]);
      setSelectedColleges(colleges);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load colleges');
      setLoading(false);
    });
  }, [compareIds]);

  const handleRemove = (collegeId: number) => {
    removeFromCompare(collegeId);
    setAiComparison('');
    toast.success('Removed from compare');
  };

  const handleClearAll = () => {
    clearCompare();
    setAiComparison('');
    toast.success('Compare list cleared');
  };

  const handleAICompare = async () => {
    if (selectedColleges.length < 2) {
      toast.error('Add at least 2 colleges to compare');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: selectedColleges.map(c => c.id) }),
      });
      const data = await res.json();
      if (data.success) {
        setAiComparison(data.data.comparison);
        toast.success('AI comparison generated!');
      } else {
        toast.error('Failed to generate AI comparison');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
            <p className="text-gray-600 mt-1">Compare up to 3 colleges side by side with AI insights</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedColleges.length >= 2 && (
              <button
                onClick={handleAICompare}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
              >
                {aiLoading ? '⏳ Analyzing...' : '🤖 AI Comparison'}
              </button>
            )}
            {selectedColleges.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium rounded-xl border-2 border-red-200 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : selectedColleges.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges selected</h3>
              <p className="text-gray-600 mb-6">Select up to 3 colleges to compare them side by side with AI insights</p>
              <Link
                href="/colleges"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse Colleges
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Comparison Table */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden mb-6">
              <CompareTable colleges={selectedColleges} onRemove={handleRemove} />
            </div>

            {/* AI Comparison Section */}
            {aiComparison && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Analysis</h3>
                    <p className="text-sm text-gray-600">Powered by Gemini AI</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{aiComparison}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
