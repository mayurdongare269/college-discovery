import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ClientActions from './client-actions';

async function getCollege(id: string, userEmail?: string) {
  const collegeId = parseInt(id);
  if (isNaN(collegeId)) {
    return null;
  }

  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        courses: {
          include: {
            cutoffs: {
              orderBy: { year: 'desc' },
              take: 15,
            },
          },
        },
      },
    });

    if (!college) return null;

    // Check if saved by current user
    let isSaved = false;
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          savedColleges: {
            where: { collegeId },
            select: { id: true },
          },
        },
      });
      isSaved = (user?.savedColleges?.length || 0) > 0;
    }

    return { college, isSaved };
  } catch (error) {
    console.error('Error fetching college:', error);
    return null;
  }
}

export default async function CollegeDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params);
  const session = await getServerSession(authOptions);
  
  const result = await getCollege(resolvedParams.id, session?.user?.email);

  if (!result) {
    notFound();
  }

  const { college, isSaved } = result;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/colleges" className="hover:text-blue-600">Colleges</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{college.shortName}</span>
          </div>
        </div>

        {/* College Header */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{college.shortName}</h1>
              <p className="text-lg text-gray-700 mb-4">{college.name}</p>
              <div className="flex items-center text-gray-600">
                <span className="text-xl mr-2">📍</span>
                <span className="text-lg">{college.location}, {college.state}</span>
              </div>
            </div>
            {college.nirfRank && (
              <div className="bg-yellow-50 border-2 border-yellow-200 px-6 py-3 rounded-xl">
                <p className="text-xs text-yellow-700 mb-1">NIRF Ranking</p>
                <p className="text-3xl font-bold text-yellow-700">#{college.nirfRank}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-t-2 border-b-2 border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">Type</p>
              <p className="font-bold text-gray-900">{college.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Ownership</p>
              <p className="font-bold text-gray-900">{college.ownership}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Rating</p>
              <p className="font-bold text-gray-900 text-lg">⭐ {college.rating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Placement Score</p>
              <p className="font-bold text-gray-900 text-lg">{college.placementScore}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Annual Fees</p>
              <p className="font-bold text-gray-900 text-lg">₹{college.fees.toLocaleString()}</p>
            </div>
          </div>

          <ClientActions 
            collegeId={college.id} 
            collegeName={college.shortName}
            initialSaved={isSaved}
          />
          {college.website && (
            <div className="mt-4">
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🌐 Visit Website
              </a>
            </div>
          )}
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {college.courses.map((course) => (
              <div key={course.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-500 transition-all">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{course.name}</h3>
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Duration:</span> {course.duration} years
                  </div>
                  <div>
                    <span className="font-semibold">Seats:</span> {course.seats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cutoffs */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cutoff Data</h2>
          {college.courses.map((course) => (
            course.cutoffs.length > 0 && (
              <div key={course.id} className="mb-8 last:mb-0">
                <h3 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b-2 border-gray-200">{course.name}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y-2 divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Exam</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Branch</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cutoff Percentile</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {course.cutoffs.slice(0, 8).map((cutoff) => (
                        <tr key={cutoff.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{cutoff.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cutoff.examType.replace('_', '-')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">{cutoff.category}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{cutoff.branch}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{cutoff.cutoffScore}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
