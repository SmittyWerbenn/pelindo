import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { getNavItemsForRole } from "./navItems";
import { useAuth } from "../../context/AuthContext";

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role } = useAuth();
  const { primary, secondary } = getNavItemsForRole(role);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-700">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M16 6L27 12.5V14H5V12.5L16 6Z" fill="#FFFFFF" />
                <rect x="7" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="14.5" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="22" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="5" y="26" width="22" height="2.4" fill="#FFFFFF" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900">Sistem Aset Daerah</span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-surface-alt">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {[...primary, ...secondary].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-surface-alt"
                    }`
                  }
                >
                  <item.icon size={18} strokeWidth={2} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
