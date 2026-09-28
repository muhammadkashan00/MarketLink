"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/maps/MapView").then((m) => m.MapView), { ssr: false });

export function ContactMap() {
  return (
    <MapView
      center={[24.8607, 67.0011]}
      zoom={13}
      markers={[{ position: [24.8607, 67.0011], title: "MarketLink HQ", description: "Aptech Learning Center, Karachi" }]}
    />
  );
}
