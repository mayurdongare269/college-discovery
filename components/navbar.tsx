'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCompare } from '@/lib/compare-context';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { compareCount } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/colleges', label: 'Colleges' },
    { href: '/compare', label: 'Compare', badge: compareCount > 0 ? compareCount : null },
    ...(session ? [{ href: '/recommendations', label: 'AI Picks' }] : []),
    ...(session ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">CollegeIQ</span>
            <span className="text-xs font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
                {badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
            ) : session ? (
              <>
                <Link
                  href="/profile"
                  className="w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title={session.user?.name ?? 'Profile'}
                >
                  {session.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign in
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium ${
                isActive(href) ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
              {badge && (
                <span className="badge badge-blue">{badge}</span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {session ? (
              <button
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Sign in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
