import { Building2, LandPlot, Camera, FileText } from "lucide-react";
import type { JenisAset } from "../../types";

interface AssetPhotoProps {
  jenis: JenisAset;
  label?: string;
  className?: string;
  iconSize?: number;
}

export function AssetPhoto({ jenis, label, className = "", iconSize = 28 }: AssetPhotoProps) {
  const Icon = jenis === "Tanah" ? LandPlot : Building2;
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1.5 overflow-hidden bg-primary-50 ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #15417E 0, #15417E 1px, transparent 1px, transparent 14px)",
      }} />
      <Icon size={iconSize} strokeWidth={1.5} className="relative text-primary-400" />
      {label && <span className="relative text-[11px] font-medium text-primary-500">{label}</span>}
    </div>
  );
}

export function DocThumb({ nama, tipe }: { nama: string; tipe: "foto" | "dokumen" }) {
  const Icon = tipe === "foto" ? Camera : FileText;
  return (
    <div className="group flex cursor-pointer flex-col gap-2">
      <div className="flex h-20 items-center justify-center rounded-md border border-gray-200 bg-surface-alt transition-colors group-hover:border-primary-300 group-hover:bg-primary-50">
        <Icon size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary-500" />
      </div>
      <span className="truncate text-xs text-gray-600">{nama}</span>
    </div>
  );
}
