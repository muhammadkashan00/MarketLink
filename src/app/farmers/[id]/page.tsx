import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { MapPin, Clock, MessageCircle, Sprout, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser().catch(() => null);
  const farmer = await prisma.farmerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, status: true } },
      products: {
        where: { isAvailable: true, isSoldOut: false },
        include: { category: true },
      },
      markets: { include: { market: true } },
    },
  }).catch(() => null);

  if (!farmer || farmer.user.status !== "ACTIVE") notFound();

  const reviews = await prisma.review.findMany({
    where: { targetType: "FARMER", targetId: farmer.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" }, take: 6,
  }).catch(() => []);

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      {/* Compact banner with decorative leaf pattern (or real banner if farmer uploaded one) */}
      <section className="relative">
        <div className="relative h-44 overflow-hidden bg-harvest-800 md:h-48">
          {farmer.bannerUrl ? (
            <Image src={farmer.bannerUrl} alt="" fill className="object-cover opacity-70" />
          ) : (
            <svg width="100%" height="100%" className="absolute inset-0 opacity-15">
              <defs>
                <pattern id="farmleaf" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
                  <path d="M40 20 Q28 32 28 46 Q40 52 40 32 Z" fill="#FDF8F0" />
                  <circle cx="60" cy="60" r="1.5" fill="#FDF8F0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#farmleaf)" />
            </svg>
          )}
          <div className="hero-blob absolute -top-16 right-1/4 h-72 w-72 rounded-full bg-terracotta-400/25" />
          <div className="hero-blob absolute -bottom-16 left-1/4 h-72 w-72 rounded-full bg-cream-400/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-100" />
        </div>
      </section>

      {/* Profile header — avatar overlaps banner, name + rating beside it */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="-mt-14 flex flex-wrap items-end gap-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-cream-50 bg-harvest-100 serif-heading text-3xl text-harvest-800 shadow-lift md:h-32 md:w-32 md:text-4xl">
              {farmer.stallName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-ink-500">Farmer stall</p>
              <h1 className="serif-heading text-3xl text-ink-900 md:text-4xl">{farmer.stallName}</h1>
              <p className="mt-1 text-sm text-ink-600">Run by {farmer.user.name}</p>
              <div className="mt-2 flex items-center gap-3">
                <StarRating value={Math.round(farmer.averageRating || 0)} readOnly size={14} />
                <p className="text-xs text-ink-500">
                  {farmer.averageRating.toFixed(1)} · {farmer.totalReviews} review{farmer.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="space-y-4 lg:col-span-1">
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-ink-500">Operating days</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {farmer.operatingDays.map((d) => (
                    <span key={d} className="badge bg-harvest-100 text-harvest-800">{d}</span>
                  ))}
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-ink-500">Pickup window</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-ink-800">
                  <Clock className="h-3.5 w-3.5" /> {farmer.pickupWindowStart} – {farmer.pickupWindowEnd}
                </p>
                {farmer.mapAddress && (
                  <>
                    <p className="mt-4 text-xs uppercase tracking-wider text-ink-500">Location</p>
                    <p className="mt-1 flex items-start gap-1 text-sm text-ink-800">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {farmer.mapAddress}
                    </p>
                  </>
                )}
              </Card>

              {farmer.markets.length > 0 && (
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-wider text-ink-500">Selling at</p>
                  <ul className="mt-2 space-y-2">
                    {farmer.markets.map((l) => (
                      <li key={l.id}>
                        <Link href={`/markets/${l.market.id}`} className="text-sm text-ink-800 hover:text-harvest-800">
                          {l.market.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </aside>

            <div className="lg:col-span-3 space-y-8">
              {farmer.bio && (
                <Card className="p-6">
                  <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-harvest-700" /> About the stall
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-700">{farmer.bio}</p>
                </Card>
              )}

              <div>
                <h2 className="serif-heading mb-4 text-2xl text-ink-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-harvest-700" /> This week's stock ({farmer.products.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {farmer.products.map((p) => (
                    <Link key={p.id} href={`/products/${p.id}`}
                      className="group block rounded-2xl border border-cream-200 bg-white p-3 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <SafeImage
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          fallbackEmoji={p.category.icon || "🌿"}
                          fallbackLabel={p.name}
                        />
                      </div>
                      <p className="mt-2 serif-heading text-sm text-ink-900 group-hover:text-harvest-800">{p.name}</p>
                      <p className="text-xs text-ink-500">{p.category.icon} {p.category.name}</p>
                      <p className="mt-1 serif-heading text-base text-harvest-800">
                        {formatCurrency(Number(p.price))}<span className="text-xs text-ink-500">/{p.unit}</span>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {reviews.length > 0 && (
                <div>
                  <h2 className="serif-heading mb-4 text-2xl text-ink-900 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-harvest-700" /> Recent reviews
                  </h2>
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <Card key={r.id} className="p-5">
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
                        {r.farmerResponse && (
                          <div className="mt-3 rounded-xl bg-harvest-50 p-3">
                            <p className="text-xs font-semibold uppercase text-harvest-800">Farmer replied</p>
                            <p className="mt-1 text-sm italic text-ink-700">"{r.farmerResponse}"</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
