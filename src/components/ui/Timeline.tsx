import type { RiwayatEntry } from "../../types";
import { formatTanggal } from "../../lib/format";
import { StatusAsetBadge } from "./StatusBadge";
import { ArrowRight } from "lucide-react";

export function Timeline({ entries }: { entries: RiwayatEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.tahun - a.tahun);
  return (
    <div>
      {sorted.map((entry, i) => (
        <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
          {i !== sorted.length - 1 && (
            <span className="absolute left-[7px] top-4 h-full w-px bg-gray-200" />
          )}
          <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary-500 bg-white" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold text-gray-900">{entry.tahun}</span>
              <span className="text-xs text-gray-400">{formatTanggal(entry.tanggal)}</span>
            </div>
            <div className="mt-0.5 text-sm font-medium text-gray-800">{entry.judul}</div>
            <p className="mt-0.5 text-sm text-gray-500">{entry.keterangan}</p>
            {entry.statusSesudah && (
              <div className="mt-2 flex items-center gap-2">
                {entry.statusSebelum && (
                  <>
                    <StatusAsetBadge status={entry.statusSebelum} size="sm" />
                    <ArrowRight size={12} className="text-gray-300" />
                  </>
                )}
                <StatusAsetBadge status={entry.statusSesudah} size="sm" />
              </div>
            )}
            <div className="mt-2 text-xs text-gray-400">Oleh {entry.pengguna}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
