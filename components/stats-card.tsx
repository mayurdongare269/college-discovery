interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
}

export default function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:border-blue-500 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
