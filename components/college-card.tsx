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
}

export default function CollegeCard({
  id,
  name,
  shortName,
  location,
  state,
  fees,
  rating,
  placementScore,
  nirfRank,
}: CollegeCardProps) {
  return (
    <Link href={`/colleges/${id}`}>
      <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{shortName}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{name}</p>
          </div>
          {nirfRank && (
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-blue-600">NIRF #{nirfRank}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span>📍</span>
          <span className="ml-1">
            {location}, {state}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Rating</p>
            <p className="text-sm font-semibold text-gray-900">⭐ {rating}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Placement</p>
            <p className="text-sm font-semibold text-gray-900">{placementScore}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fees</p>
            <p className="text-sm font-semibold text-gray-900">₹{(fees / 1000).toFixed(0)}K</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm font-medium text-blue-600">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
