"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Users, ShoppingBasket, Search, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { DAYS_LABEL } from "@/lib/utils";

const MapView = dynamic(() => import("@/components/maps/MapView").then((m) => m.MapView), { ssr: false });

type Market = {
  id: string;
  name: string;
  address: string;
  city: string;
  imageUrl: string | null;
  operatingDays: string[];
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  farmers: any[];
  _count: { farmers: number; orders: number };
};

export function MarketsExplorer({ markets }: { markets: Market[] }) {
  const [q, setQ] = useState("");
  const [day, setDay] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return markets.filter((m) => {
      const matchQ = !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.city.toLowerCase().includes(q.toLowerCase());
      const matchDay = !day || m.operatingDays.includes(day);
      return matchQ && matchDay;
    });
  }, [markets, q, day]);

  const mapMarkers = filtered.map((m) => ({
    position: [m.latitude, m.longitude] as [number, number],
    title: m.name,
    description: m.city,
    href: `/markets/${m.id}`,
  }));

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft md:flex-row md:items-center">
          <div className="flex-1">
            <Input placeholder="Search by name or city…" leftIcon={<Search className="h-4 w-4" />}
              value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setDay(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${!day ? "bg-harvest-800 text-cream-50" : "bg-cream-100 text-ink-700 hover:bg-cream-200"}`}>
              All days
            </button>
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
              <button key={d} onClick={() => setDay(day === d ? null : d)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${day === d ? "bg-harvest-800 text-cream-50" : "bg-cream-100 text-ink-700 hover:bg-cream-200"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {filtered.length === 0 ? (
              <EmptyState title="No markets match your filters" description="Try adjusting your search or day filter." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link href={`/markets/${m.id}`}
                      className="group block overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                      <div className="relative aspect-[5/3] overflow-hidden">
                        <Image
                          src={m.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80"}
                          alt={m.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="serif-heading text-xl text-ink-900 group-hover:text-harvest-800">{m.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                          <MapPin className="h-3.5 w-3.5" /> {m.city}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-1 text-ink-700">
                            <Calendar className="h-3 w-3" /> {m.operatingDays.map((d) => d).join(" · ")}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-1 text-ink-700">
                            <Clock className="h-3 w-3" /> {m.startTime}–{m.endTime}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-cream-100 pt-3 text-xs text-ink-500">
                          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {m._count.farmers} farmers</span>
                          <span className="inline-flex items-center gap-1"><ShoppingBasket className="h-3 w-3" /> {m._count.orders} orders</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 h-[600px] overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
              {mapMarkers.length > 0 ? (
                <MapView markers={mapMarkers} center={mapMarkers[0]?.position || [24.8607, 67.0011]} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink-500">
                  Markets will appear on the map once seeded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
