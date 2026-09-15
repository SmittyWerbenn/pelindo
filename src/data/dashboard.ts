export const kpiUtama = {
  totalAset: 12458,
  totalNilai: 8_700_000_000_000,
  aktif: 9821,
  idle: 1548,
  bermasalah: 327,
  belumVerifikasi: 762,
};

export const statusChartData = [
  { status: "Aktif Digunakan", jumlah: kpiUtama.aktif, color: "#1a8a4a" },
  { status: "Idle", jumlah: kpiUtama.idle, color: "#b7791f" },
  { status: "Bermasalah", jumlah: kpiUtama.bermasalah, color: "#c23a3a" },
  { status: "Belum Diverifikasi", jumlah: kpiUtama.belumVerifikasi, color: "#6b7280" },
];

export const bapendaMonitoring = {
  terverifikasi: 10890,
  perluCrossCheck: 1204,
  tidakSesuai: 364,
};
