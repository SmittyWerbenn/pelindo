import { useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { AssetMap } from "../components/map/AssetMap";
import { MapLegend } from "../components/map/MapLegend";
import { FilterSelect } from "../components/ui/FilterSelect";
import { useAssets } from "../context/AssetContext";
import type { StatusAset } from "../types";

const statusOptions: StatusAset[] = ["Aktif Digunakan", "Idle", "Disewakan", "Bermasalah", "Belum Diverifikasi"];

export default function PetaAset() {
  const { assets } = useAssets();
  const [status, setStatus] = useState("");
  const [kecamatan, setKecamatan] = useState("");

  const kecamatanOptions = useMemo(() => Array.from(new Set(assets.map((a) => a.kecamatan))).sort(), [assets]);

  const filtered = useMemo(
    () =>
      assets.filter((a) => {
        if (status && a.status !== status) return false;
        if (kecamatan && a.kecamatan !== kecamatan) return false;
        return true;
      }),
    [assets, status, kecamatan]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <PageHeader
        title="Peta Aset Daerah"
        subtitle="Sebaran lokasi aset tanah dan bangunan milik pemerintah daerah."
        action={
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Status Aset" value={status} options={statusOptions} onChange={setStatus} />
            <FilterSelect label="Kecamatan" value={kecamatan} options={kecamatanOptions} onChange={setKecamatan} />
          </div>
        }
      />
      <div className="relative flex-1 p-4 lg:p-6">
        <AssetMap assets={filtered} height="100%" className="h-full" />
        <div className="absolute bottom-9 left-9 z-[400] hidden rounded-lg border border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm lg:block">
          <MapLegend />
        </div>
        <div className="absolute right-9 top-9 z-[400] rounded-lg border border-gray-200 bg-white/95 px-3.5 py-2 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
          {filtered.length} aset ditampilkan
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
        <MapLegend />
      </div>
    </div>
  );
}
