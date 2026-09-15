export interface ReportColumn {
  key: string;
  label: string;
}

export type ReportRow = Record<string, string | number>;

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value: string | number): string {
  const str = String(value);
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToExcel(filename: string, columns: ReportColumn[], rows: ReportRow[]) {
  const header = columns.map((c) => csvEscape(c.label)).join(";");
  const body = rows.map((row) => columns.map((c) => csvEscape(row[c.key] ?? "")).join(";")).join("\n");
  const csv = `${header}\n${body}`;
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export async function exportToPDF(
  filename: string,
  title: string,
  columns: ReportColumn[],
  rows: ReportRow[]
) {
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(13);
  doc.setTextColor(21, 65, 126);
  doc.text("Sistem Aset Daerah Terintegrasi", 14, 14);

  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(title, 14, 21);

  doc.setFontSize(8.5);
  doc.setTextColor(120, 128, 140);
  const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Diekspor pada ${tanggal} — ${rows.length} baris data`, 14, 26.5);

  autoTable(doc, {
    startY: 31,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => String(row[c.key] ?? ""))),
    styles: { fontSize: 8, cellPadding: 2.4, textColor: [55, 65, 81] },
    headStyles: { fillColor: [21, 65, 126], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 248, 251] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}
