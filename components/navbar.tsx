'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CollegeIQ AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/colleges"
              className={`text-sm font-medium ${
                isActive('/colleges') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Explore Colleges
            </Link>
            <Link
              href="/compare"
              className={`text-sm font-medium ${
                isActive('/compare') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Compare
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
