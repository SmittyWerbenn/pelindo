export interface Aktivitas {
  waktu: string;
  kode: string;
  teks: string;
  tipe: "verifikasi" | "update" | "perlu-verifikasi" | "status";
}

export const aktivitasTerbaru: Aktivitas[] = [
  { waktu: "10 menit lalu", kode: "TNH-A-00123", teks: "diverifikasi oleh Bapenda", tipe: "verifikasi" },
  { waktu: "1 jam lalu", kode: "BGN-A-00301", teks: "diperbarui oleh Admin Aset", tipe: "update" },
  { waktu: "3 jam lalu", kode: "BGN-A-00399", teks: "membutuhkan verifikasi Bapenda", tipe: "perlu-verifikasi" },
  { waktu: "Kemarin, 16:20", kode: "TNH-A-00567", teks: "berubah status menjadi Bermasalah", tipe: "status" },
  { waktu: "Kemarin, 09:05", kode: "TNH-A-01203", teks: "didata oleh Petugas Lapangan", tipe: "update" },
  { waktu: "2 hari lalu", kode: "BGN-A-00512", teks: "cross check Bapenda selesai", tipe: "verifikasi" },
];
