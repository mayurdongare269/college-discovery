import Sidebar from '@/components/sidebar';
import StatsCard from '@/components/stats-card';
import { prisma } from '@/lib/prisma';

async function getDashboardData() {
  const [totalColleges, recentColleges] = await Promise.all([
    prisma.college.count(),
    prisma.college.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shortName: true,
        location: true,
        state: true,
        rating: true,
      },
    }),
  ]);

  return { totalColleges, recentColleges };
}

export default async function DashboardPage() {
  const { totalColleges, recentColleges } = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon="🎓"
              label="Total Colleges"
              value={totalColleges}
            />
            <StatsCard
              icon="❤️"
              label="Saved Colleges"
              value={0}
            />
            <StatsCard
              icon="⚖️"
              label="Compared Colleges"
              value={0}
            />
          </div>

          {/* Quick Search */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Search</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search colleges..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity</p>
          </div>

          {/* Recommended Colleges */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Added Colleges</h2>
            <div className="space-y-4">
              {recentColleges.map((college) => (
                <div key={college.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{college.shortName}</h3>
                    <p className="text-sm text-gray-600">
                      {college.location}, {college.state}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">⭐ {college.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
