import { useState } from "react";
import { MapPin, Camera, X, WifiOff, RefreshCw, Locate, CircleCheck } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusAsetBadge } from "../../components/ui/StatusBadge";
import { useAssets } from "../../context/AssetContext";
import { useAuth } from "../../context/AuthContext";
import type { StatusAset } from "../../types";

const kondisiOptions = ["Baik", "Rusak Ringan", "Rusak Berat"];
const statusOptions: StatusAset[] = ["Aktif Digunakan", "Idle", "Disewakan", "Bermasalah", "Belum Diverifikasi"];

interface QueueItem {
  id: number;
  kode: string;
  waktu: string;
  synced: boolean;
}

export default function SurveyLapangan() {
  const { assets, recordSurvey } = useAssets();
  const { nama } = useAuth();
  const [kodeAset, setKodeAset] = useState(assets[0].kode);
  const [kondisi, setKondisi] = useState(kondisiOptions[0]);
  const [statusAset, setStatusAset] = useState<StatusAset>(assets[0].status);
  const [catatan, setCatatan] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 1, kode: "TNH-A-00650", waktu: "Kemarin, 14:10", synced: false },
    { id: 2, kode: "BGN-A-00399", waktu: "Kemarin, 11:42", synced: false },
    { id: 3, kode: "TNH-A-01203", waktu: "2 hari lalu", synced: false },
  ]);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const asset = assets.find((a) => a.kode === kodeAset)!;
  const pendingCount = queue.filter((q) => !q.synced).length;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls].slice(0, 4));
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordSurvey(kodeAset, { kondisi, status: statusAset, catatan }, nama);
    setQueue((prev) => [
      { id: Date.now(), kode: kodeAset, waktu: "Baru saja", synced: false },
      ...prev,
    ]);
    setSaved(true);
    setPhotos([]);
    setCatatan("");
    window.setTimeout(() => setSaved(false), 2600);
  };

  const handleSync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setQueue((prev) => prev.map((q) => ({ ...q, synced: true })));
      setSyncing(false);
    }, 1400);
  };

  return (
    <div className="pb-28">
      <PageHeader title="Survey Aset" subtitle="Formulir pendataan lapangan oleh Petugas Lapangan." />

      <div className="flex items-center gap-2 border-b border-yellow-100 bg-status-yellow-bg px-4 py-2.5 text-xs font-medium text-status-yellow lg:px-6">
        <WifiOff size={14} />
        Mode Offline — {pendingCount} data menunggu sinkronisasi
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5 p-4 lg:p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Pilih Aset</label>
          <select
            value={kodeAset}
            onChange={(e) => {
              const next = e.target.value;
              setKodeAset(next);
              const nextAsset = assets.find((a) => a.kode === next);
              if (nextAsset) setStatusAset(nextAsset.status);
            }}
            className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400"
          >
            {assets.map((a) => (
              <option key={a.kode} value={a.kode}>
                {a.kode} — {a.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs font-medium text-primary-600">{asset.kode}</div>
          <div className="mt-0.5 text-sm font-semibold text-gray-900">{asset.nama}</div>
          <div className="mt-2">
            <StatusAsetBadge status={asset.status} size="sm" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <MapPin size={14} />
              Lokasi GPS
            </span>
            <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary-600">
              <Locate size={13} />
              Deteksi Ulang
            </button>
          </div>
          <div className="mt-2 flex gap-6">
            <div>
              <div className="text-[11px] text-gray-400">Latitude</div>
              <div className="text-sm font-semibold text-gray-800">{asset.lat}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">Longitude</div>
              <div className="text-sm font-semibold text-gray-800">{asset.lng}</div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Foto Aset</label>
          <div className="grid grid-cols-4 gap-2.5">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-gray-200">
                <img src={url} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/60 text-white"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-500">
                <Camera size={18} />
                <span className="text-[10px] font-medium">Tambah</span>
                <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handlePhoto} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Kondisi Aset</label>
            <select
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400"
            >
              {kondisiOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">Status Aset</label>
            <select
              value={statusAset}
              onChange={(e) => setStatusAset(e.target.value as StatusAset)}
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Catatan</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            placeholder="Tuliskan kondisi atau temuan di lapangan..."
            className="w-full resize-none rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary-800 py-3 text-sm font-semibold text-white hover:bg-primary-900"
        >
          Simpan Survey
        </button>

        {saved && (
          <div className="flex items-center gap-2 rounded-md bg-status-green-bg px-3.5 py-2.5 text-sm text-status-green">
            <CircleCheck size={16} />
            Survey tersimpan secara lokal, menunggu sinkronisasi.
          </div>
        )}
      </form>

      <div className="mx-auto max-w-xl px-4 lg:px-6">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-800">Antrean Sinkronisasi</h3>
            <button
              onClick={handleSync}
              disabled={pendingCount === 0 || syncing}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 disabled:text-gray-300"
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {queue.map((q) => (
              <li key={q.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{q.kode}</div>
                  <div className="text-xs text-gray-400">{q.waktu}</div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    q.synced ? "bg-status-green-bg text-status-green" : "bg-status-yellow-bg text-status-yellow"
                  }`}
                >
                  {q.synced ? "Tersinkron" : "Menunggu"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
