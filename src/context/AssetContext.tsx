import { createContext, useContext, useState, type ReactNode } from "react";
import type { Aset, RiwayatEntry } from "../types";
import { assets as seedAssets } from "../data/assets";

export interface AsetFormValues {
  kode: string;
  nama: string;
  jenis: Aset["jenis"];
  lokasi: string;
  kecamatan: string;
  kelurahan: string;
  luas: number;
  statusKepemilikan: string;
  tahunPerolehan: number;
  sumberDana: string;
  nilaiPerolehan: number;
  status: Aset["status"];
  lat: number;
  lng: number;
  fotoUrl?: string;
  catatan?: string;
}

const penggunaanDefault: Record<Aset["status"], string> = {
  "Aktif Digunakan": "Digunakan aktif oleh instansi terkait",
  Idle: "Belum dimanfaatkan",
  Disewakan: "Disewakan kepada pihak ketiga",
  Bermasalah: "Dalam proses penanganan permasalahan aset",
  "Belum Diverifikasi": "Belum ditetapkan",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

interface AssetContextValue {
  assets: Aset[];
  getAsset: (kode: string) => Aset | undefined;
  addAsset: (values: AsetFormValues, pengguna: string) => void;
  updateAsset: (kode: string, values: AsetFormValues, pengguna: string) => void;
  removeAsset: (kode: string) => void;
  verifyBapenda: (kode: string) => void;
}

const AssetContext = createContext<AssetContextValue | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Aset[]>(seedAssets);

  const getAsset = (kode: string) => assets.find((a) => a.kode === kode);

  const addAsset = (values: AsetFormValues, pengguna: string) => {
    const riwayatAwal: RiwayatEntry = {
      tahun: Number(todayIso().slice(0, 4)),
      tanggal: todayIso(),
      judul: "Input Data Aset",
      keterangan: values.catatan?.trim()
        ? values.catatan.trim()
        : "Aset didata dan dimasukkan ke dalam sistem.",
      statusSesudah: values.status,
      pengguna,
    };

    const newAsset: Aset = {
      kode: values.kode.trim(),
      nama: values.nama.trim(),
      jenis: values.jenis,
      lokasi: values.lokasi.trim(),
      kecamatan: values.kecamatan,
      kelurahan: values.kelurahan.trim(),
      luas: values.luas,
      statusKepemilikan: values.statusKepemilikan,
      tahunPerolehan: values.tahunPerolehan,
      sumberDana: values.sumberDana,
      nilaiPerolehan: values.nilaiPerolehan,
      penggunaan: penggunaanDefault[values.status],
      status: values.status,
      lat: values.lat,
      lng: values.lng,
      fotoUrl: values.fotoUrl,
      bapenda: {
        nop: "Belum Terdaftar",
        njopPerM2: 0,
        totalNjop: 0,
        statusPajak: "Belum Ditetapkan",
        statusVerifikasi: "Perlu Cross Check",
        catatan: "Aset baru ditambahkan melalui sistem, menunggu verifikasi Bapenda.",
        terakhirCrossCheck: "-",
      },
      riwayat: [riwayatAwal],
      dokumen: values.fotoUrl ? [{ nama: "Foto Aset", tipe: "foto", kategori: "Kondisi Aset" }] : [],
    };

    setAssets((prev) => [newAsset, ...prev]);
  };

  const updateAsset = (kode: string, values: AsetFormValues, pengguna: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.kode !== kode) return a;

        const statusChanged = a.status !== values.status;
        const riwayatBaru: RiwayatEntry = {
          tahun: Number(todayIso().slice(0, 4)),
          tanggal: todayIso(),
          judul: "Pembaruan Data Aset",
          keterangan: values.catatan?.trim() ? values.catatan.trim() : "Data aset diperbarui oleh " + pengguna + ".",
          ...(statusChanged ? { statusSebelum: a.status, statusSesudah: values.status } : {}),
          pengguna,
        };

        return {
          ...a,
          nama: values.nama.trim(),
          jenis: values.jenis,
          lokasi: values.lokasi.trim(),
          kecamatan: values.kecamatan,
          kelurahan: values.kelurahan.trim(),
          luas: values.luas,
          statusKepemilikan: values.statusKepemilikan,
          tahunPerolehan: values.tahunPerolehan,
          sumberDana: values.sumberDana,
          nilaiPerolehan: values.nilaiPerolehan,
          penggunaan: statusChanged ? penggunaanDefault[values.status] : a.penggunaan,
          status: values.status,
          lat: values.lat,
          lng: values.lng,
          fotoUrl: values.fotoUrl ?? a.fotoUrl,
          dokumen:
            values.fotoUrl && !a.dokumen.some((d) => d.nama === "Foto Aset")
              ? [...a.dokumen, { nama: "Foto Aset" as const, tipe: "foto" as const, kategori: "Kondisi Aset" }]
              : a.dokumen,
          riwayat: [riwayatBaru, ...a.riwayat],
        };
      })
    );
  };

  const removeAsset = (kode: string) => {
    setAssets((prev) => prev.filter((a) => a.kode !== kode));
  };

  const verifyBapenda = (kode: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.kode === kode
          ? { ...a, bapenda: { ...a.bapenda, statusVerifikasi: "Terverifikasi", terakhirCrossCheck: todayIso() } }
          : a
      )
    );
  };

  return (
    <AssetContext.Provider value={{ assets, getAsset, addAsset, updateAsset, removeAsset, verifyBapenda }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error("useAssets must be used within AssetProvider");
  return ctx;
}
