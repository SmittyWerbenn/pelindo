export function formatRupiah(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Triliun`;
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Miliar`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function formatRupiahFull(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function formatLuas(value: number): string {
  return `${value.toLocaleString("id-ID")} m²`;
}

export function formatTanggal(iso: string): string {
  if (iso === "-") return "-";
  const date = new Date(iso);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
