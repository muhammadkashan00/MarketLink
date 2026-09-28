"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, MapPin, Users } from "lucide-react";

export function MarketRow({ market }: { market: any }) {
  const router = useRouter();
  async function del() {
    if (!confirm("Delete this market?")) return;
    const r = await fetch(`/api/admin/markets/${market.id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Market deleted"); router.refresh(); }
    else toast.error("Delete failed");
  }
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image src={market.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80"} alt={market.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="serif-heading text-lg text-ink-900">{market.name}</h3>
        <p className="text-xs text-ink-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {market.address}, {market.city}</p>
        <p className="mt-2 text-xs text-ink-500">
          {market.operatingDays.join(" · ")} · {market.startTime}–{market.endTime}
        </p>
        <div className="mt-3 flex items-center gap-3 border-t border-cream-100 pt-3 text-xs">
          <span className="inline-flex items-center gap-1 text-ink-600"><Users className="h-3 w-3" /> {market._count.farmers} farmers</span>
          <span className="text-ink-500">{market._count.orders} orders</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Link href={`/admin/markets/${market.id}/edit`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full" leftIcon={<Pencil className="h-3 w-3" />}>Edit</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={del} leftIcon={<Trash2 className="h-3 w-3" />}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}
