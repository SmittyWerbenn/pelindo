import { useNavigate } from "react-router-dom";
import { Eye, Ruler } from "lucide-react";
import type { Aset } from "../../types";
import { AssetPhoto } from "../ui/AssetPhoto";
import { StatusAsetBadge } from "../ui/StatusBadge";
import { formatLuas } from "../../lib/format";

export function MarkerPopupCard({ asset }: { asset: Aset }) {
  const navigate = useNavigate();
  return (
    <div className="w-[260px] overflow-hidden">
      {asset.fotoUrl ? (
        <img src={asset.fotoUrl} className="h-28 w-full object-cover" />
      ) : (
        <AssetPhoto jenis={asset.jenis} className="h-28 w-full" iconSize={26} />
      )}
      <div className="p-3.5">
        <div className="text-[11px] font-medium tracking-wide text-primary-600">{asset.kode}</div>
        <div className="mt-0.5 text-sm font-semibold leading-snug text-gray-900">{asset.nama}</div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <Ruler size={13} />
          {formatLuas(asset.luas)}
        </div>
        <div className="mt-2">
          <StatusAsetBadge status={asset.status} size="sm" />
        </div>
        <button
          onClick={() => navigate(`/data-aset/${asset.kode}`)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-700 py-2 text-xs font-semibold text-white hover:bg-primary-800"
        >
          <Eye size={14} />
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
