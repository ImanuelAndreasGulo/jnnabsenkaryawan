import { useState, useEffect } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export function useGeolocation() {
  const [lokasi, setLokasi] = useState('Mencari lokasi...');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLokasi('Browser tidak mendukung lokasi');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLokasi('Menerjemahkan alamat...');

        try {
          const response = await fetch(
            `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();

          if (data?.display_name) {
            setLokasi(data.display_name);
          } else {
            setLokasi(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          }
        } catch {
          setLokasi(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
        }
      },
      () => setLokasi('Akses lokasi ditolak/gagal')
    );
  }, []);

  return lokasi;
}
