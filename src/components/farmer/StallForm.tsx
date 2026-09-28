"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, MapPin, Store, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function StallForm({
  profile, markets, registeredMarkets,
}: {
  profile: any;
  markets: any[];
  registeredMarkets: Array<{ marketId: string; stallNumber: string }>;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    stallName: profile.stallName, bio: profile.bio,
    operatingDays: profile.operatingDays as string[],
    pickupWindowStart: profile.pickupWindowStart, pickupWindowEnd: profile.pickupWindowEnd,
    orderCutoffHours: profile.orderCutoffHours,
    latitude: profile.latitude ?? "", longitude: profile.longitude ?? "",
    mapAddress: profile.mapAddress, bannerUrl: profile.bannerUrl,
  });
  const [selectedMarkets, setSelectedMarkets] = useState<Record<string, string>>(
    Object.fromEntries(registeredMarkets.map((r) => [r.marketId, r.stallNumber]))
  );
  const [loading, setLoading] = useState(false);

  function toggleDay(d: string) {
    setForm((f) => ({
      ...f,
      operatingDays: f.operatingDays.includes(d) ? f.operatingDays.filter((x) => x !== d) : [...f.operatingDays, d],
    }));
  }

  async function save() {
    setLoading(true);
    try {
      const r = await fetch("/api/farmers/me/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stallName: form.stallName, bio: form.bio,
          operatingDays: form.operatingDays,
          pickupWindowStart: form.pickupWindowStart, pickupWindowEnd: form.pickupWindowEnd,
          orderCutoffHours: form.orderCutoffHours,
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
          mapAddress: form.mapAddress,
          bannerUrl: form.bannerUrl,
        }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }

      // Sync markets
      for (const [marketId, stallNumber] of Object.entries(selectedMarkets)) {
        await fetch("/api/farmers/me/markets", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marketId, stallNumber }),
        });
      }
      for (const reg of registeredMarkets) {
        if (!(reg.marketId in selectedMarkets)) {
          await fetch(`/api/farmers/me/markets?marketId=${reg.marketId}`, { method: "DELETE" });
        }
      }

      toast.success("Stall updated");
      router.refresh();
    } catch { toast.error("Save failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5">
      <Card className="p-6 space-y-4">
        <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><Store className="h-5 w-5 text-harvest-700" /> Stall details</h2>
        <Input label="Stall name" value={form.stallName} onChange={(e) => setForm({ ...form, stallName: e.target.value })} />
        <Textarea label="Stall bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell customers about your farming approach, family history, favorite crops…" />
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><Clock className="h-5 w-5 text-harvest-700" /> Operating hours</h2>
        <div>
          <p className="label">Operating days</p>
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((d) => (
              <button key={d} type="button" onClick={() => toggleDay(d)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${form.operatingDays.includes(d) ? "bg-harvest-800 text-cream-50" : "bg-cream-100 text-ink-700 hover:bg-cream-200"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label="Pickup starts" type="time" value={form.pickupWindowStart} onChange={(e) => setForm({ ...form, pickupWindowStart: e.target.value })} />
          <Input label="Pickup ends" type="time" value={form.pickupWindowEnd} onChange={(e) => setForm({ ...form, pickupWindowEnd: e.target.value })} />
          <Input label="Cutoff (hours)" type="number" min={1} max={72} value={form.orderCutoffHours}
            onChange={(e) => setForm({ ...form, orderCutoffHours: Number(e.target.value) })} />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><MapPin className="h-5 w-5 text-harvest-700" /> Location</h2>
        <Input label="Stall address / pickup point" value={form.mapAddress} onChange={(e) => setForm({ ...form, mapAddress: e.target.value })}
          placeholder="e.g. Row B, Stall 12, Green Valley Market" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Latitude" type="number" step={0.000001} value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="24.8607" />
          <Input label="Longitude" type="number" step={0.000001} value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="67.0011" />
        </div>
        <p className="text-xs text-ink-500">Tip: Open Google Maps, right-click on your spot, and copy the lat/lng.</p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="serif-heading text-xl text-ink-900">Markets I sell at</h2>
        <p className="text-xs text-ink-500">Select the weekly markets where customers can pick up your orders.</p>
        <div className="space-y-2">
          {markets.map((m) => (
            <label key={m.id} className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all ${m.id in selectedMarkets ? "border-harvest-800 bg-harvest-50" : "border-cream-200"}`}>
              <input type="checkbox" checked={m.id in selectedMarkets} onChange={(e) => {
                if (e.target.checked) setSelectedMarkets({ ...selectedMarkets, [m.id]: "" });
                else { const c = { ...selectedMarkets }; delete c[m.id]; setSelectedMarkets(c); }
              }} className="rounded" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{m.name}</p>
                <p className="text-xs text-ink-500">{m.city} · {m.operatingDays.join(" · ")}</p>
              </div>
              {m.id in selectedMarkets && (
                <input type="text" placeholder="Stall #" value={selectedMarkets[m.id]}
                  onChange={(e) => setSelectedMarkets({ ...selectedMarkets, [m.id]: e.target.value })}
                  className="w-24 rounded-lg border border-cream-200 px-2 py-1 text-sm" />
              )}
            </label>
          ))}
        </div>
      </Card>

      <Button onClick={save} loading={loading} leftIcon={<Save className="h-4 w-4" />}>Save stall</Button>
    </div>
  );
}
