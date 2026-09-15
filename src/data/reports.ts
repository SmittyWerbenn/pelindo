import type { Aset } from "../types";
import { formatLuas, formatRupiahFull, formatTanggal } from "../lib/format";
import type { ReportColumn, ReportRow } from "../lib/export";

export interface ReportConfig {
  id: string;
  label: string;
  description: string;
  filename: string;
  columns: ReportColumn[];
  rows: ReportRow[];
}

const asetColumns: ReportColumn[] = [
  { key: "kode", label: "Kode Aset" },
  { key: "nama", label: "Nama Aset" },
  { key: "jenis", label: "Jenis" },
  { key: "lokasi", label: "Lokasi" },
  { key: "kecamatan", label: "Kecamatan" },
  { key: "luas", label: "Luas" },
  { key: "nilai", label: "Nilai Perolehan" },
  { key: "status", label: "Status" },
  { key: "statusBapenda", label: "Status Bapenda" },
];

function asetRows(assets: Aset[], filter?: (a: Aset) => boolean): ReportRow[] {
  return assets
    .filter((a) => (filter ? filter(a) : true))
    .map((a) => ({
      kode: a.kode,
      nama: a.nama,
      jenis: a.jenis,
      lokasi: a.lokasi,
      kecamatan: a.kecamatan,
      luas: formatLuas(a.luas),
      nilai: formatRupiahFull(a.nilaiPerolehan),
      status: a.status,
      statusBapenda: a.bapenda.statusVerifikasi,
    }));
}

const bapendaColumns: ReportColumn[] = [
  { key: "kode", label: "Kode Aset" },
  { key: "nop", label: "NOP" },
  { key: "njopPerM2", label: "NJOP / m²" },
  { key: "totalNjop", label: "Total NJOP" },
  { key: "statusPajak", label: "Status Pajak" },
  { key: "statusVerifikasi", label: "Status Verifikasi" },
  { key: "terakhirCrossCheck", label: "Terakhir Cross Check" },
];

function bapendaRows(assets: Aset[]): ReportRow[] {
  return assets.map((a) => ({
    kode: a.kode,
    nop: a.bapenda.nop,
    njopPerM2: formatRupiahFull(a.bapenda.njopPerM2),
    totalNjop: formatRupiahFull(a.bapenda.totalNjop),
    statusPajak: a.bapenda.statusPajak,
    statusVerifikasi: a.bapenda.statusVerifikasi,
    terakhirCrossCheck: formatTanggal(a.bapenda.terakhirCrossCheck),
  }));
}

const perubahanColumns: ReportColumn[] = [
  { key: "kode", label: "Kode Aset" },
  { key: "tanggal", label: "Tanggal" },
  { key: "aktivitas", label: "Aktivitas" },
  { key: "statusSebelum", label: "Status Sebelumnya" },
  { key: "statusSesudah", label: "Status Baru" },
  { key: "pengguna", label: "Pengguna" },
];

function perubahanRows(assets: Aset[]): ReportRow[] {
  return assets.flatMap((a) =>
    a.riwayat
      .filter((r) => r.statusSebelum && r.statusSesudah)
      .map((r) => ({
        kode: a.kode,
        tanggal: formatTanggal(r.tanggal),
        aktivitas: r.judul,
        statusSebelum: r.statusSebelum ?? "-",
        statusSesudah: r.statusSesudah ?? "-",
        pengguna: r.pengguna,
      }))
  );
}

export function buildReportConfigs(assets: Aset[]): ReportConfig[] {
  return [
    {
      id: "semua",
      label: "Laporan Seluruh Aset",
      description: "Rekap lengkap seluruh aset tanah dan bangunan",
      filename: "laporan-seluruh-aset",
      columns: asetColumns,
      rows: asetRows(assets),
    },
    {
      id: "aktif",
      label: "Laporan Aset Aktif",
      description: "Aset yang sedang digunakan secara aktif",
      filename: "laporan-aset-aktif",
      columns: asetColumns,
      rows: asetRows(assets, (a) => a.status === "Aktif Digunakan"),
    },
    {
      id: "idle",
      label: "Laporan Aset Idle",
      description: "Aset yang belum dimanfaatkan",
      filename: "laporan-aset-idle",
      columns: asetColumns,
      rows: asetRows(assets, (a) => a.status === "Idle"),
    },
    {
      id: "bermasalah",
      label: "Laporan Aset Bermasalah",
      description: "Aset dengan indikasi sengketa atau okupasi",
      filename: "laporan-aset-bermasalah",
      columns: asetColumns,
      rows: asetRows(assets, (a) => a.status === "Bermasalah"),
    },
    {
      id: "verifikasi",
      label: "Laporan Verifikasi Bapenda",
      description: "Status cross check NOP & NJOP tiap aset",
      filename: "laporan-verifikasi-bapenda",
      columns: bapendaColumns,
      rows: bapendaRows(assets),
    },
    {
      id: "perubahan",
      label: "Laporan Perubahan Aset",
      description: "Riwayat perubahan status seluruh aset",
      filename: "laporan-perubahan-aset",
      columns: perubahanColumns,
      rows: perubahanRows(assets),
    },
  ];
}
