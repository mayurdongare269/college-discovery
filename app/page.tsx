import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [collegeCount, courseCount, cutoffCount, topColleges] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
    prisma.cutoff.count(),
    prisma.college.findMany({
      take: 6,
      orderBy: { nirfRank: 'asc' },
      select: {
        id: true,
        shortName: true,
        name: true,
        location: true,
        state: true,
        fees: true,
        rating: true,
        placementScore: true,
        nirfRank: true,
      },
    }),
  ]);

  return { collegeCount, courseCount, cutoffCount, topColleges };
}

export default async function Home() {
  const { collegeCount, courseCount, cutoffCount, topColleges } = await getStats();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream College
            </h1>
            <p className="text-xl text-blue-100 mb-12">
              Explore colleges, compare programs, check cutoffs and make informed decisions
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search colleges, courses, exams..."
                  className="flex-1 px-6 py-4 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                />
                <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  🔍 Search
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/colleges"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Explore Colleges
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Engineering', icon: '⚙️', color: 'bg-blue-50 border-blue-200' },
              { name: 'Medical', icon: '🏥', color: 'bg-red-50 border-red-200' },
              { name: 'Management', icon: '💼', color: 'bg-green-50 border-green-200' },
              { name: 'Commerce', icon: '💰', color: 'bg-yellow-50 border-yellow-200' },
              { name: 'Arts', icon: '🎨', color: 'bg-purple-50 border-purple-200' },
              { name: 'Science', icon: '🔬', color: 'bg-indigo-50 border-indigo-200' },
            ].map((category) => (
              <Link
                key={category.name}
                href="/colleges"
                className={`${category.color} border-2 rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore Programs & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'College Rankings',
                description: 'Browse colleges ranked by NIRF, placements, and ratings',
                icon: '🏆',
                link: '/colleges',
              },
              {
                title: 'College Finder',
                description: 'Find the perfect college based on your preferences',
                icon: '🔍',
                link: '/colleges',
              },
              {
                title: 'Compare Colleges',
                description: 'Compare fees, placements, and facilities side-by-side',
                icon: '⚖️',
                link: '/compare',
              },
              {
                title: 'Cutoff Predictor',
                description: 'Check cutoff trends and predict your chances',
                icon: '📊',
                link: '/colleges',
              },
              {
                title: 'Course Finder',
                description: 'Explore courses across top colleges in India',
                icon: '📚',
                link: '/colleges',
              },
              {
                title: 'Exam Information',
                description: 'Get details about entrance exams and dates',
                icon: '📝',
                link: '/colleges',
              },
            ].map((program, index) => (
              <Link
                key={index}
                href={program.link}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
                <div className="mt-4 text-blue-600 font-medium">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Colleges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Colleges</h2>
            <Link href="/colleges" className="text-blue-600 font-medium hover:text-blue-700">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topColleges.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.id}`}
                className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{college.shortName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{college.location}, {college.state}</p>
                  </div>
                  {college.nirfRank && (
                    <div className="bg-yellow-50 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-yellow-700">#{college.nirfRank}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">⭐ {college.rating}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Placement</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{college.placementScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fees</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">₹{(college.fees / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  View Details →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">{collegeCount}+</div>
              <p className="text-blue-100 text-lg">Colleges Listed</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{courseCount}+</div>
              <p className="text-blue-100 text-lg">Courses Available</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{(cutoffCount / 1000).toFixed(0)}K+</div>
              <p className="text-blue-100 text-lg">Cutoff Records</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with Latest Admissions
          </h2>
          <p className="text-gray-600 mb-8">
            Get notifications about cutoffs, admission dates, and college updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
            />
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
