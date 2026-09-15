import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, ClipboardList, Building2, Landmark, FileBarChart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { canAccessPath } from "../../lib/permissions";

const baseItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Peta", path: "/peta-aset", icon: MapPin },
];

const trailingItem = { label: "Data Aset", path: "/data-aset", icon: Building2 };

export function MobileBottomNav() {
  const { role } = useAuth();

  const thirdItem = canAccessPath(role, "/survey")
    ? { label: "Survey", path: "/survey", icon: ClipboardList }
    : canAccessPath(role, "/bapenda")
      ? { label: "Bapenda", path: "/bapenda", icon: Landmark }
      : { label: "Laporan", path: "/laporan", icon: FileBarChart };

  const items = [...baseItems, thirdItem, trailingItem];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-gray-200 bg-white lg:hidden">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              isActive ? "text-primary-700" : "text-gray-400"
            }`
          }
        >
          <item.icon size={19} strokeWidth={2} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
