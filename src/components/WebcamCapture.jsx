import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

export function WebcamCapture({ onCapture, foto, onRetake }) {
  const webcamRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  const ambilFoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const handleCameraError = useCallback(() => {
    setCameraError(true);
  }, []);

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Foto Selfie
      </label>

      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-gray-50 aspect-[4/3]">
        {cameraError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
              📷
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">Kamera tidak tersedia</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Pastikan kamera terhubung dan izin diberikan
              </p>
            </div>
          </div>
        ) : !foto ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored
              onUserMediaError={handleCameraError}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Kamera Aktif
              </div>
            </div>
          </>
        ) : (
          <img src={foto} alt="Selfie Absen" className="h-full w-full object-cover" />
        )}
      </div>

      {!foto ? (
        <button
          type="button"
          onClick={ambilFoto}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-150 hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 active:scale-[0.98]"
          aria-label="Ambil foto selfie"
        >
          📸 Ambil Foto
        </button>
      ) : (
        <button
          type="button"
          onClick={onRetake}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] shadow-sm transition-all duration-150 hover:bg-gray-50 hover:text-[var(--color-text)] hover:shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 active:scale-[0.98]"
          aria-label="Foto ulang"
        >
          🔄 Foto Ulang
        </button>
      )}
    </div>
  );
}
