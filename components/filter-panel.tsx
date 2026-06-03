'use client';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  filters: {
    [key: string]: string;
  };
  onFilterChange: (key: string, value: string) => void;
  options: {
    [key: string]: FilterOption[];
  };
}

export default function FilterPanel({ filters, onFilterChange, options }: FilterPanelProps) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
      <div className="space-y-4">
        {Object.entries(options).map(([key, opts]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
              value={filters[key] || ''}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              {opts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
