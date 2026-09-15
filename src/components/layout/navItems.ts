import {
  LayoutDashboard,
  MapPin,
  Building2,
  Landmark,
  History,
  FileBarChart,
  Settings,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "../../types";
import { isGatedPath, canAccessPath } from "../../lib/permissions";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Peta Aset", path: "/peta-aset", icon: MapPin },
  { label: "Data Aset", path: "/data-aset", icon: Building2 },
  { label: "Integrasi Bapenda", path: "/bapenda", icon: Landmark },
  { label: "Status & Riwayat", path: "/riwayat", icon: History },
  { label: "Laporan", path: "/laporan", icon: FileBarChart },
];

export const navItemsSecondary: NavItem[] = [
  { label: "Survey Lapangan", path: "/survey", icon: ClipboardList },
  { label: "Pengaturan", path: "/pengaturan", icon: Settings },
];

function filterByRole(items: NavItem[], role: Role | null): NavItem[] {
  return items.filter((item) => (isGatedPath(item.path) ? canAccessPath(role, item.path) : true));
}

export function getNavItemsForRole(role: Role | null) {
  return {
    primary: filterByRole(navItems, role),
    secondary: filterByRole(navItemsSecondary, role),
  };
}
