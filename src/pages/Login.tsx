import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { rolePermissions } from "../lib/permissions";
import type { Role } from "../types";

const roles: Role[] = ["Admin Aset", "Petugas Lapangan", "Bapenda", "Pimpinan", "Auditor"];

export default function Login() {
  const [role, setRole] = useState<Role>("Admin Aset");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(role === "Petugas Lapangan" ? "/survey" : "/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Illustration panel */}
      <div className="relative hidden w-[42%] flex-col justify-between bg-primary-800 px-12 py-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M16 6L27 12.5V14H5V12.5L16 6Z" fill="#FFFFFF" />
              <rect x="7" y="15" width="3" height="10" fill="#FFFFFF" />
              <rect x="14.5" y="15" width="3" height="10" fill="#FFFFFF" />
              <rect x="22" y="15" width="3" height="10" fill="#FFFFFF" />
              <rect x="5" y="26" width="22" height="2.4" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">Sistem Aset Daerah Terintegrasi</span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <MapIllustration />
        </div>

        <div>
          <p className="text-lg font-semibold leading-snug text-white">
            Satu platform untuk seluruh data aset daerah.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-primary-200">
            Kelola, petakan, dan pantau status aset daerah secara terpusat —
            terhubung langsung dengan data Bapenda.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-700 lg:hidden">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M16 6L27 12.5V14H5V12.5L16 6Z" fill="#FFFFFF" />
                <rect x="7" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="14.5" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="22" y="15" width="3" height="10" fill="#FFFFFF" />
                <rect x="5" y="26" width="22" height="2.4" fill="#FFFFFF" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Sistem Aset Daerah Terintegrasi</h1>
            <p className="mt-1.5 text-sm text-gray-500">Sistem Informasi Pengelolaan Aset Daerah</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email / Username</label>
              <input
                type="text"
                defaultValue="admin.aset@pemda.go.id"
                placeholder="Masukkan email atau username"
                className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="••••••••"
                  placeholder="Masukkan kata sandi"
                  className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-300"
                />
                Ingat saya
              </label>
              <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Lupa kata sandi?
              </button>
            </div>

            <div className="pt-2">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-400">
                Login sebagai (Demo Role)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      role === r
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-gray-400">{rolePermissions[role].description}</p>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-primary-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
            >
              MASUK
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Prototype demonstrasi — tidak terhubung ke sistem produksi atau data sesungguhnya.
          </p>
        </div>
      </div>
    </div>
  );
}

function MapIllustration() {
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" fill="none" className="opacity-90">
      <rect x="10" y="10" width="260" height="200" rx="8" stroke="#4c81d1" strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M10 90 L90 60 L170 100 L270 70" stroke="#4c81d1" strokeWidth="1.2" opacity="0.5" />
      <path d="M40 210 L60 130 L140 170 L200 110 L260 150" stroke="#4c81d1" strokeWidth="1.2" opacity="0.5" />
      <g transform="translate(120,60)">
        <path d="M20 0C9 0 0 9 0 20c0 15 20 32 20 32s20-17 20-32C40 9 31 0 20 0z" fill="#ffffff" />
        <circle cx="20" cy="20" r="8" fill="#1f4a8a" />
      </g>
      <g transform="translate(60,110)" opacity="0.85">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 24 15 24s15-13 15-24C30 6.7 23.3 0 15 0z" fill="#7ea9e4" />
        <circle cx="15" cy="15" r="6" fill="#ffffff" />
      </g>
      <g transform="translate(190,130)" opacity="0.85">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 24 15 24s15-13 15-24C30 6.7 23.3 0 15 0z" fill="#7ea9e4" />
        <circle cx="15" cy="15" r="6" fill="#ffffff" />
      </g>
      <g transform="translate(30,150)">
        <rect x="0" y="18" width="34" height="26" fill="#ffffff" opacity="0.9" />
        <path d="M-3 18L17 4L37 18" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <rect x="14" y="28" width="6" height="16" fill="#1f4a8a" />
      </g>
    </svg>
  );
}
