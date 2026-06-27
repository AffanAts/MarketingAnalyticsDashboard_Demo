export default function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div
      className="bg-white rounded-lg p-5 shadow-sm ring-1 ring-black ring-opacity-5 flex flex-col gap-1.5"
      style={{ borderTopColor: accent, borderTopWidth: '3px' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {icon && (
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm"
            style={{ background: accent + '1A', color: accent }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-tight" style={{ color: accent }}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}
