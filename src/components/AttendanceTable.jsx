import { StatusBadge } from './StatusBadge';

export function AttendanceTable({ riwayatAbsen }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          Riwayat Hari Ini
        </h2>
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-bold text-white">
          {riwayatAbsen.length}
        </span>
      </div>

      {riwayatAbsen.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-gray-50/80">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]" scope="col">
                        Foto
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]" scope="col">
                        Waktu
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]" scope="col">
                        Nama
                      </th>
                      <th className="min-w-[180px] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]" scope="col">
                        Lokasi
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]" scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {riwayatAbsen.map((absen, index) => (
                      <tr
                        key={`${absen.Tanggal}-${absen.Waktu}-${absen.Nama}-${index}`}
                        className="transition-colors duration-150 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={absen.Foto}
                            alt={`Bukti selfie ${absen.Nama}`}
                            className="h-9 w-9 rounded-lg border border-[var(--color-border)] object-cover"
                            loading="lazy"
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--color-text)]">
                          {absen.Waktu}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                          {absen.Nama}
                        </td>
                        <td className="max-w-[220px] truncate px-4 py-3 text-xs text-[var(--color-text-secondary)]" title={absen.Lokasi}>
                          {absen.Lokasi}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={absen.Status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {riwayatAbsen.map((absen, index) => (
              <div
                key={`${absen.Tanggal}-${absen.Waktu}-${absen.Nama}-${index}`}
                className="animate-fadeIn rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={absen.Foto}
                    alt={`Bukti selfie ${absen.Nama}`}
                    className="h-10 w-10 flex-shrink-0 rounded-lg border border-[var(--color-border)] object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                        {absen.Nama}
                      </p>
                      <StatusBadge status={absen.Status} />
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {absen.Waktu}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]" title={absen.Lokasi}>
                      📍 {absen.Lokasi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-gray-50/50 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
        📭
      </div>
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">
        Belum ada yang absen hari ini
      </p>
    </div>
  );
}
