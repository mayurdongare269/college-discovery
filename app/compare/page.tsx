'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ComparePage() {
  const [selectedColleges, setSelectedColleges] = useState<number[]>([]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Colleges</h1>

        <div className="bg-white border rounded-lg p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No colleges selected
            </h3>
            <p className="text-gray-600 mb-6">
              Select up to 3 colleges to compare them side by side
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Browse Colleges
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
