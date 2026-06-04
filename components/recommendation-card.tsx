'use client';

import Link from 'next/link';

interface RecommendationCardProps {
  id: number;
  shortName: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementScore: number;
  nirfRank: number | null;
  cutoff: number;
  difference: number;
  matchScore: number;
  reason: string;
  relevantCourse?: string;
  type: 'safe' | 'target' | 'dream';
}

export default function RecommendationCard({
  id,
  shortName,
  name,
  location,
  state,
  fees,
  rating,
  placementScore,
  nirfRank,
  cutoff,
  difference,
  matchScore,
  reason,
  relevantCourse,
  type,
}: RecommendationCardProps) {
  const typeConfig = {
    safe: {
      badge: '✅ Safe',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      badgeBg: 'bg-green-100',
    },
    target: {
      badge: '🎯 Target',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      badgeBg: 'bg-blue-100',
    },
    dream: {
      badge: '⭐ Dream',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      badgeBg: 'bg-purple-100',
    },
  };

  const config = typeConfig[type];

  return (
    <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-6 hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-xs font-bold px-2 py-1 ${config.badgeBg} ${config.textColor} rounded-full`}>
              {config.badge}
            </span>
            {nirfRank && nirfRank <= 100 && (
              <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                NIRF #{nirfRank}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{shortName}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{name}</p>
        </div>
        
        {/* Match Score */}
        <div className="flex flex-col items-center ml-4">
          <div className={`w-16 h-16 rounded-full border-4 ${config.borderColor} flex items-center justify-center ${config.bgColor}`}>
            <span className={`text-lg font-bold ${config.textColor}`}>{matchScore}%</span>
          </div>
          <span className="text-xs text-gray-600 mt-1 font-semibold">Match</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-600">Location</p>
          <p className="text-sm font-semibold text-gray-900">{location}, {state}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Fees/Year</p>
          <p className="text-sm font-semibold text-gray-900">₹{fees.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Cutoff Percentile</p>
          <p className="text-sm font-semibold text-gray-900">{cutoff}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Your Gap</p>
          <p className={`text-sm font-semibold ${difference >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center space-x-4 mb-4 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm font-semibold text-gray-900">{rating}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-green-500">📊</span>
          <span className="text-sm font-semibold text-gray-900">{placementScore}%</span>
        </div>
        {relevantCourse && (
          <div className="flex-1 text-right">
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
              {relevantCourse}
            </span>
          </div>
        )}
      </div>

      {/* AI Reason */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Why Recommended
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">{reason}</p>
      </div>

      {/* Action Button */}
      <Link
        href={`/colleges/${id}`}
        className={`block w-full text-center px-4 py-2.5 ${config.badgeBg} ${config.textColor} font-semibold rounded-lg hover:shadow-md transition-all`}
      >
        View Details →
      </Link>
    </div>
  );
}
