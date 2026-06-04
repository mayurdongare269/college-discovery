'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { ...form, redirect: false });
      if (result?.error) setError('Invalid email or password.');
      else { router.push('/dashboard'); router.refresh(); }
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — visible on md+ */}
      <div className="hidden md:flex flex-col justify-between w-5/12 lg:w-2/5 bg-slate-900 px-10 py-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
          </div>
          <span className="text-white font-bold">CollegeIQ AI</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold text-white mb-4">Make smarter college decisions</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Get AI-powered Safe, Target, and Dream college recommendations based on your actual exam score and preferences.
          </p>
          <div className="space-y-3">
            {['85+ colleges across India', '14,000+ cutoff records', 'MHT-CET · JEE Main · JEE Advanced'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">© 2026 CollegeIQ AI</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900">CollegeIQ AI</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-8">Sign in to continue to your dashboard.</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email" type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                id="password" type="password" required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
