import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "green" | "yellow" | "red" | "gray";
  caption?: string;
}

const toneMap = {
  default: { bg: "bg-primary-50", icon: "text-primary-600" },
  green: { bg: "bg-status-green-bg", icon: "text-status-green" },
  yellow: { bg: "bg-status-yellow-bg", icon: "text-status-yellow" },
  red: { bg: "bg-status-red-bg", icon: "text-status-red" },
  gray: { bg: "bg-status-gray-bg", icon: "text-status-gray" },
};

export function KPICard({ label, value, icon: Icon, tone = "default", caption }: KPICardProps) {
  const t = toneMap[tone];
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${t.bg}`}>
          <Icon size={16} strokeWidth={2} className={t.icon} />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</div>
      {caption && <div className="mt-1 text-xs text-gray-400">{caption}</div>}
    </div>
  );
}
