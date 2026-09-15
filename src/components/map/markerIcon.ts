import L from "leaflet";
import type { StatusAset } from "../../types";
import { statusAsetConfig } from "../../lib/status";

const cache = new Map<string, L.DivIcon>();

export function getMarkerIcon(status: StatusAset, active = false): L.DivIcon {
  const key = `${status}-${active}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const color = statusAsetConfig[status].dot;
  const scale = active ? 1.25 : 1;
  const size = 30 * scale;

  const html = `
    <div style="width:${size}px;height:${size}px;transform:translate(-50%,-100%);">
      <svg width="${size}" height="${size}" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23c0-8.3-6.7-15-15-15z" fill="${color}"/>
        <circle cx="15" cy="15" r="6.5" fill="white"/>
      </svg>
    </div>`;

  const icon = L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

  cache.set(key, icon);
  return icon;
}
