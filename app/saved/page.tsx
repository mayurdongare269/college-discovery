'use client';

import Sidebar from '@/components/sidebar';
import EmptyState from '@/components/empty-state';
import { useRouter } from 'next/navigation';

export default function SavedPage() {
  const router = useRouter();
  const savedColleges: any[] = [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Colleges</h1>

          {savedColleges.length === 0 ? (
            <div className="bg-white border rounded-lg">
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
              {/* Saved colleges will be displayed here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
