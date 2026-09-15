import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { FilterSelect } from "../components/ui/FilterSelect";
import { SectionCard } from "../components/ui/SectionCard";
import { Timeline } from "../components/ui/Timeline";
import { StatusAsetBadge } from "../components/ui/StatusBadge";
import { useAssets } from "../context/AssetContext";
import { formatTanggal } from "../lib/format";
import { ArrowRight } from "lucide-react";

export default function StatusRiwayat() {
  const navigate = useNavigate();
  const { assets, getAsset } = useAssets();
  const [kodeFilter, setKodeFilter] = useState("");

  const flatHistory = useMemo(
    () =>
      assets
        .flatMap((a) => a.riwayat.map((r) => ({ ...r, kode: a.kode, nama: a.nama })))
        .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)),
    [assets]
  );

  const filtered = useMemo(
    () => (kodeFilter ? flatHistory.filter((h) => h.kode === kodeFilter) : flatHistory),
    [flatHistory, kodeFilter]
  );

  const selectedAsset = kodeFilter ? getAsset(kodeFilter) : null;

  return (
    <div>
      <PageHeader title="Status & Riwayat" subtitle="Monitoring perubahan status dan riwayat seluruh aset daerah." />

      <div className="grid grid-cols-1 gap-5 p-4 xl:grid-cols-3 lg:p-6">
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
              <h3 className="text-sm font-semibold text-gray-800">Log Perubahan Aset</h3>
              <FilterSelect
                label="Semua Aset"
                value={kodeFilter}
                options={assets.map((a) => a.kode)}
                onChange={setKodeFilter}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-surface text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Kode Aset</th>
                    <th className="px-4 py-3">Aktivitas</th>
                    <th className="px-4 py-3">Perubahan Status</th>
                    <th className="px-4 py-3">Pengguna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((h, i) => (
                    <tr key={i} onClick={() => navigate(`/data-aset/${h.kode}`)} className="cursor-pointer hover:bg-surface">
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">{formatTanggal(h.tanggal)}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-primary-700">{h.kode}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="font-medium">{h.judul}</div>
                        <div className="text-xs text-gray-400">{h.keterangan}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {h.statusSesudah ? (
                          <div className="flex items-center gap-1.5">
                            {h.statusSebelum && (
                              <>
                                <StatusAsetBadge status={h.statusSebelum} size="sm" />
                                <ArrowRight size={11} className="text-gray-300" />
                              </>
                            )}
                            <StatusAsetBadge status={h.statusSesudah} size="sm" />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Tidak ada perubahan</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">{h.pengguna}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <SectionCard title={selectedAsset ? `Timeline — ${selectedAsset.kode}` : "Timeline Aset"} icon={History}>
            {selectedAsset ? (
              <Timeline entries={selectedAsset.riwayat} />
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                Pilih salah satu aset pada filter untuk melihat timeline riwayat lengkap.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
