export type TipeNotifikasi = "verifikasi" | "peringatan" | "info" | "berhasil";

export interface Notifikasi {
  id: number;
  judul: string;
  deskripsi: string;
  waktu: string;
  tipe: TipeNotifikasi;
  kode?: string;
  read: boolean;
}

export const notifikasiAwal: Notifikasi[] = [
  {
    id: 1,
    judul: "Verifikasi Bapenda selesai",
    deskripsi: "TNH-A-00123 telah diverifikasi oleh Bapenda, tidak ada tunggakan.",
    waktu: "10 menit lalu",
    tipe: "berhasil",
    kode: "TNH-A-00123",
    read: false,
  },
  {
    id: 2,
    judul: "Data tidak sesuai ditemukan",
    deskripsi: "TNH-A-00789 memiliki selisih luas lahan pada cross check terakhir.",
    waktu: "2 jam lalu",
    tipe: "peringatan",
    kode: "TNH-A-00789",
    read: false,
  },
  {
    id: 3,
    judul: "Menunggu verifikasi",
    deskripsi: "BGN-A-00399 membutuhkan verifikasi Bapenda segera.",
    waktu: "3 jam lalu",
    tipe: "verifikasi",
    kode: "BGN-A-00399",
    read: false,
  },
  {
    id: 4,
    judul: "Status aset berubah",
    deskripsi: "TNH-A-00567 berubah status menjadi Bermasalah oleh Petugas Lapangan.",
    waktu: "Kemarin, 16:20",
    tipe: "peringatan",
    kode: "TNH-A-00567",
    read: true,
  },
  {
    id: 5,
    judul: "Survey lapangan baru",
    deskripsi: "TNH-A-01203 telah didata oleh Petugas Lapangan, menunggu sinkronisasi.",
    waktu: "Kemarin, 09:05",
    tipe: "info",
    kode: "TNH-A-01203",
    read: true,
  },
];
