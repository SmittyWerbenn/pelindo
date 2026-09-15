import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Ruler,
  ScrollText,
  CalendarDays,
  Landmark,
  Download,
  Building2 as UsageIcon,
} from "lucide-react";
import { useAssets } from "../context/AssetContext";
import { AssetPhoto, DocThumb } from "../components/ui/AssetPhoto";
import { StatusAsetBadge, StatusBapendaBadge } from "../components/ui/StatusBadge";
import { SectionCard } from "../components/ui/SectionCard";
import { Timeline } from "../components/ui/Timeline";
import { AssetMap } from "../components/map/AssetMap";
import { formatLuas, formatRupiahFull, formatTanggal } from "../lib/format";

export default function DetailAset() {
  const { kode } = useParams<{ kode: string }>();
  const { getAsset } = useAssets();
  const asset = getAsset(kode ?? "");

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-sm font-medium text-gray-600">Aset dengan kode "{kode}" tidak ditemukan.</p>
        <Link to="/data-aset" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Kembali ke Data Aset
        </Link>
      </div>
    );
  }

  const info = [
    { label: "Kode Aset", value: asset.kode },
    { label: "Nama Aset", value: asset.nama },
    { label: "Jenis Aset", value: asset.jenis },
    {
      label: "Lokasi",
      value: asset.kelurahan
        ? `${asset.lokasi}, Kelurahan ${asset.kelurahan}, ${asset.kecamatan}`
        : `${asset.lokasi}, ${asset.kecamatan}`,
    },
    { label: "Luas", value: formatLuas(asset.luas) },
    { label: "Status Kepemilikan", value: asset.statusKepemilikan },
    { label: "Tahun Perolehan", value: String(asset.tahunPerolehan) },
    { label: "Sumber Dana", value: asset.sumberDana },
    { label: "Nilai Perolehan", value: formatRupiahFull(asset.nilaiPerolehan) },
    { label: "Penggunaan Saat Ini", value: asset.penggunaan },
  ];

  return (
    <div className="pb-10">
      <div className="border-b border-gray-200 bg-white px-4 py-4 lg:px-6">
        <Link to="/data-aset" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-700">
          <ArrowLeft size={15} />
          Kembali ke Data Aset
        </Link>
      </div>

      <div className="p-4 lg:p-6">
        {/* Hero */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {asset.fotoUrl ? (
            <img src={asset.fotoUrl} className="h-48 w-full object-cover sm:h-64" />
          ) : (
            <AssetPhoto jenis={asset.jenis} className="h-48 w-full sm:h-64" iconSize={40} label="Foto Lokasi Aset" />
          )}
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium tracking-wide text-primary-600">{asset.kode}</div>
              <h1 className="mt-0.5 text-xl font-bold text-gray-900">{asset.nama}</h1>
              <div className="mt-2 flex items-center gap-2">
                <StatusAsetBadge status={asset.status} />
                <span className="text-xs text-gray-400">{asset.jenis} &middot; {asset.kecamatan}</span>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 self-start rounded-md border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-surface-alt sm:self-auto">
              <Download size={14} />
              Unduh Ringkasan
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Left column */}
          <div className="space-y-5 xl:col-span-2">
            <SectionCard title="Informasi Aset" icon={ScrollText}>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {info.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-gray-400">{item.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-gray-800">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </SectionCard>

            <SectionCard title="Lokasi Aset" icon={MapPin}>
              <AssetMap assets={[asset]} center={[asset.lat, asset.lng]} zoom={15} height="280px" />
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <div>
                  <div className="text-xs text-gray-400">Latitude</div>
                  <div className="font-medium text-gray-800">{asset.lat}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Longitude</div>
                  <div className="font-medium text-gray-800">{asset.lng}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Luas</div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800">
                    <Ruler size={13} className="text-gray-400" />
                    {formatLuas(asset.luas)}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Riwayat Aset" icon={CalendarDays}>
              <Timeline entries={asset.riwayat} />
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <SectionCard title="Data Bapenda" icon={Landmark}>
              <div className="space-y-3.5">
                <Row label="NOP" value={asset.bapenda.nop} mono />
                <Row label="NJOP / m²" value={formatRupiahFull(asset.bapenda.njopPerM2)} />
                <Row label="Total NJOP" value={formatRupiahFull(asset.bapenda.totalNjop)} />
                <Row label="Status Pajak" value={asset.bapenda.statusPajak} />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Status Verifikasi</span>
                  <StatusBapendaBadge status={asset.bapenda.statusVerifikasi} size="sm" />
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-400">Catatan Bapenda</div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{asset.bapenda.catatan}</p>
                </div>
                {asset.bapenda.terakhirCrossCheck !== "-" && (
                  <div className="text-xs text-gray-400">
                    Cross check terakhir: {formatTanggal(asset.bapenda.terakhirCrossCheck)}
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Foto & Dokumen" icon={UsageIcon}>
              {asset.dokumen.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {asset.dokumen.map((d) => (
                    <DocThumb key={d.nama} nama={d.nama} tipe={d.tipe} />
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-xs text-gray-400">Belum ada foto atau dokumen pendukung.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-right text-sm font-medium text-gray-800 ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </span>
    </div>
  );
}
