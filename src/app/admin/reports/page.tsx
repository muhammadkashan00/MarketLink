import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orders90, marketRevenue, topFarmers] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 90 * 24 * 3600 * 1000) } },
      select: { createdAt: true, totalAmount: true, status: true },
    }).catch(() => []),
    prisma.market.findMany({
      include: {
        orders: { where: { status: "COMPLETED" }, select: { totalAmount: true } },
        _count: { select: { orders: true } },
      },
    }).catch(() => []),
    prisma.farmerProfile.findMany({
      include: {
        farmerOrders: { where: { status: "COMPLETED" }, select: { totalAmount: true } },
        user: { select: { name: true } },
      },
    }).catch(() => []),
  ]);

  const marketStats = marketRevenue.map((m) => ({
    name: m.name,
    revenue: m.orders.reduce((s, o) => s + Number(o.totalAmount), 0),
    orders: m._count.orders,
  })).sort((a, b) => b.revenue - a.revenue);

  const farmerStats = topFarmers.map((f) => ({
    stallName: f.stallName,
    name: f.user.name,
    revenue: f.farmerOrders.reduce((s, o) => s + Number(o.totalAmount), 0),
    orders: f.farmerOrders.length,
    rating: f.averageRating,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Reports & analytics</h1>
        <p className="mt-1 text-ink-600">Platform performance across markets and farmers.</p>
      </div>

      <AdminCharts orders={JSON.parse(JSON.stringify(orders90))} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="serif-heading text-lg text-ink-900">Revenue by market</h3>
          <div className="mt-4 space-y-2">
            {marketStats.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between border-b border-cream-100 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="serif-heading text-lg text-ink-400 w-6">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{m.name}</p>
                    <p className="text-xs text-ink-500">{m.orders} orders</p>
                  </div>
                </div>
                <p className="serif-heading text-lg text-harvest-800">{formatCurrency(m.revenue)}</p>
              </div>
            ))}
            {marketStats.length === 0 && <p className="text-sm text-ink-500">No data yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="serif-heading text-lg text-ink-900">Most active farmers</h3>
          <div className="mt-4 space-y-2">
            {farmerStats.map((f, i) => (
              <div key={f.stallName} className="flex items-center justify-between border-b border-cream-100 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="serif-heading text-lg text-ink-400 w-6">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{f.stallName}</p>
                    <p className="text-xs text-ink-500">{f.name} · {f.orders} orders · ★ {f.rating.toFixed(1)}</p>
                  </div>
                </div>
                <p className="serif-heading text-lg text-harvest-800">{formatCurrency(f.revenue)}</p>
              </div>
            ))}
            {farmerStats.length === 0 && <p className="text-sm text-ink-500">No data yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
