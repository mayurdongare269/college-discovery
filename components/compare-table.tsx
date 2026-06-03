interface CompareTableProps {
  colleges: {
    id: number;
    name: string;
    shortName: string;
    fees: number;
    rating: number;
    placementScore: number;
    nirfRank: number | null;
    location: string;
    state: string;
    acceptedExams?: string;
  }[];
  onRemove?: (collegeId: number) => void;
}

export default function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        Select colleges to compare
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Parameter
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative">
                <div className="flex items-center justify-between">
                  <span>{college.shortName}</span>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(college.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Location</td>
            {colleges.map((college) => (
              <td key={college.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                {college.location}, {college.state}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Fees</td>
            {colleges.map((college) => (
              <td key={college.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                ₹{college.fees.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Rating</td>
            {colleges.map((college) => (
              <td key={college.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                ⭐ {college.rating}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Placement Score</td>
            {colleges.map((college) => (
              <td key={college.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                {college.placementScore}%
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">NIRF Rank</td>
            {colleges.map((college) => (
              <td key={college.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                {college.nirfRank ? `#${college.nirfRank}` : 'N/A'}
              </td>
            ))}
          </tr>
          {colleges.some(c => c.acceptedExams) && (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Accepted Exams</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-6 py-4 text-gray-600">
                  {college.acceptedExams?.split(',').join(', ') || 'N/A'}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
