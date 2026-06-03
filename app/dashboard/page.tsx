'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import StatsCard from '@/components/stats-card';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentColleges, setRecentColleges] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetch('/api/colleges?limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecentColleges(data.data);
        }
      });
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's your college discovery dashboard</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon="🎓"
              label="Saved Colleges"
              value={0}
            />
            <StatsCard
              icon="⚖️"
              label="Compared Colleges"
              value={0}
            />
            <StatsCard
              icon="👁️"
              label="Recently Viewed"
              value={0}
            />
          </div>

          {/* Quick Search */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Search</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search colleges, courses, exams..."
                className="flex-1 px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              />
              <Link
                href="/colleges"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>No recent activity</p>
                <Link href="/colleges" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                  Start exploring colleges
                </Link>
              </div>
            </div>

            {/* Recommended Colleges */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recommended Colleges</h2>
                <Link href="/colleges" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentColleges.slice(0, 5).map((college: any) => (
                  <Link
                    key={college.id}
                    href={`/colleges/${college.id}`}
                    className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{college.shortName}</h3>
                      <p className="text-sm text-gray-600">
                        {college.location}, {college.state}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900">⭐ {college.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
