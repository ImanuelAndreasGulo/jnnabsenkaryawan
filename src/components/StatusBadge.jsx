const statusStyles = {
  Hadir: 'bg-green-50 text-green-700 ring-green-600/20',
  Sakit: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  Izin: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Cuti: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-gray-600/20'}`}
      role="status"
    >
      {status}
    </span>
  );
}
