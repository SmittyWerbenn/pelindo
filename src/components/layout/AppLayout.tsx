import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileDrawer } from "./MobileDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import { navItems, navItemsSecondary } from "./navItems";

const allItems = [...navItems, ...navItemsSecondary];

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = allItems.find((i) => location.pathname.startsWith(i.path))?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setDrawerOpen(true)} title={title} />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <main className="flex-1 pb-16 lg:pb-0">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
