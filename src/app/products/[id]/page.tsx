import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AddToCartClient } from "@/components/products/AddToCartClient";
import { StarRating } from "@/components/ui/StarRating";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { MapPin, Package, Sprout, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser().catch(() => null);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      farmer: {
        include: {
          user: { select: { name: true } },
          markets: { include: { market: true } },
        },
      },
    },
  }).catch(() => null);

  if (!product) notFound();

  const reviews = await prisma.review.findMany({
    where: { targetType: "PRODUCT", targetId: product.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  }).catch(() => []);

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <section className="pt-8 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/products" className="text-sm text-ink-500 hover:text-harvest-800">← All products</Link>
          <div className="mt-4 grid gap-10 lg:grid-cols-2">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-soft">
                <SafeImage
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  fallbackEmoji={product.category.icon || "🌿"}
                  fallbackLabel={product.name}
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-harvest-700">{product.category.icon} {product.category.name}</p>
              <h1 className="serif-heading mt-2 text-5xl text-ink-900">{product.name}</h1>
              <div className="mt-3 flex items-center gap-3">
                <StarRating value={Math.round(product.averageRating || 0)} readOnly size={16} />
                <p className="text-xs text-ink-500">
                  {product.averageRating.toFixed(1)} · {product.totalReviews} review{product.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="mt-6 serif-heading text-4xl text-harvest-800">
                {formatCurrency(Number(product.price))}
                <span className="ml-2 text-base text-ink-500">/ {product.unit}</span>
              </p>

              {product.description && <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>}

              <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink-600"><Package className="h-4 w-4" /> Stock available</span>
                  <span className="serif-heading text-lg text-ink-900">{product.stock} {product.unit}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <div className="h-full bg-harvest-700 transition-all" style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                </div>
              </div>

              <div className="mt-6">
                <AddToCartClient
                  product={{
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    unit: product.unit,
                    imageUrl: product.imageUrl || undefined,
                    stock: product.stock,
                    farmerId: product.farmerId,
                    farmerName: product.farmer.stallName,
                  }}
                  isLoggedIn={!!user}
                  isCustomer={user?.role === "CUSTOMER"}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
                <p className="text-xs uppercase tracking-wider text-ink-500">Sold by</p>
                <Link href={`/farmers/${product.farmer.id}`} className="mt-2 flex items-center gap-3 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest-100 serif-heading text-lg text-harvest-800">
                    {product.farmer.stallName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="serif-heading text-lg text-ink-900 group-hover:text-harvest-800">{product.farmer.stallName}</p>
                    <p className="text-xs text-ink-500 flex items-center gap-1">
                      <Sprout className="h-3 w-3" /> {product.farmer.markets.length} market{product.farmer.markets.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge bg-cream-100 text-ink-700"><Clock className="h-3 w-3" /> Pickup: {product.farmer.pickupWindowStart}–{product.farmer.pickupWindowEnd}</span>
                  {product.farmer.mapAddress && (
                    <span className="badge bg-cream-100 text-ink-700"><MapPin className="h-3 w-3" /> {product.farmer.mapAddress}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="serif-heading text-3xl text-ink-900">Customer reviews</h2>
              <div className="mt-6 space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-100 text-xs font-semibold text-terracotta-700">
                          {r.customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{r.customer.name}</p>
                          <p className="text-xs text-ink-500">{timeAgo(r.createdAt)}</p>
                        </div>
                      </div>
                      <StarRating value={r.rating} readOnly size={14} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
