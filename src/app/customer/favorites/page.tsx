import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, Store, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favs = await prisma.favorite.findMany({ where: { userId: user.id } }).catch(() => []);
  const farmerIds = favs.filter((f) => f.targetType === "FARMER").map((f) => f.targetId);
  const productIds = favs.filter((f) => f.targetType === "PRODUCT").map((f) => f.targetId);

  const [farmers, products] = await Promise.all([
    farmerIds.length ? prisma.farmerProfile.findMany({
      where: { id: { in: farmerIds } },
      include: { user: { select: { name: true } }, _count: { select: { products: true } } },
    }) : Promise.resolve([]),
    productIds.length ? prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { farmer: { select: { stallName: true } } },
    }) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Your favorites</h1>
        <p className="mt-1 text-ink-600">Quick access to the growers and produce you love.</p>
      </div>

      {favs.length === 0 && (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="No favorites yet"
          description="Tap the heart on any farmer or product to save it here."
          action={<Link href="/products" className="btn-primary">Explore products</Link>}
        />
      )}

      {farmers.length > 0 && (
        <section>
          <h2 className="serif-heading mb-4 text-xl text-ink-900 flex items-center gap-2"><Store className="h-5 w-5 text-harvest-700" /> Favorite farmers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {farmers.map((f) => (
              <Link key={f.id} href={`/farmers/${f.id}`}>
                <Card lift className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest-100 serif-heading text-lg text-harvest-800">
                      {f.stallName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="serif-heading text-lg text-ink-900">{f.stallName}</p>
                      <p className="text-xs text-ink-500">{f._count.products} products</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section>
          <h2 className="serif-heading mb-4 text-xl text-ink-900 flex items-center gap-2"><Package className="h-5 w-5 text-harvest-700" /> Favorite products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group block overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={p.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80"} alt={p.name} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="serif-heading text-sm text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-500">{p.farmer.stallName}</p>
                  <p className="mt-1 serif-heading text-base text-harvest-800">{formatCurrency(Number(p.price))}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
