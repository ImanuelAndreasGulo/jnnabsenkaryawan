export function Header({ currentTime }) {
  return (
    <header className="mb-10 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] text-2xl shadow-sm">
        🏢
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
        Absensi JNN Laundry
      </h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Sistem absensi digital dengan verifikasi foto & lokasi
      </p>
      <div
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm"
        aria-live="polite"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
        {currentTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
        <span className="text-[var(--color-border)]">|</span>
        {currentTime.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </header>
  );
}
