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
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const webcamRef = useRef(null);

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUkTTEwC-6rkXCixBQ3LlrzngmtjXIwwBcPVqsfjWGPaPwieG36RdvDrziliBOQBncDQ/exec";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLokasi('Menerjemahkan alamat...');
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data && data.display_name) {
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
    } else {
      setLokasi('Browser tidak mendukung lokasi');
    }
  }, []);

  const ambilFoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFoto(imageSrc);
  }, [webcamRef]);

  const hapusFoto = () => setFoto(null);

  const handleAbsen = async (e) => {
    e.preventDefault();

    if (!foto) {
      alert("Harap ambil foto selfie terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    const waktuSekarang = new Date();
    const formData = new FormData();
    formData.append('Tanggal', waktuSekarang.toLocaleDateString('id-ID'));
    formData.append('Waktu', waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    formData.append('Nama', nama);
    formData.append('Lokasi', lokasi);
    formData.append('Status', status);
    formData.append('Foto', foto);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      const dataBaru = {
        Tanggal: waktuSekarang.toLocaleDateString('id-ID'),
        Waktu: waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        Nama: nama,
        Status: status,
        Lokasi: lokasi,
        Foto: foto
      };
      setRiwayatAbsen([...riwayatAbsen, dataBaru]);
      setNama('');
      setStatus('Hadir');
      setFoto(null);
      alert("Absen berhasil!");
    } catch {
      alert("Gagal mengirim data!");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = () => {
    if (riwayatAbsen.length === 0) return alert("Belum ada data!");
    const dataUntukExcel = riwayatAbsen.map(({ Foto, ...sisa }) => sisa);
    const worksheet = XLSX.utils.json_to_sheet(dataUntukExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Absensi");
    XLSX.writeFile(workbook, "Data_Absensi_JNN.xlsx");
  };

  const formatLokasi = (loc) => {
    if (loc.includes(',')) {
      const parts = loc.split(',');
      return (
        <>
          <div className="location-name">{parts[0].trim()}</div>
          <div className="location-detail">{parts.slice(1).join(',').trim()}</div>
        </>
      );
    }
    return <div className="location-name">{loc}</div>;
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-icon">🏢</div>
        <h1>Absensi JNN Laundry</h1>
        <p>Sistem absensi digital dengan verifikasi foto & lokasi</p>
        <div className="header-time">
          🕐 {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          &nbsp;|&nbsp;
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="glass-card">
        <form onSubmit={handleAbsen} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* WEBCAM */}
          <div className="field-group">
            <label className="field-label">📷 Foto Selfie</label>
            <div className="webcam-wrapper">
              {!foto ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    mirrored
                  />
                  <div className="webcam-overlay">
                    <span className="dot"></span> Kamera Aktif
                  </div>
                </>
              ) : (
                <img src={foto} alt="Selfie Absen" />
              )}
            </div>
            {!foto ? (
              <button type="button" onClick={ambilFoto} className="btn-camera shoot">
                📸 Ambil Foto
              </button>
            ) : (
              <button type="button" onClick={hapusFoto} className="btn-camera retake">
                🔄 Foto Ulang
              </button>
            )}
          </div>

          {/* LOKASI */}
          <div className="field-group">
            <label className="field-label">📍 Lokasi Saat Ini</label>
            <div className="location-box">
              <span className="location-icon">📌</span>
              <div className="location-text">{formatLokasi(lokasi)}</div>
            </div>
          </div>

          {/* NAMA */}
          <div className="field-group">
            <label className="field-label">👤 Nama Karyawan</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap..."
              required
              className="field-input"
            />
          </div>

          {/* STATUS */}
          <div className="field-group">
            <label className="field-label">✅ Status Kehadiran</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field-select"
            >
              <option value="Hadir">✅ Hadir</option>
              <option value="Sakit">🤒 Sakit</option>
              <option value="Izin">📋 Izin</option>
              <option value="Cuti">🏖️ Cuti</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div> Mengirim Data...
              </>
            ) : (
              '🚀 Kirim Absen'
            )}
          </button>
        </form>
      </div>

      {/* HISTORY CARD */}
      <div className="glass-card">
        <div className="history-header">
          <div className="history-title">
            📋 Riwayat Hari Ini
            <span className="history-count">{riwayatAbsen.length}</span>
          </div>
          <button onClick={downloadExcel} className="btn-excel">
            📥 Unduh Excel
          </button>
        </div>

        <div className="table-wrap">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Waktu</th>
                  <th>Nama</th>
                  <th style={{ minWidth: '180px' }}>Lokasi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayatAbsen.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div className="empty-state-icon">📭</div>
                      <div className="empty-state-text">Belum ada yang absen hari ini</div>
                    </td>
                  </tr>
                ) : (
                  riwayatAbsen.map((absen, index) => (
                    <tr key={index}>
                      <td>
                        <img src={absen.Foto} alt="Bukti" className="avatar" />
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{absen.Waktu}</td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{absen.Nama}</td>
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
    </div>
  );
}

export default App;
