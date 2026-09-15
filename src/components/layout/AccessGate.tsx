import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { canAccessPath, rolePermissions, type GatedPath } from "../../lib/permissions";

export function AccessGate({ path, children }: { path: GatedPath; children: ReactNode }) {
  const { role } = useAuth();

  if (!canAccessPath(role, path)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-red-bg">
          <ShieldAlert size={24} className="text-status-red" />
        </span>
        <h2 className="text-base font-semibold text-gray-900">Akses Terbatas</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Peran <span className="font-medium text-gray-700">{role}</span> tidak memiliki akses ke halaman ini.
          {role && <> {rolePermissions[role].description}</>}
        </p>
        <Link
          to="/dashboard"
          className="mt-2 rounded-md bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-900"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
