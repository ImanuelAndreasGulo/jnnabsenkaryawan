import { useState, useRef, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Webcam from 'react-webcam';
import './App.css'; 

function App() {
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [riwayatAbsen, setRiwayatAbsen] = useState([]);
  
  const [foto, setFoto] = useState(null);
  const [lokasi, setLokasi] = useState('Mencari lokasi...');
  
  const webcamRef = useRef(null);

  // --- BAGIAN YANG DIPERBARUI: REVERSE GEOCODING ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Tampilkan status sedang mencari alamat
          setLokasi('Menerjemahkan alamat...'); 

          try {
            // Menggunakan API gratis OpenStreetMap untuk mengubah koordinat jadi alamat
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            
            if (data && data.display_name) {
              // Jika berhasil, tampilkan alamat lengkapnya
              setLokasi(data.display_name);
            } else {
              // Jika gagal dapat nama jalan, kembalikan ke format koordinat
              setLokasi(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
            }
          } catch (error) {
             setLokasi(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          }
        },
        (error) => {
          setLokasi('Akses lokasi ditolak/gagal');
        }
      );
    } else {
      setLokasi('Browser tidak mendukung lokasi');
    }
  }, []);
  // ------------------------------------------------

  const ambilFoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFoto(imageSrc);
  }, [webcamRef]);

  const hapusFoto = () => setFoto(null);

  // Buat state untuk efek loading saat ngirim data
  const [isLoading, setIsLoading] = useState(false);

  // Taruh URL Aplikasi Web yang kamu Copy tadi di dalam tanda kutip ini:
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUkTTEwC-6rkXCixBQ3LlrzngmtjXIwwBcPVqsfjWGPaPwieG36RdvDrziliBOQBncDQ/exec";

  const handleAbsen = async (e) => {
    e.preventDefault(); 
    
    if (!foto) {
      alert("Harap ambil foto selfie terlebih dahulu sebelum absen!");
      return;
    }

    setIsLoading(true); // Menyalakan status loading

    const waktuSekarang = new Date();
    
    // Menggunakan FormData agar tidak terkena error CORS dari Google
    const formData = new FormData();
    formData.append('Tanggal', waktuSekarang.toLocaleDateString('id-ID'));
    formData.append('Waktu', waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    formData.append('Nama', nama);
    formData.append('Lokasi', lokasi);
    formData.append('Status', status);
    formData.append('Foto', foto);

    try {
      // Mengirim data ke Google Sheets
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Penting agar Google tidak memblokir pengiriman
      });

      // Menambahkan ke tabel di layar juga (riwayat)
      const dataBaru = {
        Tanggal: waktuSekarang.toLocaleDateString('id-ID'),
        Waktu: waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        Nama: nama,
        Status: status,
        Lokasi: lokasi,
        Foto: foto 
      };
      setRiwayatAbsen([...riwayatAbsen, dataBaru]);
      
      // Bersihkan form
      setNama(''); 
      setStatus('Hadir');
      setFoto(null);
      alert("Absen berhasil disimpan ke Google Sheets!");

    } catch (error) {
      alert("Gagal mengirim data ke server!");
    } finally {
      setIsLoading(false); // Mematikan status loading
    }
  };

  const downloadExcel = () => {
    if (riwayatAbsen.length === 0) return alert("Belum ada data!");
    
    const dataUntukExcel = riwayatAbsen.map(({ Foto, ...dataLainnya }) => dataLainnya);

    const worksheet = XLSX.utils.json_to_sheet(dataUntukExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Absensi");
    XLSX.writeFile(workbook, "Data_Absensi_JNN_Lengkap.xlsx");
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Absensi JNN</h2>
        <form onSubmit={handleAbsen} className="form-group">
          
          <div className="input-group">
            <label>Kamera (Wajib Selfie)</label>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {!foto ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <button type="button" onClick={ambilFoto} className="btn-primary" style={{ width: '100%', backgroundColor: '#3b82f6' }}>
                    📸 Ambil Foto
                  </button>
                </>
              ) : (
                <>
                  <img src={foto} alt="Selfie Absen" style={{ width: '100%', borderRadius: '8px', border: '2px solid #10b981' }} />
                  <button type="button" onClick={hapusFoto} className="btn-primary" style={{ width: '100%', backgroundColor: '#ef4444' }}>
                    🔄 Foto Ulang
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>Lokasi Saat Ini</label>
            {/* Mengubah input menjadi textarea agar alamat yang panjang bisa muat */}
            <textarea 
              value={lokasi} 
              readOnly 
              className="input-field" 
              style={{ backgroundColor: '#f1f5f9', color: '#64748b', resize: 'none', height: '80px', fontSize: '12px' }} 
            />
          </div>

          <div className="input-group">
            <label>Nama Karyawan</label>
            <input 
              type="text" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              placeholder="Masukkan nama Anda..."
              required 
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Status Kehadiran</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
            >
              <option value="Hadir">Hadir</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
              <option value="Cuti">Cuti</option>
            </select>
          </div>

          {/* Ubah tombol kirim ini */}
          <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Mengirim Data..." : "Kirim Absen"}
          </button>
        </form>
      </div>

      <div className="card mt-4">
        <div className="header-riwayat">
          <h3 className="subtitle">Riwayat Hari Ini</h3>
          <button onClick={downloadExcel} className="btn-excel">
            Unduh Excel
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Waktu</th>
                <th>Nama</th>
                <th style={{ minWidth: '200px' }}>Alamat Lokasi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {riwayatAbsen.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center empty-state">Belum ada yang absen hari ini.</td>
                </tr>
              ) : (
                riwayatAbsen.map((absen, index) => (
                  <tr key={index}>
                    <td>
                      <img src={absen.Foto} alt="Bukti" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{absen.Waktu}</td>
                    <td className="fw-bold">{absen.Nama}</td>
                    <td style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>{absen.Lokasi}</td>
                    <td>
                      <span className={`badge ${absen.Status.toLowerCase()}`}>
                        {absen.Status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;