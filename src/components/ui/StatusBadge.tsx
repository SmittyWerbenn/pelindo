import type { StatusAset, StatusVerifikasiBapenda } from "../../types";
import { statusAsetConfig, statusBapendaConfig } from "../../lib/status";

export function StatusAsetBadge({ status, size = "md" }: { status: StatusAset; size?: "sm" | "md" }) {
  const cfg = statusAsetConfig[status];
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.color} ${cfg.bg} ${sizeCls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export function StatusBapendaBadge({ status, size = "md" }: { status: StatusVerifikasiBapenda; size?: "sm" | "md" }) {
  const cfg = statusBapendaConfig[status];
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${cfg.color} ${cfg.bg} ${sizeCls}`}>
      {cfg.label}
    </span>
  );
}
