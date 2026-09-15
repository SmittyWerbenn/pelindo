import type { StatusAset, StatusVerifikasiBapenda } from "../types";

export const statusAsetConfig: Record<
  StatusAset,
  { label: string; color: string; bg: string; dot: string }
> = {
  "Aktif Digunakan": { label: "Aktif Digunakan", color: "text-status-green", bg: "bg-status-green-bg", dot: "#1a8a4a" },
  Idle: { label: "Idle", color: "text-status-yellow", bg: "bg-status-yellow-bg", dot: "#b7791f" },
  Disewakan: { label: "Disewakan", color: "text-status-blue", bg: "bg-status-blue-bg", dot: "#2c60ad" },
  Bermasalah: { label: "Bermasalah", color: "text-status-red", bg: "bg-status-red-bg", dot: "#c23a3a" },
  "Belum Diverifikasi": { label: "Belum Diverifikasi", color: "text-status-gray", bg: "bg-status-gray-bg", dot: "#6b7280" },
};

export const statusBapendaConfig: Record<
  StatusVerifikasiBapenda,
  { label: string; color: string; bg: string }
> = {
  Terverifikasi: { label: "Terverifikasi", color: "text-status-green", bg: "bg-status-green-bg" },
  "Perlu Cross Check": { label: "Perlu Cross Check", color: "text-status-yellow", bg: "bg-status-yellow-bg" },
  "Tidak Sesuai": { label: "Tidak Sesuai", color: "text-status-red", bg: "bg-status-red-bg" },
};
