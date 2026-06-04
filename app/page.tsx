'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// ── Hero slides using reliable Unsplash engineering/education images ──
const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80',
    alt: 'University campus aerial view',
  },
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80',
    alt: 'Students in college library',
  },
  {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80',
    alt: 'Engineering college building',
  },
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=80',
    alt: 'Students studying together',
  },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Recommendation Engine',
    description: 'Enter your exam score and get personalised Safe, Target and Dream college lists in seconds.',
    href: '/recommendations',
    tag: 'Core Feature',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'College Explorer',
    description: 'Browse 85+ colleges with NIRF rankings, fees, placement stats, and accepted exam types.',
    href: '/colleges',
    tag: 'Discovery',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Side-by-Side Comparison',
    description: 'Compare up to 3 colleges on fees, placements, and ranking — plus AI-generated insights.',
    href: '/compare',
    tag: 'Analysis',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: 'AI Counseling Chatbot',
    description: 'Ask anything — cutoffs, branch advice, career paths. Available 24/7 on every page.',
    href: '#',
    tag: 'AI Chat',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: 'Cutoff Analysis',
    description: '14,400+ historical cutoff records across MHT-CET, JEE Main and JEE Advanced (2023–2025).',
    href: '/colleges',
    tag: 'Data',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Saved Colleges',
    description: 'Bookmark colleges to your personal list. Access your shortlist anytime from your dashboard.',
    href: '/saved',
    tag: 'Personal',
  },
];

const STEPS = [
  { number: '01', title: 'Enter Your Details', desc: 'Select your exam type, score, category, and preferred branch or state.' },
  { number: '02', title: 'AI Analyses Profile', desc: 'Our rule-based engine compares your score against real cutoff data from 2023–2025.' },
  { number: '03', title: 'Get College Lists', desc: 'Receive Safe, Target, and Dream college lists with a 0–100 Match Score per college.' },
  { number: '04', title: 'Explore and Decide', desc: 'Dig into details, compare colleges side-by-side, and chat with the AI counselor.' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Deshmukh',
    exam: 'MHT-CET 97.4 percentile',
    college: 'Joined COEP Pune — CSE',
    quote: 'CollegeIQ AI showed me exactly which colleges I could get into with my score. The Safe/Target/Dream split made form-filling so much less stressful.',
    avatar: 'P',
  },
  {
    name: 'Rahul Sharma',
    exam: 'JEE Main 94.2 percentile',
    college: 'Joined NIT Surathkal — ECE',
    quote: 'The AI chatbot answered every question I had about NIT cutoffs. It knew my exact category and gave me realistic chances — not just generic info.',
    avatar: 'R',
  },
  {
    name: 'Anjali Patil',
    exam: 'JEE Advanced 98.1 percentile',
    college: 'Joined IIT Bombay — CS',
    quote: "I used it to compare IIT Bombay vs IIT Delhi vs IIT Madras. The AI comparison feature broke down placement stats in a way I couldn't find anywhere else.",
    avatar: 'A',
  },
];

const STATS = [
  { value: '85+',   label: 'Colleges', sub: 'IITs · NITs · State & Private' },
  { value: '14K+',  label: 'Cutoff Records', sub: '2023 · 2024 · 2025 data' },
  { value: '500+',  label: 'Courses', sub: 'Across 6 engineering branches' },
  { value: '3',     label: 'Exam Types', sub: 'MHT-CET · JEE Main · JEE Advanced' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  // Auto-rotate hero slides
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Trigger counter animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[780px] overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.url}
              alt={s.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/62" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600/20 text-blue-200 border border-blue-500/30 px-3 py-1 rounded-full mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI-Powered College Counseling Platform
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl">
            Find Your Perfect College<br className="hidden sm:block" />
            <span className="text-blue-400"> with AI</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl">
            Discover colleges based on your exam score, branch, budget and career goals.
            Get Safe · Target · Dream lists instantly.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/colleges" className="btn-primary px-6 py-3 text-base">
              Explore Colleges
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 text-base font-semibold text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-colors"
            >
              Get AI Recommendation
            </Link>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-6 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === slide ? 'bg-white w-6' : 'bg-white/40'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section id="stats-section" className="bg-blue-600 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label, sub }) => (
            <div key={label} className={statsVisible ? 'counter-animate' : 'opacity-0'}>
              <div className="text-3xl font-extrabold text-white">{value}</div>
              <div className="text-sm font-semibold text-blue-100 mt-0.5">{label}</div>
              <div className="text-xs text-blue-200 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to choose the right college</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">From discovery to decision — all in one AI-powered platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, description, href, tag }) => (
              <Link key={title} href={href} className="card p-6 flex flex-col gap-3 group">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <span className="badge badge-blue">{tag}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-500">Four simple steps from score to decision.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ number, title, desc }) => (
              <div key={number} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white text-lg font-extrabold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {number}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/signup" className="btn-primary px-8 py-3">
              Start for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI Architecture highlight ─────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <span className="badge bg-blue-600 text-white mb-4 inline-flex">Hybrid AI System</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Not just another chatbot.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                CollegeIQ AI combines three layers — a deterministic rule engine for Safe/Target/Dream classification, real cutoff data from our database, and large language models (Groq + Gemini) for explanations and counseling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '⚙️', label: 'Rule Engine', sub: 'Score × Cutoff × Preferences' },
                  { icon: '🗄️', label: 'Real Data', sub: '14K+ Cutoff Records' },
                  { icon: '🤖', label: 'LLM Layer', sub: 'Groq + Gemini' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="bg-slate-800 rounded-xl p-4">
                    <div className="text-2xl mb-2">{icon}</div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Students who found their college</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, exam, college, quote, avatar }) => (
              <div key={name} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{exam}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
                <span className="badge badge-green">{college}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to find your college?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of students who used CollegeIQ AI to make smarter admission decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
              Create Free Account
            </Link>
            <Link href="/colleges" className="px-8 py-3 text-white border-2 border-white/40 font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Browse Colleges
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
