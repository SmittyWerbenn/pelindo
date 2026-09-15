import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Aset } from "../../types";
import { getMarkerIcon } from "./markerIcon";
import { MarkerPopupCard } from "./MarkerPopupCard";

interface AssetMapProps {
  assets: Aset[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export function AssetMap({ assets, center = [-6.245, 106.79], zoom = 13, height = "480px", className = "" }: AssetMapProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`} style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {assets.map((asset) => (
          <Marker key={asset.kode} position={[asset.lat, asset.lng]} icon={getMarkerIcon(asset.status)}>
            <Popup>
              <MarkerPopupCard asset={asset} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
