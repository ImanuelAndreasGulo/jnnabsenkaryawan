import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { WebcamCapture } from './components/WebcamCapture';
import { LocationDisplay } from './components/LocationDisplay';
import { AttendanceForm } from './components/AttendanceForm';
import { AttendanceTable } from './components/AttendanceTable';
import { useClock } from './hooks/useClock';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

function App() {
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [foto, setFoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riwayatAbsen, setRiwayatAbsen] = useLocalStorage('riwayatAbsen', []);

  const currentTime = useClock();
  const lokasi = useGeolocation();

  const handleCapture = useCallback((imageSrc) => {
    setFoto(imageSrc);
  }, []);

  const handleRetake = useCallback(() => {
    setFoto(null);
  }, []);

  const handleAbsen = useCallback(
    async (e) => {
      e.preventDefault();

      if (!foto) {
        alert('Harap ambil foto selfie terlebih dahulu!');
        return;
      }

      setIsLoading(true);

      const waktuSekarang = new Date();
      const tanggal = waktuSekarang.toLocaleDateString('id-ID');
      const waktu = waktuSekarang.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const formData = new FormData();
      formData.append('Tanggal', tanggal);
      formData.append('Waktu', waktu);
      formData.append('Nama', nama);
      formData.append('Lokasi', lokasi);
      formData.append('Status', status);
      formData.append('Foto', foto);

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        });

        const dataBaru = {
          Tanggal: tanggal,
          Waktu: waktu,
          Nama: nama,
          Status: status,
          Lokasi: lokasi,
          Foto: foto,
        };

        setRiwayatAbsen((prev) => [...prev, dataBaru]);
        setNama('');
        setStatus('Hadir');
        setFoto(null);
        alert('Absen berhasil!');
      } catch {
        alert('Gagal mengirim data!');
      } finally {
        setIsLoading(false);
      }
    },
    [foto, nama, lokasi, status, setRiwayatAbsen]
  );

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <Header currentTime={currentTime} />

        <div className="mx-auto max-w-[480px] space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <form onSubmit={handleAbsen} className="space-y-5">
              <WebcamCapture
                onCapture={handleCapture}
                foto={foto}
                onRetake={handleRetake}
              />

              <LocationDisplay lokasi={lokasi} />

              <AttendanceForm
                isLoading={isLoading}
                nama={nama}
                onNamaChange={setNama}
                status={status}
                onStatusChange={setStatus}
              />
            </form>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <AttendanceTable riwayatAbsen={riwayatAbsen} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
