export function AttendanceForm({
  isLoading,
  nama,
  onNamaChange,
  status,
  onStatusChange,
}) {
  return (
    <>
      {/* NAMA */}
      <div className="space-y-2.5">
        <label
          htmlFor="nama-karyawan"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
        >
          Nama Karyawan
        </label>
        <input
          id="nama-karyawan"
          type="text"
          value={nama}
          onChange={(e) => onNamaChange(e.target.value)}
          placeholder="Masukkan nama lengkap..."
          required
          aria-required="true"
          autoComplete="name"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-gray-400 transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>

      {/* STATUS */}
      <div className="space-y-2.5">
        <label
          htmlFor="status-kehadiran"
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
        >
          Status Kehadiran
        </label>
        <select
          id="status-kehadiran"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-required="true"
          className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-text)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          <option value="Hadir">Hadir</option>
          <option value="Sakit">Sakit</option>
          <option value="Izin">Izin</option>
          <option value="Cuti">Cuti</option>
        </select>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[var(--color-primary-hover)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Mengirim Data...
          </>
        ) : (
          'Kirim Absen'
        )}
      </button>
    </>
  );
}
