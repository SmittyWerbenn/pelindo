import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, MapPin } from "lucide-react";
import { useAssets } from "../../context/AssetContext";
import { StatusAsetBadge } from "../ui/StatusBadge";

export function AssetSearch({
  autoFocus = false,
  onNavigate,
}: {
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const { assets } = useAssets();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return assets
      .filter((a) =>
        `${a.kode} ${a.nama} ${a.lokasi} ${a.kecamatan} ${a.bapenda.nop}`.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [assets, query]);

  const go = (kode: string) => {
    navigate(`/data-aset/${kode}`);
    setQuery("");
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm focus-within:border-primary-400 focus-within:bg-white">
        <Search size={15} className="shrink-0 text-gray-400" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Cari kode aset, nama aset, NOP, atau lokasi..."
          className="w-full min-w-0 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-11 z-40 max-h-96 overflow-y-auto rounded-md border border-gray-200 bg-white py-1.5 shadow-lg shadow-gray-900/5">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Tidak ditemukan aset yang cocok dengan "{query}"
              </div>
            ) : (
              results.map((a) => (
                <button
                  key={a.kode}
                  onClick={() => go(a.kode)}
                  className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left hover:bg-surface"
                >
                  <MapPin size={14} className="mt-1 shrink-0 text-gray-300" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary-600">{a.kode}</span>
                      <StatusAsetBadge status={a.status} size="sm" />
                    </div>
                    <div className="truncate text-sm font-medium text-gray-800">{a.nama}</div>
                    <div className="truncate text-xs text-gray-400">{a.lokasi}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
