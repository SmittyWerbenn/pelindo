# Sistem Aset Daerah Terintegrasi

Prototype frontend untuk aplikasi pengelolaan aset daerah — dibuat untuk keperluan presentasi kepada stakeholder/Pemerintah Daerah. Fokus pada UI/UX dan alur aplikasi menggunakan mock/dummy data (tidak ada backend, database, atau integrasi produksi).

**Demo:** https://smittywerbenn.github.io/pelindo/

## Fitur

- Login dengan simulasi role (Admin Aset, Petugas Lapangan, Bapenda, Pimpinan, Auditor) dan hak akses per role
- Dashboard — KPI, peta sebaran aset, grafik status, monitoring Bapenda, aktivitas terbaru
- Peta Aset — peta interaktif dengan marker per status dan popup detail
- Data Aset — tabel dengan pencarian, filter, serta Tambah / Edit / Hapus aset (mock, state lokal)
- Detail Aset — informasi lengkap, lokasi, data Bapenda, riwayat (timeline), foto & dokumen
- Integrasi Bapenda — status verifikasi NOP/NJOP
- Status & Riwayat — log perubahan status seluruh aset
- Laporan — export ke Excel (.csv) dan PDF
- Tampilan mobile untuk Petugas Lapangan — form survey lapangan dengan simulasi sinkronisasi offline

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Di-deploy otomatis ke GitHub Pages lewat GitHub Actions setiap push ke branch `main`.
