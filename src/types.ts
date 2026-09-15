export type StatusAset =
  | "Aktif Digunakan"
  | "Idle"
  | "Disewakan"
  | "Bermasalah"
  | "Belum Diverifikasi";

export type StatusVerifikasiBapenda =
  | "Terverifikasi"
  | "Perlu Cross Check"
  | "Tidak Sesuai";

export type JenisAset = "Tanah" | "Bangunan";

export interface RiwayatEntry {
  tahun: number;
  tanggal: string;
  judul: string;
  keterangan: string;
  statusSebelum?: StatusAset;
  statusSesudah?: StatusAset;
  pengguna: string;
}

export interface DokumenAset {
  nama: string;
  tipe: "foto" | "dokumen";
  kategori: string;
}

export interface DataBapenda {
  nop: string;
  njopPerM2: number;
  totalNjop: number;
  statusPajak: string;
  statusVerifikasi: StatusVerifikasiBapenda;
  catatan: string;
  terakhirCrossCheck: string;
}

export interface Aset {
  kode: string;
  nama: string;
  jenis: JenisAset;
  lokasi: string;
  kecamatan: string;
  kelurahan?: string;
  luas: number;
  statusKepemilikan: string;
  tahunPerolehan: number;
  sumberDana: string;
  nilaiPerolehan: number;
  penggunaan: string;
  status: StatusAset;
  lat: number;
  lng: number;
  fotoUrl?: string;
  bapenda: DataBapenda;
  riwayat: RiwayatEntry[];
  dokumen: DokumenAset[];
}

export type Role =
  | "Admin Aset"
  | "Petugas Lapangan"
  | "Pimpinan"
  | "Auditor";
