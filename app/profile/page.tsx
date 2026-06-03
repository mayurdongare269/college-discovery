'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    alert('Profile updated successfully!');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border rounded-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Saved Colleges</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Compared Colleges</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <p className="text-2xl font-bold text-gray-900">2026</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white border rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
