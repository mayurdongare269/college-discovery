import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { prisma } from '@/lib/prisma';

async function getCollege(id: string) {
  const college = await prisma.college.findUnique({
    where: { id: parseInt(id) },
    include: {
      courses: {
        include: {
          cutoffs: {
            orderBy: { year: 'desc' },
            take: 10,
          },
        },
      },
    },
  });

  if (!college) return null;
  return college;
}

export default async function CollegeDetailsPage({ params }: { params: { id: string } }) {
  const college = await getCollege(params.id);

  if (!college) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* College Header */}
        <div className="bg-white border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.shortName}</h1>
              <p className="text-lg text-gray-600 mb-4">{college.name}</p>
              <div className="flex items-center text-gray-600">
                <span>📍</span>
                <span className="ml-1">
                  {college.location}, {college.state}
                </span>
              </div>
            </div>
            {college.nirfRank && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-blue-600">NIRF Rank #{college.nirfRank}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Type</p>
              <p className="font-semibold text-gray-900">{college.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ownership</p>
              <p className="font-semibold text-gray-900">{college.ownership}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Rating</p>
              <p className="font-semibold text-gray-900">⭐ {college.rating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Placement Score</p>
              <p className="font-semibold text-gray-900">{college.placementScore}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Annual Fees</p>
              <p className="font-semibold text-gray-900">₹{college.fees.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save College
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Compare
            </button>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Visit Website →
              </a>
            )}
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {college.courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Duration: {course.duration} years</span>
                  <span>Seats: {course.seats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cutoffs */}
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cutoff Data</h2>
          {college.courses.map((course) => (
            course.cutoffs.length > 0 && (
              <div key={course.id} className="mb-8 last:mb-0">
                <h3 className="font-semibold text-gray-900 mb-4">{course.name}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cutoff</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {course.cutoffs.slice(0, 5).map((cutoff) => (
                        <tr key={cutoff.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cutoff.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cutoff.examType.replace('_', '-')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cutoff.category}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cutoff.branch}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cutoff.cutoffScore}</td>
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
