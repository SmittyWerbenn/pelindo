import { User, Bell, Shield, Info } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useAuth } from "../context/AuthContext";

export default function Pengaturan() {
  const { nama, role } = useAuth();

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Kelola preferensi akun dan aplikasi." />

      <div className="grid grid-cols-1 gap-5 p-4 lg:grid-cols-3 lg:p-6">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Notifikasi" icon={Bell}>
            <ToggleRow label="Notifikasi aset perlu verifikasi" defaultChecked />
            <ToggleRow label="Notifikasi cross check Bapenda" defaultChecked />
            <ToggleRow label="Ringkasan laporan mingguan" />
            <ToggleRow label="Notifikasi survey lapangan baru" defaultChecked />
          </SectionCard>

          <SectionCard title="Keamanan" icon={Shield}>
            <ToggleRow label="Verifikasi dua langkah" />
            <ToggleRow label="Kunci sesi otomatis setelah 15 menit" defaultChecked />
            <ToggleRow label="Notifikasi login dari perangkat baru" defaultChecked />
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <SectionCard title="Profil Pengguna" icon={User}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-700 text-lg font-semibold text-white">
                {nama.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">{nama}</div>
                <div className="text-xs text-gray-400">Peran: {role}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Tentang Aplikasi" icon={Info}>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p>Sistem Aset Daerah Terintegrasi</p>
              <p className="text-xs text-gray-400">Versi Prototype 1.0 — untuk keperluan presentasi internal.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 border-b border-gray-50 py-3 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-300"
      />
    </label>
  );
}
