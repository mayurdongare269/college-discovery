'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/lib/compare-context';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { compareCount } = useCompare();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredBranch: '',
    preferredState: '',
    preferredExam: '',
  });
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
      fetchSavedCount();
    }
  }, [session]);

  const fetchSavedCount = async () => {
    try {
      const res = await fetch('/api/saved');
      const data = await res.json();
      if (data.success) {
        setSavedCount(data.data.length);
      }
    } catch (error) {
      console.error('Error fetching saved count:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success) {
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          preferredBranch: data.data.preferredBranch || '',
          preferredState: data.data.preferredState || '',
          preferredExam: data.data.preferredExam || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Saved Colleges</p>
            <p className="text-3xl font-bold text-gray-900">{savedCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Compared Colleges</p>
            <p className="text-3xl font-bold text-gray-900">{compareCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-3xl font-bold text-gray-900">2026</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 border-gray-300 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="preferredBranch" className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Branch
              </label>
              <select
                id="preferredBranch"
                value={formData.preferredBranch}
                onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Branch</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI and Data Science">AI and Data Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredState" className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred State
              </label>
              <select
                id="preferredState"
                value={formData.preferredState}
                onChange={(e) => setFormData({ ...formData, preferredState: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
                <option value="Telangana">Telangana</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredExam" className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Exam
              </label>
              <select
                id="preferredExam"
                value={formData.preferredExam}
                onChange={(e) => setFormData({ ...formData, preferredExam: e.target.value })}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Exam</option>
                <option value="MHT_CET">MHT-CET</option>
                <option value="JEE_MAIN">JEE Main</option>
                <option value="JEE_ADVANCED">JEE Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
