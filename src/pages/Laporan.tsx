import { useMemo, useState } from "react";
import { FileText, FileSpreadsheet, FileDown, CircleCheck, Loader2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Toast } from "../components/ui/Toast";
import { useToast } from "../components/ui/useToast";
import { useAssets } from "../context/AssetContext";
import { buildReportConfigs } from "../data/reports";
import { exportToExcel, exportToPDF } from "../lib/export";

export default function Laporan() {
  const { assets } = useAssets();
  const reportConfigs = useMemo(() => buildReportConfigs(assets), [assets]);
  const [selected, setSelected] = useState(reportConfigs[0].id);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);
  const { toastMessage, showToast } = useToast();
  const active = reportConfigs.find((r) => r.id === selected) ?? reportConfigs[0];

  const handleExportExcel = () => {
    setExporting("excel");
    exportToExcel(active.filename, active.columns, active.rows);
    showToast(`${active.label} berhasil diunduh sebagai file Excel (.csv).`);
    setExporting(null);
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      await exportToPDF(active.filename, active.label, active.columns, active.rows);
      showToast(`${active.label} berhasil diunduh sebagai file PDF.`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <PageHeader title="Laporan Aset" subtitle="Pilih jenis laporan untuk diunduh dalam format Excel atau PDF." />

      <div className="grid grid-cols-1 gap-5 p-4 lg:grid-cols-5 lg:p-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="text-sm font-semibold text-gray-800">Jenis Laporan</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {reportConfigs.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r.id)}
                    className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors ${
                      selected === r.id ? "bg-primary-50" : "hover:bg-surface"
                    }`}
                  >
                    <FileText
                      size={17}
                      className={`mt-0.5 shrink-0 ${selected === r.id ? "text-primary-700" : "text-gray-400"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium ${selected === r.id ? "text-primary-800" : "text-gray-800"}`}>
                        {r.label}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">{r.description}</div>
                    </div>
                    {selected === r.id && <CircleCheck size={16} className="mt-0.5 shrink-0 text-primary-600" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Pratinjau Laporan</div>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{active.label}</h2>
            <p className="mt-1 text-sm text-gray-500">{active.description}</p>

            <div className="mt-5 flex items-center gap-6 rounded-md border border-gray-100 bg-surface px-5 py-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{active.rows.length}</div>
                <div className="text-xs text-gray-400">Total baris data</div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <div className="text-sm font-medium text-gray-700">15 September 2026</div>
                <div className="text-xs text-gray-400">Periode data per hari ini</div>
              </div>
            </div>

            {active.rows.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-md border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-xs">
                    <thead>
                      <tr className="bg-surface text-left font-medium uppercase tracking-wide text-gray-400">
                        {active.columns.map((c) => (
                          <th key={c.key} className="whitespace-nowrap px-3 py-2">
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {active.rows.slice(0, 4).map((row, i) => (
                        <tr key={i}>
                          {active.columns.map((c) => (
                            <td key={c.key} className="whitespace-nowrap px-3 py-2 text-gray-600">
                              {row[c.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {active.rows.length > 4 && (
                  <div className="border-t border-gray-100 bg-surface px-3 py-1.5 text-[11px] text-gray-400">
                    +{active.rows.length - 4} baris lainnya pada file yang diunduh
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleExportExcel}
                disabled={exporting !== null || active.rows.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exporting === "excel" ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                Export Excel
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting !== null || active.rows.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-800 py-2.5 text-sm font-semibold text-white hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting === "pdf" ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
