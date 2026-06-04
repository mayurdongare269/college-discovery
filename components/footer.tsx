import Link from 'next/link';

const LINKS = {
  Platform: [
    { label: 'Explore Colleges', href: '/colleges' },
    { label: 'AI Recommendations', href: '/recommendations' },
    { label: 'Compare Colleges', href: '/compare' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Resources: [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'GitHub', href: 'https://github.com/mayurdongare269/college-discovery' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base">CollegeIQ AI</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered college discovery platform for Indian engineering students. Get personalised recommendations using your exam score.
            </p>
            <p className="text-xs mt-4 text-slate-500">
              Powered by Groq · Gemini · Neon PostgreSQL
            </p>
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-white text-sm font-semibold mb-4">{section}</h3>
              <ul className="space-y-2">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} CollegeIQ AI. All rights reserved.</p>
          <p className="text-xs text-slate-500">Made with ♥ by <a href="https://github.com/mayurdongare269" className="hover:text-white transition-colors">Mayur Dongare</a></p>
        </div>
      </div>
    </footer>
  );
}
