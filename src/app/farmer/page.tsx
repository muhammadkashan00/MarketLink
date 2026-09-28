import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { PackageCheck, TrendingUp, Star, ShoppingBasket, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.farmerProfile.findUnique({
    where: { userId: user.id },
    include: { products: true },
  }).catch(() => null);
  if (!profile) return <p>Profile missing — please contact support.</p>;

  const [pending, activeOrders, completedThisMonth, revenue, recentOrders, topProducts] = await Promise.all([
    prisma.order.count({ where: { farmerId: profile.id, status: "PLACED" } }).catch(() => 0),
    prisma.order.count({ where: { farmerId: profile.id, status: { in: ["ACCEPTED", "READY"] } } }).catch(() => 0),
    prisma.order.count({
      where: {
        farmerId: profile.id, status: "COMPLETED",
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }).catch(() => 0),
    prisma.order.aggregate({
      where: { farmerId: profile.id, status: "COMPLETED" },
      _sum: { totalAmount: true },
    }).catch(() => ({ _sum: { totalAmount: 0 } })),
    prisma.order.findMany({
      where: { farmerId: profile.id },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" }, take: 5,
    }).catch(() => []),
    prisma.product.findMany({
      where: { farmerId: profile.id },
      orderBy: { totalSold: "desc" }, take: 4,
    }).catch(() => []),
  ]);

  const stats = [
    { label: "Pending", value: pending, icon: ShoppingBasket, color: "terracotta" },
    { label: "In progress", value: activeOrders, icon: PackageCheck, color: "harvest" },
    { label: "Completed (mo)", value: completedThisMonth, icon: TrendingUp, color: "cream" },
    { label: "Total revenue", value: formatCurrency(Number(revenue._sum.totalAmount) || 0), icon: Star, color: "harvest" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-500">Good {getGreeting()},</p>
        <h1 className="serif-heading text-4xl text-ink-900">{profile.stallName} 🌾</h1>
        <p className="mt-1 text-ink-600">Here's your stall at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
                <p className="serif-heading mt-1 text-2xl text-ink-900">{s.value}</p>
              </div>
              <div className={`rounded-xl bg-${s.color}-100 p-3 text-${s.color}-800`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="serif-heading text-2xl text-ink-900">Recent orders</h2>
            <Link href="/farmer/orders" className="text-sm font-semibold text-harvest-800 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <Card className="p-8 text-center text-sm text-ink-500">
              No orders yet. Share your stall with customers to get started!
            </Card>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <Link key={o.id} href={`/farmer/orders/${o.id}`}>
                  <Card className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ink-900">#{o.orderNumber.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-ink-500">{o.customer.name} · {timeAgo(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${statusBadge(o.status)}`}>{o.status}</span>
                        <p className="mt-1 serif-heading text-base text-harvest-800">{formatCurrency(Number(o.totalAmount))}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="serif-heading text-2xl text-ink-900">Top products</h2>
            <Link href="/farmer/products" className="text-sm font-semibold text-harvest-800 hover:underline flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <Card className="p-8 text-center text-sm text-ink-500">
              <p>No products yet.</p>
              <Link href="/farmer/products/new" className="mt-2 inline-block text-harvest-800 font-semibold hover:underline">Add your first →</Link>
            </Card>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p) => (
                <Card key={p.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={p.imageUrl} alt={p.name} fill className="object-cover" fallbackLabel="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{p.name}</p>
                      <p className="text-xs text-ink-500">{p.totalSold} sold · Rs. {Number(p.price).toFixed(0)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-harvest-100 p-3">
              <Star className="h-5 w-5 text-harvest-800" />
            </div>
            <div className="flex-1">
              <p className="serif-heading text-xl text-ink-900">Your rating</p>
              <div className="mt-1 flex items-center gap-3">
                <StarRating value={Math.round(profile.averageRating)} readOnly size={16} />
                <p className="text-sm text-ink-600">
                  {profile.averageRating.toFixed(1)} · {profile.totalReviews} review{profile.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Link href="/farmer/reviews" className="btn-secondary text-sm">See all</Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function statusBadge(status: string) {
  switch (status) {
    case "PLACED": return "bg-cream-200 text-cream-800";
    case "ACCEPTED": return "bg-harvest-100 text-harvest-800";
    case "READY": return "bg-terracotta-100 text-terracotta-700";
    case "COMPLETED": return "bg-ink-100 text-ink-700";
    case "CANCELLED": case "DECLINED": return "bg-terracotta-100 text-terracotta-800";
    default: return "bg-cream-100 text-ink-700";
  }
}
