import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InsightsCharts } from "@/components/farmer/InsightsCharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return null;

  const [totalOrders, totalRevenue, uniqueCustomers, topProducts, ordersLast30] = await Promise.all([
    prisma.order.count({ where: { farmerId: profile.id, status: "COMPLETED" } }).catch(() => 0),
    prisma.order.aggregate({ where: { farmerId: profile.id, status: "COMPLETED" }, _sum: { totalAmount: true } }).catch(() => ({ _sum: { totalAmount: 0 } })),
    prisma.order.findMany({ where: { farmerId: profile.id, status: "COMPLETED" }, select: { customerId: true }, distinct: ["customerId"] }).catch(() => []),
    prisma.product.findMany({
      where: { farmerId: profile.id }, orderBy: { totalSold: "desc" }, take: 5,
      select: { name: true, totalSold: true, price: true },
    }).catch(() => []),
    prisma.order.findMany({
      where: {
        farmerId: profile.id,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
      },
      select: { createdAt: true, totalAmount: true, status: true },
    }).catch(() => []),
  ]);

  const stats = [
    { label: "Total sales", value: totalOrders, icon: TrendingUp, color: "harvest" },
    { label: "Revenue", value: formatCurrency(Number(totalRevenue._sum.totalAmount) || 0), icon: DollarSign, color: "cream" },
    { label: "Unique customers", value: uniqueCustomers.length, icon: Users, color: "terracotta" },
    { label: "Best seller", value: topProducts[0]?.name || "—", icon: Package, color: "harvest" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Insights</h1>
        <p className="mt-1 text-ink-600">Understand what's working and what's next.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
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
        ))}
      </div>

      <InsightsCharts
        recentOrders={JSON.parse(JSON.stringify(ordersLast30))}
        topProducts={topProducts.map((p) => ({ name: p.name, sold: p.totalSold, price: Number(p.price) }))}
      />
    </div>
  );
}
