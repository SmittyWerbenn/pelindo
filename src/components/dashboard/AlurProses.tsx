import {
  ClipboardList,
  FileEdit,
  ClipboardCheck,
  Landmark,
  MapPin,
  Eye,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
  caption: string;
}

const steps: Step[] = [
  { icon: ClipboardList, label: "Survey", caption: "Petugas Lapangan" },
  { icon: FileEdit, label: "Input Data", caption: "Admin Aset" },
  { icon: ClipboardCheck, label: "Verifikasi", caption: "Admin Aset" },
  { icon: Landmark, label: "Cross Check Bapenda", caption: "Sinkron eksternal" },
  { icon: MapPin, label: "Tampil di Peta", caption: "Otomatis" },
  { icon: Eye, label: "Monitoring Pimpinan", caption: "Real-time" },
];

export function AlurProses() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-start gap-1.5 sm:min-w-0 sm:justify-between">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start">
            <div className="flex w-24 flex-col items-center text-center sm:w-auto">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50">
                <step.icon size={17} strokeWidth={2} className="text-primary-600" />
              </span>
              <span className="mt-2 text-xs font-semibold leading-tight text-gray-800">{step.label}</span>
              <span className="mt-0.5 text-[11px] leading-tight text-gray-400">{step.caption}</span>
            </div>
            {i !== steps.length - 1 && (
              <ChevronRight size={16} className="mx-1 mt-4 shrink-0 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
