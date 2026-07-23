export function LocationDisplay({ lokasi }) {
  const isLoading = lokasi === 'Mencari lokasi...' || lokasi === 'Menerjemahkan alamat...';
  const isError =
    lokasi === 'Akses lokasi ditolak/gagal' ||
    lokasi === 'Browser tidak mendukung lokasi';

  const renderLokasi = (loc) => {
    if (loc.includes(',')) {
      const parts = loc.split(',');
      return (
        <div>
          <div className="font-medium text-[var(--color-text)]">{parts[0].trim()}</div>
          <div className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {parts.slice(1).join(',').trim()}
          </div>
        </div>
      );
    }
    return <div className="font-medium text-[var(--color-text)]">{loc}</div>;
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Lokasi Saat Ini
      </label>

      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
          isError
            ? 'border-red-200 bg-red-50'
            : isLoading
            ? 'border-[var(--color-border)] bg-gray-50'
            : 'border-green-200 bg-green-50'
        }`}
      >
        <div
          className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs ${
            isError
              ? 'bg-red-100 text-red-600'
              : isLoading
              ? 'bg-gray-200 text-gray-500'
              : 'bg-green-100 text-green-600'
          }`}
        >
          {isLoading ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <span aria-hidden="true">📍</span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm" aria-live="polite">
          {renderLokasi(lokasi)}
        </div>
      </div>
    </div>
  );
}
