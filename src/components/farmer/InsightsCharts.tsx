"use client";
import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";

export function InsightsCharts({
  recentOrders, topProducts,
}: {
  recentOrders: Array<{ createdAt: string; totalAmount: number | string; status: string }>;
  topProducts: Array<{ name: string; sold: number; price: number }>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const revenueData = useMemo(() => {
    const byDay: Record<string, number> = {};
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const key = d.toISOString().slice(5, 10);
      byDay[key] = 0;
      days.push(key);
    }
    recentOrders.forEach((o) => {
      if (o.status === "COMPLETED") {
        const key = new Date(o.createdAt).toISOString().slice(5, 10);
        if (key in byDay) byDay[key] += Number(o.totalAmount);
      }
    });
    return days.map((d) => ({ date: d, revenue: byDay[d] }));
  }, [recentOrders, mounted]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="serif-heading text-lg text-ink-900">Revenue · last 30 days</h3>
        <div className="mt-4 h-64">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D5F3F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2D5F3F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8F8776" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#8F8776" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E3EFDB", fontSize: 12 }}
                  formatter={(v: number) => [`Rs. ${v.toFixed(0)}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2D5F3F" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded-xl bg-cream-100" />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="serif-heading text-lg text-ink-900">Top 5 products</h3>
        <div className="mt-4 h-64">
          {mounted && topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid horizontal={false} stroke="#F3DEB6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#8F8776" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#48433A" }} width={120} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E3EFDB", fontSize: 12 }}
                  formatter={(v: number) => [`${v} sold`, "Units"]}
                />
                <Bar dataKey="sold" fill="#C9633D" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : mounted ? (
            <div className="flex h-full items-center justify-center text-sm text-ink-500">No product sales yet.</div>
          ) : (
            <div className="h-full w-full animate-pulse rounded-xl bg-cream-100" />
          )}
        </div>
      </Card>
    </div>
  );
}
