'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/lib/compare-context';

const QUICK_ACTIONS = [
  {
    href: '/colleges',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    label: 'Find Colleges',
    sub: 'Browse 85+ colleges',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/recommendations',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    label: 'AI Recommendation',
    sub: 'Safe · Target · Dream',
    color: 'text-purple-600 bg-purple-50',
    badge: 'AI',
  },
  {
    href: '/compare',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    label: 'Compare Colleges',
    sub: 'Side-by-side analysis',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    href: '/saved',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    label: 'Saved Colleges',
    sub: 'Your shortlist',
    color: 'text-rose-600 bg-rose-50',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { compareCount } = useCompare();
  const [savedCount, setSavedCount] = useState(0);
  const [topColleges, setTopColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/saved').then(r => r.json()),
      fetch('/api/colleges?limit=6&page=1').then(r => r.json()),
    ]).then(([saved, colleges]) => {
      setSavedCount(saved.success ? saved.data.length : 0);
      if (colleges.success) setTopColleges(colleges.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Welcome banner */}
      <div className="bg-blue-600 rounded-2xl px-6 py-6 text-white mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">{greeting} 👋</p>
            <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
            <p className="text-blue-100 text-sm mt-1">
              {session?.user?.email}
            </p>
          </div>
          <Link
            href="/recommendations"
            className="shrink-0 px-5 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get AI Recommendations →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Saved Colleges', value: savedCount, icon: '❤️', href: '/saved' },
          { label: 'In Compare List', value: compareCount, icon: '⚖️', href: '/compare' },
          { label: 'Total Colleges', value: '85+', icon: '🎓', href: '/colleges' },
        ].map(({ label, value, icon, href }) => (
          <Link key={label} href={href} className="card p-5 flex items-center gap-4 hover:border-blue-200">
            <div className="text-2xl">{icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ href, icon, label, sub, color, badge }) => (
            <Link key={href} href={href} className="card p-4 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{label}</p>
                  {badge && <span className="badge badge-blue">{badge}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Colleges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Top Ranked Colleges</h2>
          <Link href="/colleges" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5 h-28 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topColleges.map((c: any) => (
              <Link
                key={c.id}
                href={`/colleges/${c.id}`}
                className="card p-5 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{c.shortName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.location}, {c.state}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                    <span><span className="text-amber-500">★</span> {c.rating}</span>
                    <span>{c.placementScore}% placed</span>
                  </div>
                </div>
                {c.nirfRank && (
                  <span className="badge badge-amber shrink-0">#{c.nirfRank}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
