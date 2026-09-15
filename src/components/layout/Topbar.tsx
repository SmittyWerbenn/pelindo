import { Search, Bell, LogOut, Menu, ChevronDown, X, CheckCheck, TriangleAlert, ClipboardList, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AssetSearch } from "./AssetSearch";
import { notifikasiAwal, type Notifikasi, type TipeNotifikasi } from "../../data/notifications";

const notifIcon: Record<TipeNotifikasi, typeof CheckCheck> = {
  berhasil: CheckCheck,
  peringatan: TriangleAlert,
  verifikasi: ClipboardList,
  info: Info,
};

const notifTone: Record<TipeNotifikasi, string> = {
  berhasil: "text-status-green bg-status-green-bg",
  peringatan: "text-status-red bg-status-red-bg",
  verifikasi: "text-status-yellow bg-status-yellow-bg",
  info: "text-status-blue bg-status-blue-bg",
};

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { role, nama, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>(notifikasiAwal);

  const unreadCount = notifikasi.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotifClick = (n: Notifikasi) => {
    setNotifikasi((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    if (n.kode) navigate(`/data-aset/${n.kode}`);
    setOpenNotif(false);
  };

  const markAllRead = () => {
    setNotifikasi((prev) => prev.map((x) => ({ ...x, read: true })));
  };

  const initials = nama
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-surface-alt lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="hidden text-[15px] font-semibold text-gray-900 lg:block">{title}</h1>

      <div className="ml-auto flex items-center gap-2 lg:gap-4">
        <div className="hidden md:block md:w-64 lg:w-72">
          <AssetSearch />
        </div>

        <button
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-surface-alt md:hidden"
          aria-label="Cari aset"
        >
          <Search size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-surface-alt"
            aria-label="Notifikasi"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-status-red" />
            )}
          </button>

          {openNotif && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpenNotif(false)} />
              <div className="absolute right-0 top-11 z-40 w-80 rounded-md border border-gray-200 bg-white shadow-lg shadow-gray-900/5 sm:right-0">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <span className="text-sm font-semibold text-gray-800">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifikasi.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">Tidak ada notifikasi</div>
                  ) : (
                    notifikasi.map((n) => {
                      const Icon = notifIcon[n.tipe];
                      return (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left last:border-0 hover:bg-surface ${
                            n.read ? "" : "bg-primary-50/40"
                          }`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notifTone[n.tipe]}`}>
                            <Icon size={14} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-sm font-medium text-gray-800">{n.judul}</span>
                              {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />}
                            </div>
                            <p className="mt-0.5 text-xs leading-snug text-gray-500">{n.deskripsi}</p>
                            <span className="mt-1 block text-[11px] text-gray-400">{n.waktu}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-surface-alt"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-gray-800">{nama}</span>
              <span className="block text-[11px] leading-tight text-gray-400">{role}</span>
            </span>
            <ChevronDown size={14} className="hidden text-gray-400 sm:block" />
          </button>

          {openMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(false)} />
              <div className="absolute right-0 top-11 z-40 w-52 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg shadow-gray-900/5">
                <div className="border-b border-gray-100 px-3.5 py-2.5">
                  <div className="text-sm font-medium text-gray-800">{nama}</div>
                  <div className="text-xs text-gray-400">Peran: {role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-status-red hover:bg-status-red-bg"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-16 z-30 border-b border-gray-200 bg-white p-3 shadow-sm md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AssetSearch autoFocus onNavigate={() => setMobileSearchOpen(false)} />
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-surface-alt"
              aria-label="Tutup pencarian"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
