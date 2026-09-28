"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix default icon path issue in Next.js
const customIcon = L.divIcon({
  className: "custom-map-marker",
  html: `
    <div style="position: relative; width: 32px; height: 40px;">
      <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" width="32" height="40">
        <path d="M16 0 C7.2 0 0 7.2 0 16 C0 27.5 16 40 16 40 C16 40 32 27.5 32 16 C32 7.2 24.8 0 16 0 Z"
              fill="#2D5F3F" stroke="#FDF8F0" stroke-width="2"/>
        <circle cx="16" cy="15" r="6" fill="#FDF8F0"/>
        <text x="16" y="19" text-anchor="middle" font-size="10" fill="#2D5F3F" font-weight="700">M</text>
      </svg>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
});

function FitBounds({ markers }: { markers: Array<{ position: [number, number] }> }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => m.position));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

export function MapView({
  center = [24.8607, 67.0011],
  zoom = 12,
  markers = [],
  height = "100%",
}: {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ position: [number, number]; title: string; description?: string; href?: string }>;
  height?: string;
}) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} icon={customIcon}>
          <Popup>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.title}</p>
              {m.description && <p style={{ fontSize: 12, color: "#666" }}>{m.description}</p>}
              {m.href && <a href={m.href} style={{ fontSize: 12, color: "#2D5F3F", fontWeight: 600 }}>Details →</a>}
            </div>
          </Popup>
        </Marker>
      ))}
      {markers.length > 1 && <FitBounds markers={markers} />}
    </MapContainer>
  );
}
