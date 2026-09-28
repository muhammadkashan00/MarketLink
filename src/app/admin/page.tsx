import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { Users, Sprout, MapPin, ShoppingBasket, AlertCircle, ArrowRight, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [
    totalCustomers, totalFarmers, pendingFarmers, totalMarkets, totalOrders,
    revenueSum, recentSignups, ordersLast30, topFarmers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }).catch(() => 0),
    prisma.user.count({ where: { role: "FARMER", status: "ACTIVE" } }).catch(() => 0),
    prisma.user.count({ where: { role: "FARMER", status: "PENDING" } }).catch(() => 0),
    prisma.market.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.order.aggregate({ where: { status: "COMPLETED" }, _sum: { totalAmount: true } }).catch(() => ({ _sum: { totalAmount: 0 } })),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, status: true, createdAt: true } }).catch(() => []),
    prisma.order.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) } },
      select: { createdAt: true, totalAmount: true, status: true },
    }).catch(() => []),
    prisma.farmerProfile.findMany({
      orderBy: { totalReviews: "desc" }, take: 5,
      include: { user: { select: { name: true } }, _count: { select: { products: true, farmerOrders: true } } },
    }).catch(() => []),
  ]);

  const stats = [
    { label: "Customers", value: totalCustomers, icon: Users, color: "harvest", href: "/admin/customers" },
    { label: "Active farmers", value: totalFarmers, icon: Sprout, color: "cream", href: "/admin/farmers" },
    { label: "Markets", value: totalMarkets, icon: MapPin, color: "terracotta", href: "/admin/markets" },
    { label: "Total orders", value: totalOrders, icon: ShoppingBasket, color: "harvest", href: "#" },
    { label: "Platform revenue", value: formatCurrency(Number(revenueSum._sum.totalAmount) || 0), icon: DollarSign, color: "cream", href: "/admin/reports" },
    { label: "Pending farmers", value: pendingFarmers, icon: AlertCircle, color: "terracotta", href: "/admin/farmers?status=PENDING" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink-500">Command center</p>
        <h1 className="serif-heading text-4xl text-ink-900">Platform overview</h1>
        <p className="mt-1 text-ink-600">A pulse check on MarketLink activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
                  <p className="serif-heading mt-1 truncate text-2xl text-ink-900">{s.value}</p>
                </div>
                <div className={`rounded-xl bg-${s.color}-100 p-3 text-${s.color}-800`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <AdminCharts orders={JSON.parse(JSON.stringify(ordersLast30))} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="serif-heading text-xl text-ink-900">Recent signups</h2>
            <Link href="/admin/customers" className="text-xs text-harvest-800 hover:underline flex items-center gap-1">
              All users <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentSignups.map((u) => (
              <Card key={u.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-harvest-100 text-xs font-semibold text-harvest-800">
                      {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${u.role === "FARMER" ? "bg-harvest-100 text-harvest-800" : u.role === "ADMIN" ? "bg-ink-800 text-cream-50" : "bg-cream-200 text-cream-800"}`}>
                      {u.role}
                    </span>
                    <p className="mt-1 text-[10px] text-ink-500">{timeAgo(u.createdAt)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="serif-heading text-xl text-ink-900">Top farmers</h2>
            <Link href="/admin/farmers" className="text-xs text-harvest-800 hover:underline flex items-center gap-1">
              All farmers <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topFarmers.map((f) => (
              <Card key={f.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-harvest-100 text-xs font-semibold text-harvest-800">
                      {f.stallName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{f.stallName}</p>
                      <p className="text-xs text-ink-500">{f._count.products} products · {f._count.farmerOrders} orders</p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-500">★ {f.averageRating.toFixed(1)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
