"use client";
import { useEffect, useMemo, useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/Card";

export function AdminCharts({ orders }: { orders: Array<{ createdAt: string; totalAmount: number | string; status: string }> }) {
  // Recharts + Date.now() must run client-only to avoid SSR/CSR mismatch that
  // React 18 treats as a hydration error (and unmounts the whole subtree).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, pieData, colors } = useMemo(() => {
    const byDay: Record<string, { orders: number; revenue: number }> = {};
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const key = d.toISOString().slice(5, 10);
      byDay[key] = { orders: 0, revenue: 0 };
      days.push(key);
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(5, 10);
      if (key in byDay) {
        byDay[key].orders += 1;
        if (o.status === "COMPLETED") byDay[key].revenue += Number(o.totalAmount);
      }
    });
    const data = days.map((date) => ({ date, ...byDay[date] }));

    const statusCounts: Record<string, number> = {};
    orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
    const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    return { data, pieData, colors: ["#2D5F3F", "#C9633D", "#E3B355", "#5A9540", "#8B6229", "#48433A"] };
  }, [orders, mounted]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <h3 className="serif-heading text-lg text-ink-900">Orders · last 30 days</h3>
        <div className="mt-4 h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="adminOrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9633D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9633D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3DEB6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8F8776" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#8F8776" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E3EFDB", fontSize: 12 }} />
                <Area type="monotone" dataKey="orders" stroke="#C9633D" strokeWidth={2} fill="url(#adminOrd)" name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded-xl bg-cream-100" />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="serif-heading text-lg text-ink-900">Order status mix</h3>
        <div className="mt-4 h-72">
          {mounted && pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E3EFDB", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : mounted ? (
            <div className="flex h-full items-center justify-center text-sm text-ink-500">No order data yet.</div>
          ) : (
            <div className="h-full w-full animate-pulse rounded-xl bg-cream-100" />
          )}
        </div>
      </Card>
    </div>
  );
}
