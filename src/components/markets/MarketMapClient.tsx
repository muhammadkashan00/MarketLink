"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/maps/MapView").then((m) => m.MapView), { ssr: false });

export function MarketMapClient({ lat, lng, name, address }: { lat: number; lng: number; name: string; address: string }) {
  return <MapView center={[lat, lng]} zoom={15} markers={[{ position: [lat, lng], title: name, description: address }]} />;
}
