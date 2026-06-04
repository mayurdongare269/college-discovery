import Link from 'next/link';

interface CollegeCardProps {
  id: number;
  name: string;
  shortName: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementScore: number;
  nirfRank: number | null;
  acceptedExams?: string;
}

export default function CollegeCard({
  id, name, shortName, location, state,
  fees, rating, placementScore, nirfRank, acceptedExams,
}: CollegeCardProps) {
  const exams = acceptedExams?.split(',').map(e => e.trim()) ?? [];

  return (
    <div className="card flex flex-col">
      {/* Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">{shortName}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{name}</p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}, {state}</span>
            </div>
          </div>
          {nirfRank && (
            <span className="badge badge-amber ml-2 shrink-0">#{nirfRank}</span>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 my-3">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Rating</p>
            <p className="text-sm font-bold text-slate-800">
              <span className="text-amber-500">★</span> {rating}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Placement</p>
            <p className="text-sm font-bold text-slate-800">{placementScore}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Fees/yr</p>
            <p className="text-sm font-bold text-slate-800">₹{(fees / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Exam badges */}
        {exams.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {exams.map(e => (
              <span key={e} className="badge badge-slate">
                {e.replace('_', '-')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link
          href={`/colleges/${id}`}
          className="block w-full text-center py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
