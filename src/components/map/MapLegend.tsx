import type { StatusAset } from "../../types";
import { statusAsetConfig } from "../../lib/status";

const order: StatusAset[] = ["Aktif Digunakan", "Idle", "Disewakan", "Bermasalah", "Belum Diverifikasi"];

export function MapLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {order.map((status) => (
        <div key={status} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusAsetConfig[status].dot }} />
          {statusAsetConfig[status].label}
        </div>
      ))}
    </div>
  );
}
