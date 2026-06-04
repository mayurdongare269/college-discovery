'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', exact: true },
    { href: '/colleges', label: 'Explore Colleges', icon: '🎓', exact: false },
    { href: '/recommendations', label: 'AI Recommendations', icon: '🤖', exact: false, badge: 'AI' },
    { href: '/compare', label: 'Compare Colleges', icon: '⚖️', exact: false },
    { href: '/saved', label: 'Saved Colleges', icon: '❤️', exact: false },
    { href: '/profile', label: 'Profile', icon: '👤', exact: false },
  ];

  const isNavActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <aside className="w-64 bg-white border-r-2 border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">CollegeIQ</span>
            <span className="ml-1 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-1.5 py-0.5 rounded font-bold">AI</span>
          </div>
        </Link>

        {/* User Info */}
        {session && (
          <div className="mb-6 pb-6 border-b-2 border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-lg">
                  {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isNavActive(item)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  isNavActive(item)
                    ? 'bg-white/30 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t-2 border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
