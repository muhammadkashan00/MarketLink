import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Plus, Package, Eye, EyeOff, AlertTriangle, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerProductsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId: user.id },
    include: {
      products: {
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  }).catch(() => null);

  if (!profile) return <p>Profile missing.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="serif-heading text-4xl text-ink-900">Products</h1>
          <p className="mt-1 text-ink-600">{profile.products.length} listing{profile.products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/farmer/products/new">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Add product</Button>
        </Link>
      </div>

      {profile.products.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream-100">
            <Package className="h-6 w-6 text-harvest-700" />
          </div>
          <h2 className="serif-heading text-xl text-ink-900">No products yet</h2>
          <p className="mt-1 text-sm text-ink-500">Start by adding what you're bringing to market this week.</p>
          <Link href="/farmer/products/new" className="mt-4 inline-block btn-primary">Add your first product</Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.products.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image src={p.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80"} alt={p.name} fill className="object-cover" />
                {p.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60">
                    <span className="rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-cream-50">OUT OF STOCK</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-ink-500">{p.category.icon} {p.category.name}</p>
                <h3 className="serif-heading text-lg text-ink-900">{p.name}</h3>
                <p className="mt-1 serif-heading text-lg text-harvest-800">
                  {formatCurrency(Number(p.price))}<span className="text-xs text-ink-500">/{p.unit}</span>
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="badge bg-cream-100 text-ink-700">{p.stock} in stock</span>
                  {p.isRecurring && <span className="badge bg-harvest-100 text-harvest-800">Weekly</span>}
                  {!p.isAvailable && <span className="badge bg-ink-100 text-ink-700"><EyeOff className="h-3 w-3" /> Hidden</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/farmer/products/${p.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full" leftIcon={<Pencil className="h-3 w-3" />}>Edit</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
