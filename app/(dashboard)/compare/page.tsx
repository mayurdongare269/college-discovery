'use client';

import { useState, useEffect } from 'react';
import CompareTable from '@/components/compare-table';
import { useCompare } from '@/lib/compare-context';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) {
      setSelectedColleges([]);
      setLoading(false);
      return;
    }

    // Fetch full college data
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
    toast.success('Removed from compare');
  };

  const handleClearAll = () => {
    clearCompare();
    toast.success('Compare list cleared');
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
          {selectedColleges.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : selectedColleges.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No colleges selected
              </h3>
              <p className="text-gray-600 mb-6">
                Select up to 3 colleges to compare them side by side
              </p>
              <a
                href="/colleges"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Browse Colleges
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <CompareTable colleges={selectedColleges} onRemove={handleRemove} />
          </div>
        )}
      </div>
    </div>
  );
}
