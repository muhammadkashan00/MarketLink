"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Trash2, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

type ProductInput = {
  id?: string;
  name: string; description: string; categoryId: string;
  price: number; unit: string; stock: number; imageUrl: string;
  isRecurring: boolean; isAvailable?: boolean; isSoldOut?: boolean;
};

const UNITS = ["kg", "g", "dozen", "bunch", "piece", "pack", "loaf", "litre", "bottle"];

export function ProductForm({ categories, product }: { categories: any[]; product?: ProductInput }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(product || {
    name: "", description: "", categoryId: categories[0]?.id || "",
    price: 100, unit: "kg", stock: 10, imageUrl: "", isRecurring: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
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
        body: JSON.stringify({ imageBase64: b64 }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Upload failed"); return; }
      setForm({ ...form, imageUrl: data.url });
      toast.success("Image uploaded");
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  }

  async function save() {
    setLoading(true);
    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Save failed"); return; }
      toast.success(product ? "Product updated" : "Product added");
      router.push("/farmer/products");
      router.refresh();
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }

  async function del() {
    if (!product || !confirm("Delete this product? This cannot be undone.")) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Delete failed"); return; }
      toast.success("Deleted");
      router.push("/farmer/products");
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <Card className="p-6 space-y-5">
      <div>
        <label className="label">Product image</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <UploadCloud className="h-8 w-8 text-ink-400" />
            )}
          </div>
          <div>
            <input id="img" type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <label htmlFor="img" className="btn-secondary cursor-pointer text-sm">{uploading ? "Uploading…" : form.imageUrl ? "Replace image" : "Upload image"}</label>
            <p className="mt-1 text-xs text-ink-500">Max 5MB · JPG / PNG</p>
          </div>
        </div>
      </div>

      <Input label="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Heirloom tomatoes" />

      <Textarea label="Description" rows={3} value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Sun-ripened, deep red, from our polytunnels…" />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Category</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <Input label="Price (Rs.)" type="number" min={0} step={5}
          value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <div>
          <label className="label">Unit</label>
          <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input">
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <Input label="Stock available" type="number" min={0} value={form.stock}
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />

      <div className="space-y-2 border-t border-cream-200 pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} className="rounded" />
          <span>Add to my weekly stock template (auto-relist each week)</span>
        </label>
        {product && (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isAvailable ?? true} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="rounded" />
              <span>Visible to customers</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isSoldOut ?? false} onChange={(e) => setForm({ ...form, isSoldOut: e.target.checked })} className="rounded" />
              <span>Marked as sold out</span>
            </label>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-cream-200 pt-4">
        <Button onClick={save} loading={loading} leftIcon={<Save className="h-4 w-4" />}>{product ? "Save changes" : "Add product"}</Button>
        {product && (
          <Button variant="danger" onClick={del} loading={loading} leftIcon={<Trash2 className="h-4 w-4" />}>Delete</Button>
        )}
      </div>
    </Card>
  );
}
