import { NavLink } from "react-router-dom";
import { getNavItemsForRole } from "./navItems";
import { useAuth } from "../../context/AuthContext";
import { rolePermissions } from "../../lib/permissions";

export function Sidebar() {
  const { role } = useAuth();
  const { primary, secondary } = getNavItemsForRole(role);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-700">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M16 6L27 12.5V14H5V12.5L16 6Z" fill="#FFFFFF" />
            <rect x="7" y="15" width="3" height="10" fill="#FFFFFF" />
            <rect x="14.5" y="15" width="3" height="10" fill="#FFFFFF" />
            <rect x="22" y="15" width="3" height="10" fill="#FFFFFF" />
            <rect x="5" y="26" width="22" height="2.4" fill="#FFFFFF" />
          </svg>
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-bold text-gray-900">Sistem Aset Daerah</div>
          <div className="truncate text-[11px] text-gray-400">Portal Terintegrasi</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {primary.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-surface-alt hover:text-gray-900"
                  }`
                }
              >
                <item.icon size={17} strokeWidth={2} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <ul className="space-y-0.5">
            {secondary.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-surface-alt hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon size={17} strokeWidth={2} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-gray-100 px-4 py-3">
        {role && (
          <p className="text-[11px] leading-relaxed text-gray-400">
            <span className="font-medium text-gray-500">Hak akses {role}: </span>
            {rolePermissions[role].description}
          </p>
        )}
      </div>
    </aside>
  );
}
