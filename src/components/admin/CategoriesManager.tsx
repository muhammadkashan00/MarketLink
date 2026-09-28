"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CategoriesManager({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", icon: "" });
  const [loading, setLoading] = useState(false);

  async function add() {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const r = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success("Category added");
      setForm({ name: "", icon: "" });
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="serif-heading text-lg text-ink-900">Add category</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
          <Input placeholder="e.g. Grains & Pulses" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="🌾" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <Button onClick={add} loading={loading} leftIcon={<Plus className="h-4 w-4" />}>Add</Button>
        </div>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon || "🌿"}</span>
              <div>
                <p className="font-semibold text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-500">/{c.slug}</p>
              </div>
            </div>
            <p className="text-xs text-ink-500">{c._count.products} products</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
