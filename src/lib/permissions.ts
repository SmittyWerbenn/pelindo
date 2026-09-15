import type { Role } from "../types";

const gatedPaths = ["/bapenda", "/laporan", "/survey"] as const;
export type GatedPath = (typeof gatedPaths)[number];

interface RoleCapability {
  paths: GatedPath[];
  canManageAset: boolean;
  description: string;
}

export const rolePermissions: Record<Role, RoleCapability> = {
  "Admin Aset": {
    paths: ["/bapenda", "/laporan", "/survey"],
    canManageAset: true,
    description: "Akses penuh: kelola data aset, pantau Bapenda, laporan, dan survey.",
  },
  "Petugas Lapangan": {
    paths: ["/survey"],
    canManageAset: false,
    description: "Fokus pendataan lapangan — tidak memiliki akses ke Integrasi Bapenda & Laporan.",
  },
  Pimpinan: {
    paths: ["/bapenda", "/laporan"],
    canManageAset: false,
    description: "Akses monitoring & laporan (lihat saja) — tidak dapat mengubah data.",
  },
  Auditor: {
    paths: ["/bapenda", "/laporan"],
    canManageAset: false,
    description: "Akses audit & laporan (lihat saja) — tidak dapat mengubah data.",
  },
};

export function canAccessPath(role: Role | null, path: GatedPath): boolean {
  if (!role) return false;
  return rolePermissions[role].paths.includes(path);
}

export function isGatedPath(path: string): path is GatedPath {
  return (gatedPaths as readonly string[]).includes(path);
}
