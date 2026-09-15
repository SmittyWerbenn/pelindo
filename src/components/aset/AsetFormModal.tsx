import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Camera, X, MapPin } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useAssets, type AsetFormValues } from "../../context/AssetContext";
import { useAuth } from "../../context/AuthContext";
import { getMarkerIcon } from "../map/markerIcon";
import type { Aset, JenisAset, StatusAset } from "../../types";

const jenisOptions: JenisAset[] = ["Tanah", "Bangunan"];
const statusOptions: StatusAset[] = ["Aktif Digunakan", "Idle", "Disewakan", "Bermasalah", "Belum Diverifikasi"];
const statusKepemilikanOptions = ["Sertifikat Hak Pakai Pemda", "Sertifikat Hak Milik Pemda", "Girik (Proses Sertifikasi)"];
const sumberDanaOptions = ["APBD", "APBN", "Hibah", "Bantuan Provinsi"];
const currentYear = new Date().getFullYear();

interface FormState {
  kode: string;
  nama: string;
  jenis: JenisAset | "";
  lokasi: string;
  kecamatan: string;
  kelurahan: string;
  luas: string;
  statusKepemilikan: string;
  tahunPerolehan: string;
  sumberDana: string;
  nilaiPerolehan: string;
  status: StatusAset | "";
  latitude: string;
  longitude: string;
  catatan: string;
}

const emptyForm: FormState = {
  kode: "",
  nama: "",
  jenis: "",
  lokasi: "",
  kecamatan: "",
  kelurahan: "",
  luas: "",
  statusKepemilikan: "",
  tahunPerolehan: "",
  sumberDana: "",
  nilaiPerolehan: "",
  status: "",
  latitude: "",
  longitude: "",
  catatan: "",
};

function fromAsset(a: Aset): FormState {
  return {
    kode: a.kode,
    nama: a.nama,
    jenis: a.jenis,
    lokasi: a.lokasi,
    kecamatan: a.kecamatan,
    kelurahan: a.kelurahan ?? "",
    luas: String(a.luas),
    statusKepemilikan: a.statusKepemilikan,
    tahunPerolehan: String(a.tahunPerolehan),
    sumberDana: a.sumberDana,
    nilaiPerolehan: String(a.nilaiPerolehan),
    status: a.status,
    latitude: String(a.lat),
    longitude: String(a.lng),
    catatan: "",
  };
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface AsetFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  initial?: Aset | null;
  onClose: () => void;
  onSaved: (kode: string, isNew: boolean) => void;
}

export function AsetFormModal({ open, mode, initial, onClose, onSaved }: AsetFormModalProps) {
  const { assets, addAsset, updateAsset } = useAssets();
  const { nama: penggunaNama } = useAuth();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<FormErrors>({});

  const kecamatanOptions = useMemo(() => Array.from(new Set(assets.map((a) => a.kecamatan))).sort(), [assets]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setForm(fromAsset(initial));
      setFotoUrl(initial.fotoUrl);
    } else {
      setForm(emptyForm);
      setFotoUrl(undefined);
    }
    setErrors({});
  }, [open, mode, initial]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const validate = (): FormErrors => {
    const err: FormErrors = {};
    if (!form.kode.trim()) err.kode = "Kode aset wajib diisi";
    else if (mode === "add" && assets.some((a) => a.kode.toLowerCase() === form.kode.trim().toLowerCase())) {
      err.kode = "Kode aset sudah digunakan";
    }
    if (!form.nama.trim()) err.nama = "Nama aset wajib diisi";
    if (!form.jenis) err.jenis = "Pilih jenis aset";
    if (!form.lokasi.trim()) err.lokasi = "Lokasi wajib diisi";
    if (!form.kecamatan.trim()) err.kecamatan = "Kecamatan wajib diisi";
    if (!form.kelurahan.trim()) err.kelurahan = "Kelurahan wajib diisi";
    if (!form.luas || Number(form.luas) <= 0) err.luas = "Luas harus lebih dari 0";
    if (!form.statusKepemilikan) err.statusKepemilikan = "Pilih status kepemilikan";
    const tahun = Number(form.tahunPerolehan);
    if (!form.tahunPerolehan || tahun < 1945 || tahun > currentYear) {
      err.tahunPerolehan = `Tahun antara 1945–${currentYear}`;
    }
    if (!form.sumberDana) err.sumberDana = "Pilih sumber dana";
    if (!form.nilaiPerolehan || Number(form.nilaiPerolehan) <= 0) err.nilaiPerolehan = "Nilai harus lebih dari 0";
    if (!form.status) err.status = "Pilih status aset";
    const lat = Number(form.latitude);
    if (form.latitude === "" || Number.isNaN(lat) || lat < -11 || lat > 6) {
      err.latitude = "Latitude tidak valid untuk wilayah Indonesia";
    }
    const lng = Number(form.longitude);
    if (form.longitude === "" || Number.isNaN(lng) || lng < 95 || lng > 141) {
      err.longitude = "Longitude tidak valid untuk wilayah Indonesia";
    }
    return err;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const values: AsetFormValues = {
      kode: form.kode.trim(),
      nama: form.nama.trim(),
      jenis: form.jenis as JenisAset,
      lokasi: form.lokasi.trim(),
      kecamatan: form.kecamatan.trim(),
      kelurahan: form.kelurahan.trim(),
      luas: Number(form.luas),
      statusKepemilikan: form.statusKepemilikan,
      tahunPerolehan: Number(form.tahunPerolehan),
      sumberDana: form.sumberDana,
      nilaiPerolehan: Number(form.nilaiPerolehan),
      status: form.status as StatusAset,
      lat: Number(form.latitude),
      lng: Number(form.longitude),
      fotoUrl,
      catatan: form.catatan,
    };

    if (mode === "add") {
      addAsset(values, penggunaNama);
      onSaved(values.kode, true);
    } else if (initial) {
      updateAsset(initial.kode, values, penggunaNama);
      onSaved(initial.kode, false);
    }
  };

  const latNum = Number(form.latitude);
  const lngNum = Number(form.longitude);
  const showPreview = form.latitude !== "" && form.longitude !== "" && Number.isFinite(latNum) && Number.isFinite(lngNum);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Tambah Data Aset" : `Edit Data Aset — ${initial?.kode}`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-surface-alt"
          >
            Batal
          </button>
          <button
            type="submit"
            form="aset-form"
            className="rounded-md bg-primary-800 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-900"
          >
            Simpan Aset
          </button>
        </>
      }
    >
      <form id="aset-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Kode Aset" error={errors.kode}>
            <input
              value={form.kode}
              onChange={(e) => set("kode", e.target.value.toUpperCase())}
              disabled={mode === "edit"}
              placeholder="Contoh: TNH-A-00999"
              className={inputCls(!!errors.kode, mode === "edit")}
            />
          </Field>
          <Field label="Nama Aset" error={errors.nama}>
            <input
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              placeholder="Contoh: Tanah Kantor Kelurahan..."
              className={inputCls(!!errors.nama)}
            />
          </Field>

          <Field label="Jenis Aset" error={errors.jenis}>
            <select value={form.jenis} onChange={(e) => set("jenis", e.target.value as JenisAset)} className={inputCls(!!errors.jenis)}>
              <option value="">Pilih jenis aset</option>
              {jenisOptions.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </Field>
          <Field label="Status Aset" error={errors.status}>
            <select value={form.status} onChange={(e) => set("status", e.target.value as StatusAset)} className={inputCls(!!errors.status)}>
              <option value="">Pilih status aset</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Lokasi (Alamat)" error={errors.lokasi} full>
            <input
              value={form.lokasi}
              onChange={(e) => set("lokasi", e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 45"
              className={inputCls(!!errors.lokasi)}
            />
          </Field>

          <Field label="Kecamatan" error={errors.kecamatan}>
            <input
              value={form.kecamatan}
              onChange={(e) => set("kecamatan", e.target.value)}
              list="kecamatan-list"
              placeholder="Pilih atau ketik kecamatan"
              className={inputCls(!!errors.kecamatan)}
            />
            <datalist id="kecamatan-list">
              {kecamatanOptions.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </Field>
          <Field label="Kelurahan" error={errors.kelurahan}>
            <input
              value={form.kelurahan}
              onChange={(e) => set("kelurahan", e.target.value)}
              placeholder="Contoh: Sukamaju"
              className={inputCls(!!errors.kelurahan)}
            />
          </Field>

          <Field label="Luas (m²)" error={errors.luas}>
            <input
              type="number"
              min="0"
              value={form.luas}
              onChange={(e) => set("luas", e.target.value)}
              placeholder="Contoh: 2500"
              className={inputCls(!!errors.luas)}
            />
          </Field>
          <Field label="Status Kepemilikan" error={errors.statusKepemilikan}>
            <select
              value={form.statusKepemilikan}
              onChange={(e) => set("statusKepemilikan", e.target.value)}
              className={inputCls(!!errors.statusKepemilikan)}
            >
              <option value="">Pilih status kepemilikan</option>
              {statusKepemilikanOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Tahun Perolehan" error={errors.tahunPerolehan}>
            <input
              type="number"
              min="1945"
              max={currentYear}
              value={form.tahunPerolehan}
              onChange={(e) => set("tahunPerolehan", e.target.value)}
              placeholder={`Contoh: ${currentYear}`}
              className={inputCls(!!errors.tahunPerolehan)}
            />
          </Field>
          <Field label="Sumber Dana" error={errors.sumberDana}>
            <select value={form.sumberDana} onChange={(e) => set("sumberDana", e.target.value)} className={inputCls(!!errors.sumberDana)}>
              <option value="">Pilih sumber dana</option>
              {sumberDanaOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Nilai Perolehan (Rp)" error={errors.nilaiPerolehan} full>
            <input
              type="number"
              min="0"
              value={form.nilaiPerolehan}
              onChange={(e) => set("nilaiPerolehan", e.target.value)}
              placeholder="Contoh: 3750000000"
              className={inputCls(!!errors.nilaiPerolehan)}
            />
          </Field>

          <Field label="Latitude" error={errors.latitude}>
            <input
              value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)}
              placeholder="Contoh: -6.234567"
              className={inputCls(!!errors.latitude)}
            />
          </Field>
          <Field label="Longitude" error={errors.longitude}>
            <input
              value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)}
              placeholder="Contoh: 106.789012"
              className={inputCls(!!errors.longitude)}
            />
          </Field>
        </div>

        {showPreview && (
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <MapPin size={13} />
              Preview Lokasi
            </label>
            <div className="overflow-hidden rounded-md border border-gray-200" style={{ height: 180 }}>
              <MapContainer center={[latNum, lngNum]} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latNum, lngNum]} icon={getMarkerIcon((form.status || "Belum Diverifikasi") as StatusAset)} />
                <RecenterMap lat={latNum} lng={lngNum} />
              </MapContainer>
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Foto Aset</label>
          {fotoUrl ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-md border border-gray-200">
              <img src={fotoUrl} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setFotoUrl(undefined)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/60 text-white"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-500">
              <Camera size={20} />
              <span className="text-[10px] font-medium">Unggah Foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          )}
        </div>

        <Field label="Catatan (opsional)">
          <textarea
            value={form.catatan}
            onChange={(e) => set("catatan", e.target.value)}
            rows={3}
            placeholder="Catatan tambahan mengenai aset ini..."
            className="w-full resize-none rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-400"
          />
        </Field>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-status-red">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean, disabled = false) {
  return `w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-400 ${
    hasError ? "border-status-red" : "border-gray-200"
  } ${disabled ? "cursor-not-allowed bg-surface-alt text-gray-400" : ""}`;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}
