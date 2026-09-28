"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function MarketForm({ market }: { market?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: market?.name || "",
    address: market?.address || "",
    city: market?.city || "",
    operatingDays: market?.operatingDays || ["SAT", "SUN"],
    startTime: market?.startTime || "07:00",
    endTime: market?.endTime || "13:00",
    latitude: market?.latitude ?? 24.8607,
    longitude: market?.longitude ?? 67.0011,
    imageUrl: market?.imageUrl || "",
    description: market?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function toggleDay(d: string) {
    setForm((f) => ({
      ...f,
      operatingDays: f.operatingDays.includes(d) ? f.operatingDays.filter((x: string) => x !== d) : [...f.operatingDays, d],
    }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const b64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const r = await fetch("/api/upload", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: b64, folder: "marketlink/markets" }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      setForm({ ...form, imageUrl: data.url });
      toast.success("Uploaded");
    } finally { setUploading(false); }
  }

  async function save() {
    setLoading(true);
    try {
      const url = market ? `/api/admin/markets/${market.id}` : "/api/admin/markets";
      const method = market ? "PATCH" : "POST";
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude), longitude: Number(form.longitude),
        }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success(market ? "Market updated" : "Market created");
      router.push("/admin/markets");
      router.refresh();
    } catch { toast.error("Save failed"); }
    finally { setLoading(false); }
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <label className="label">Cover image</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="relative flex h-24 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50">
            {form.imageUrl ? <img src={form.imageUrl} alt="" className="h-full w-full object-cover" /> : <UploadCloud className="h-6 w-6 text-ink-400" />}
          </div>
          <div>
            <input id="mimg" type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <label htmlFor="mimg" className="btn-secondary cursor-pointer text-sm">{uploading ? "Uploading…" : "Upload"}</label>
          </div>
        </div>
      </div>

      <Input label="Market name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </div>

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

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Opens at" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        <Input label="Closes at" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Latitude" type="number" step={0.000001} value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} />
        <Input label="Longitude" type="number" step={0.000001} value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} />
      </div>

      <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <Button onClick={save} loading={loading} leftIcon={<Save className="h-4 w-4" />}>Save</Button>
    </Card>
  );
}
