'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/empty-state';
import CollegeCard from '@/components/college-card';
import Loading from '@/components/loading';
import toast from 'react-hot-toast';

export default function SavedPage() {
  const router = useRouter();
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch('/api/saved');
      const data = await res.json();
      if (data.success) {
        setSavedColleges(data.data);
      }
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (collegeId: number) => {
    try {
      const res = await fetch('/api/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });
      
      const data = await res.json();
      if (data.success) {
        setSavedColleges(savedColleges.filter(sc => sc.college.id !== collegeId));
        toast.success('College removed from saved list');
      } else {
        toast.error('Failed to remove college');
      }
    } catch (error) {
      toast.error('Error removing saved college');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Colleges</h1>

        {loading ? (
          <Loading />
        ) : savedColleges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border">
            <EmptyState
              icon="❤️"
              title="No saved colleges"
              description="Start saving colleges to create your personalized list"
              action={{
                label: 'Explore Colleges',
                onClick: () => router.push('/colleges'),
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((saved) => (
              <div key={saved.id} className="relative">
                <CollegeCard {...saved.college} />
                <button
                  onClick={() => handleUnsave(saved.college.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  title="Remove from saved"
                >
                  <span className="text-red-500">❌</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
