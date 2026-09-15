import { useNavigate } from "react-router-dom";
import { CheckCheck, RefreshCw, XCircle, Landmark } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { KPICard } from "../components/ui/KPICard";
import { StatusBapendaBadge } from "../components/ui/StatusBadge";
import { useAssets } from "../context/AssetContext";
import { formatRupiahFull, formatTanggal } from "../lib/format";

export default function IntegrasiBapenda() {
  const navigate = useNavigate();
  const { assets } = useAssets();

  const terverifikasi = assets.filter((a) => a.bapenda.statusVerifikasi === "Terverifikasi").length;
  const perluCheck = assets.filter((a) => a.bapenda.statusVerifikasi === "Perlu Cross Check").length;
  const tidakSesuai = assets.filter((a) => a.bapenda.statusVerifikasi === "Tidak Sesuai").length;

  return (
    <div>
      <PageHeader
        title="Integrasi Bapenda"
        subtitle="Status keselarasan data aset dengan basis data pajak Bapenda (NOP & NJOP). Data ini disinkronkan dari sistem Bapenda."
      />

      <div className="space-y-5 p-4 lg:p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KPICard label="Total Data Aset" value={String(assets.length)} icon={Landmark} tone="default" />
          <KPICard label="Terverifikasi" value={String(terverifikasi)} icon={CheckCheck} tone="green" />
          <KPICard label="Perlu Cross Check" value={String(perluCheck)} icon={RefreshCw} tone="yellow" />
          <KPICard label="Tidak Sesuai" value={String(tidakSesuai)} icon={XCircle} tone="red" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3.5">
            <h3 className="text-sm font-semibold text-gray-800">Rincian Cross Check per Aset</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-surface text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3">Kode Aset</th>
                  <th className="px-4 py-3">NOP</th>
                  <th className="px-4 py-3 text-right">NJOP</th>
                  <th className="px-4 py-3">Status Pajak</th>
                  <th className="px-4 py-3">Status Verifikasi</th>
                  <th className="px-4 py-3">Terakhir Cross Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map((a) => (
                  <tr
                    key={a.kode}
                    onClick={() => navigate(`/data-aset/${a.kode}`)}
                    className="cursor-pointer hover:bg-surface"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-primary-700">{a.kode}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] text-gray-600">{a.bapenda.nop}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">{formatRupiahFull(a.bapenda.totalNjop)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{a.bapenda.statusPajak}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBapendaBadge status={a.bapenda.statusVerifikasi} size="sm" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatTanggal(a.bapenda.terakhirCrossCheck)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
