import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { PackageCheck, ShoppingBasket, Heart, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [ordersCount, activeOrdersCount, favoritesCount, recentOrders, recentProducts] = await Promise.all([
    prisma.order.count({ where: { customerId: user.id } }).catch(() => 0),
    prisma.order.count({ where: { customerId: user.id, status: { in: ["PLACED", "ACCEPTED", "READY"] } } }).catch(() => 0),
    prisma.favorite.count({ where: { userId: user.id } }).catch(() => 0),
    prisma.order.findMany({
      where: { customerId: user.id },
      include: { farmer: { select: { stallName: true } }, items: { take: 1 } },
      orderBy: { createdAt: "desc" }, take: 4,
    }).catch(() => []),
    prisma.product.findMany({
      where: { isAvailable: true, isSoldOut: false },
      include: { farmer: { select: { stallName: true } } },
      orderBy: { totalSold: "desc" }, take: 4,
    }).catch(() => []),
  ]);

  const stats = [
    { label: "Total orders", value: ordersCount, icon: PackageCheck, color: "harvest" },
    { label: "Active", value: activeOrdersCount, icon: ShoppingBasket, color: "terracotta" },
    { label: "Favorites", value: favoritesCount, icon: Heart, color: "cream" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-500">Good {getGreeting()}, </p>
        <h1 className="serif-heading text-4xl text-ink-900">{user.name.split(" ")[0]} 🌿</h1>
        <p className="mt-1 text-ink-600">Here's what's fresh this week and where your orders stand.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
                <p className="serif-heading mt-1 text-3xl text-ink-900">{s.value}</p>
              </div>
              <div className={`rounded-xl bg-${s.color}-100 p-3 text-${s.color}-800`}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="serif-heading text-2xl text-ink-900">Recent orders</h2>
          <Link href="/customer/orders" className="text-sm font-semibold text-harvest-800 hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-500">No orders yet — <Link href="/products" className="font-semibold text-harvest-800 hover:underline">start browsing</Link>.</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {recentOrders.map((o) => (
              <Link key={o.id} href={`/customer/orders/${o.id}`}
                className="flex items-center justify-between rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-harvest-100">
                    <PackageCheck className="h-5 w-5 text-harvest-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Order #{o.orderNumber.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-ink-500">{o.farmer.stallName} · {timeAgo(o.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge ${statusBadge(o.status)}`}>{o.status}</span>
                  <span className="serif-heading text-lg text-harvest-800">{formatCurrency(Number(o.totalAmount))}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="serif-heading text-2xl text-ink-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-terracotta-500" /> Fresh this week
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-harvest-800 hover:underline">Explore all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}
              className="group block overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={p.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80"}
                  alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="serif-heading text-sm text-ink-900 group-hover:text-harvest-800 truncate">{p.name}</h3>
                <p className="text-xs text-ink-500">{p.farmer.stallName}</p>
                <p className="mt-1 serif-heading text-base text-harvest-800">{formatCurrency(Number(p.price))}<span className="text-xs text-ink-500">/{p.unit}</span></p>
              </div>
            </Link>
          ))}
        </div>
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
