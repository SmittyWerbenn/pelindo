import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Building2,
  Wallet,
  CircleCheck,
  CircleDot,
  TriangleAlert,
  CircleHelp,
  CheckCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { KPICard } from "../components/ui/KPICard";
import { SectionCard } from "../components/ui/SectionCard";
import { AssetMap } from "../components/map/AssetMap";
import { MapLegend } from "../components/map/MapLegend";
import { AlurProses } from "../components/dashboard/AlurProses";
import { useAssets } from "../context/AssetContext";
import { kpiUtama, statusChartData, bapendaMonitoring } from "../data/dashboard";
import { aktivitasTerbaru } from "../data/activities";
import { formatNumber, formatRupiah } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const activityIcon = {
  verifikasi: CheckCheck,
  update: RefreshCw,
  "perlu-verifikasi": TriangleAlert,
  status: CircleDot,
};

const activityTone = {
  verifikasi: "text-status-green",
  update: "text-primary-600",
  "perlu-verifikasi": "text-status-yellow",
  status: "text-status-blue",
};

export default function Dashboard() {
  const { nama } = useAuth();
  const { assets } = useAssets();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Selamat datang kembali, ${nama}. Berikut ringkasan aset daerah per hari ini.`}
      />

      <div className="space-y-5 p-4 lg:p-6">
        {/* Primary KPI */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Aset Terdata</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50">
                <Building2 size={18} className="text-primary-600" />
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {formatNumber(kpiUtama.totalAset)}
            </div>
            <div className="mt-1 text-xs text-gray-400">Tanah &amp; bangunan seluruh kecamatan</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Nilai Aset</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50">
                <Wallet size={18} className="text-primary-600" />
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {formatRupiah(kpiUtama.totalNilai)}
            </div>
            <div className="mt-1 text-xs text-gray-400">Berdasarkan nilai perolehan tercatat</div>
          </div>
        </div>

        {/* Secondary KPI */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard label="Aset Aktif" value={formatNumber(kpiUtama.aktif)} icon={CircleCheck} tone="green" />
          <KPICard label="Aset Idle" value={formatNumber(kpiUtama.idle)} icon={CircleDot} tone="yellow" />
          <KPICard label="Aset Bermasalah" value={formatNumber(kpiUtama.bermasalah)} icon={TriangleAlert} tone="red" />
          <KPICard label="Belum Diverifikasi" value={formatNumber(kpiUtama.belumVerifikasi)} icon={CircleHelp} tone="gray" />
        </div>

        <SectionCard title="Alur Proses Aset">
          <AlurProses />
        </SectionCard>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Left: Map + Chart */}
          <div className="space-y-5 xl:col-span-2">
            <SectionCard
              title="Peta Sebaran Aset"
              action={
                <Link to="/peta-aset" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Buka peta penuh
                </Link>
              }
            >
              <AssetMap assets={assets} height="380px" />
              <MapLegend className="mt-4" />
            </SectionCard>

            <SectionCard title="Grafik Status Aset">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#eef1f6" />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f6f8fb" }}
                      formatter={(v) => [formatNumber(Number(v)), "Jumlah Aset"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                      {statusChartData.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Right: Bapenda monitoring + activity */}
          <div className="space-y-5">
            <SectionCard title="Monitoring Bapenda">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md bg-status-green-bg px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCheck size={16} className="text-status-green" />
                    <span className="text-sm font-medium text-gray-700">Terverifikasi</span>
                  </div>
                  <span className="text-sm font-bold text-status-green">
                    {formatNumber(bapendaMonitoring.terverifikasi)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-status-yellow-bg px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <RefreshCw size={16} className="text-status-yellow" />
                    <span className="text-sm font-medium text-gray-700">Perlu Cross Check</span>
                  </div>
                  <span className="text-sm font-bold text-status-yellow">
                    {formatNumber(bapendaMonitoring.perluCrossCheck)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-status-red-bg px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <XCircle size={16} className="text-status-red" />
                    <span className="text-sm font-medium text-gray-700">Data Tidak Sesuai</span>
                  </div>
                  <span className="text-sm font-bold text-status-red">
                    {formatNumber(bapendaMonitoring.tidakSesuai)}
                  </span>
                </div>
              </div>
              <Link
                to="/bapenda"
                className="mt-4 block text-center text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Lihat detail integrasi Bapenda
              </Link>
            </SectionCard>

            <SectionCard title="Aktivitas Terbaru">
              <ul className="space-y-4">
                {aktivitasTerbaru.map((a, i) => {
                  const Icon = activityIcon[a.tipe];
                  return (
                    <li key={i} className="flex gap-3">
                      <span className={`mt-0.5 shrink-0 ${activityTone[a.tipe]}`}>
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug text-gray-700">
                          <span className="font-semibold text-gray-900">{a.kode}</span> {a.teks}
                        </p>
                        <span className="text-xs text-gray-400">{a.waktu}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
