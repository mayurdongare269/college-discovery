import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [collegeCount, courseCount, cutoffCount] = await Promise.all([
    prisma.college.count(),
    prisma.course.count(),
    prisma.cutoff.count(),
  ]);

  return { collegeCount, courseCount, cutoffCount };
}

export default async function Home() {
  const { collegeCount, courseCount, cutoffCount } = await getStats();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect College with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search, Compare, Predict and Plan your college journey using AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/colleges"
                className="px-8 py-4 bg-white text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Explore Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI College Match',
                description: 'Get personalized college recommendations based on your scores and preferences.',
              },
              {
                icon: '⚖️',
                title: 'Compare Colleges',
                description: 'Side-by-side comparison of colleges based on fees, placements, and rankings.',
              },
              {
                icon: '📊',
                title: 'Cutoff Analysis',
                description: 'Historical cutoff data for informed decision making.',
              },
              {
                icon: '🎯',
                title: 'Safe / Target / Dream',
                description: 'Categorize colleges based on your scores for strategic planning.',
              },
              {
                icon: '💡',
                title: 'Personalized Recommendations',
                description: 'AI-driven suggestions tailored to your profile and goals.',
              },
              {
                icon: '📈',
                title: 'Real-time Updates',
                description: 'Latest cutoffs, admissions, and placement data.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Enter Exam Details', description: 'Provide your exam scores and preferences' },
              { step: '2', title: 'Explore Colleges', description: 'Browse through our extensive database' },
              { step: '3', title: 'Get AI Recommendations', description: 'Receive personalized suggestions' },
              { step: '4', title: 'Build Your Strategy', description: 'Plan your college applications' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{collegeCount}+</div>
              <p className="text-gray-600 font-medium">Colleges</p>
            </div>
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{courseCount}+</div>
              <p className="text-gray-600 font-medium">Courses</p>
            </div>
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{cutoffCount}+</div>
              <p className="text-gray-600 font-medium">Cutoff Records</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Discovering Your Dream College Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students making informed college decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
