import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Pencil, Trash2, Plus, SlidersHorizontal, X } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { FilterSelect } from "../components/ui/FilterSelect";
import { StatusAsetBadge, StatusBapendaBadge } from "../components/ui/StatusBadge";
import { Toast } from "../components/ui/Toast";
import { useToast } from "../components/ui/useToast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { AsetFormModal } from "../components/aset/AsetFormModal";
import { useAuth } from "../context/AuthContext";
import { useAssets } from "../context/AssetContext";
import { rolePermissions } from "../lib/permissions";
import { formatLuas, formatRupiah } from "../lib/format";
import type { Aset, JenisAset, StatusAset, StatusVerifikasiBapenda } from "../types";

const jenisOptions: JenisAset[] = ["Tanah", "Bangunan"];
const statusOptions: StatusAset[] = ["Aktif Digunakan", "Idle", "Disewakan", "Bermasalah", "Belum Diverifikasi"];
const bapendaOptions: StatusVerifikasiBapenda[] = ["Terverifikasi", "Perlu Cross Check", "Tidak Sesuai"];

export default function DataAset() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { assets, removeAsset } = useAssets();
  const canManage = role ? rolePermissions[role].canManageAset : false;
  const { toastMessage, showToast } = useToast();

  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("");
  const [status, setStatus] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [statusBapenda, setStatusBapenda] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingAsset, setEditingAsset] = useState<Aset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Aset | null>(null);

  const kecamatanOptions = useMemo(() => Array.from(new Set(assets.map((a) => a.kecamatan))).sort(), [assets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (q) {
        const hay = `${a.kode} ${a.nama} ${a.bapenda.nop} ${a.lokasi}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (jenis && a.jenis !== jenis) return false;
      if (status && a.status !== status) return false;
      if (kecamatan && a.kecamatan !== kecamatan) return false;
      if (statusBapenda && a.bapenda.statusVerifikasi !== statusBapenda) return false;
      return true;
    });
  }, [assets, search, jenis, status, kecamatan, statusBapenda]);

  const hasFilter = jenis || status || kecamatan || statusBapenda || search;
  const resetFilter = () => {
    setSearch("");
    setJenis("");
    setStatus("");
    setKecamatan("");
    setStatusBapenda("");
  };

  const openAdd = () => {
    setFormMode("add");
    setEditingAsset(null);
    setFormOpen(true);
  };

  const openEdit = (a: Aset) => {
    setFormMode("edit");
    setEditingAsset(a);
    setFormOpen(true);
  };

  const handleSaved = (kode: string, isNew: boolean) => {
    setFormOpen(false);
    showToast(isNew ? "Data aset berhasil ditambahkan." : `Data aset ${kode} berhasil diperbarui.`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    removeAsset(deleteTarget.kode);
    showToast(`Aset ${deleteTarget.kode} berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Data Aset"
        subtitle="Daftar seluruh aset tanah dan bangunan yang terdata dalam sistem."
        action={
          canManage ? (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-md bg-primary-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-900"
            >
              <Plus size={15} />
              Tambah Aset
            </button>
          ) : undefined
        }
      />

      <div className="p-4 lg:p-6">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode aset, nama aset, NOP, atau lokasi..."
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal size={15} className="hidden text-gray-400 lg:block" />
              <FilterSelect label="Jenis Aset" value={jenis} options={jenisOptions} onChange={setJenis} />
              <FilterSelect label="Status Aset" value={status} options={statusOptions} onChange={setStatus} />
              <FilterSelect label="Kecamatan" value={kecamatan} options={kecamatanOptions} onChange={setKecamatan} />
              <FilterSelect label="Status Bapenda" value={statusBapenda} options={bapendaOptions} onChange={setStatusBapenda} />
              {hasFilter && (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-surface text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3">Kode Aset</th>
                  <th className="px-4 py-3">Nama Aset</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3 text-right">Luas</th>
                  <th className="px-4 py-3 text-right">Nilai</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Status Bapenda</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <tr
                    key={a.kode}
                    onClick={() => navigate(`/data-aset/${a.kode}`)}
                    className="cursor-pointer hover:bg-surface"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-primary-700">{a.kode}</td>
                    <td className="px-4 py-3 text-gray-800">
                      <div className="max-w-[220px] truncate">{a.nama}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{a.jenis}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <div className="max-w-[200px] truncate">{a.lokasi}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-500">{formatLuas(a.luas)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-500">{formatRupiah(a.nilaiPerolehan)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusAsetBadge status={a.status} size="sm" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBapendaBadge status={a.bapenda.statusVerifikasi} size="sm" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/data-aset/${a.kode}`);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-primary-50 hover:text-primary-700"
                          aria-label="Lihat detail"
                        >
                          <Eye size={15} />
                        </button>
                        {canManage && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(a);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-primary-50 hover:text-primary-700"
                              aria-label="Edit aset"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(a);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-status-red-bg hover:text-status-red"
                              aria-label="Hapus aset"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Search size={22} className="text-gray-300" />
                <p className="text-sm font-medium text-gray-500">Tidak ada aset yang cocok dengan pencarian</p>
                <p className="text-xs text-gray-400">Coba ubah kata kunci atau reset filter</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
            <span>Menampilkan {filtered.length} dari {assets.length} aset</span>
          </div>
        </div>
      </div>

      <AsetFormModal
        open={formOpen}
        mode={formMode}
        initial={editingAsset}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Aset"
        message={`Yakin ingin menghapus aset ${deleteTarget?.kode} — ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
