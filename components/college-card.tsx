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
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{shortName}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{name}</p>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">📍</span>
            <span>{location}, {state}</span>
          </div>
        </div>
        {nirfRank && (
          <div className="bg-yellow-50 border-2 border-yellow-200 px-3 py-1 rounded-full ml-2">
            <span className="text-xs font-bold text-yellow-700">NIRF #{nirfRank}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 py-4 border-t-2 border-b-2 border-gray-100 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Rating</p>
          <p className="text-sm font-bold text-gray-900">⭐ {rating}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Placement</p>
          <p className="text-sm font-bold text-gray-900">{placementScore}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fees</p>
          <p className="text-sm font-bold text-gray-900">₹{(fees / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <Link
        href={`/colleges/${id}`}
        className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Details →
      </Link>
    </div>
  );
}
