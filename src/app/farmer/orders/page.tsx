import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, timeAgo, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageCheck, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";
const STATUSES = ["ALL", "PLACED", "ACCEPTED", "READY", "COMPLETED", "CANCELLED", "DECLINED"] as const;

export default async function FarmerOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return null;

  const status = (params.status?.toUpperCase() || "ALL") as string;
  const where: any = { farmerId: profile.id };
  if (status !== "ALL") where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Orders</h1>
        <p className="mt-1 text-ink-600">Manage pre-orders from your customers.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link key={s} href={s === "ALL" ? "/farmer/orders" : `/farmer/orders?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${status === s ? "bg-harvest-800 text-cream-50" : "bg-white text-ink-700 border border-cream-200 hover:bg-cream-100"}`}>
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={<PackageCheck className="h-8 w-8" />} title="No orders here yet" description="They'll appear as customers pre-order your stock." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/farmer/orders/${o.id}`}>
              <Card lift className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="serif-heading text-lg text-ink-900">#{o.orderNumber.slice(-6).toUpperCase()}</p>
                      <span className={`badge ${statusBadge(o.status)}`}>{o.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-700">{o.customer.name}</p>
                    <p className="text-xs text-ink-500">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""} · Pickup {formatDate(o.pickupDate)} · {o.pickupSlot}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="serif-heading text-xl text-harvest-800">{formatCurrency(Number(o.totalAmount))}</p>
                    <ChevronRight className="h-5 w-5 text-ink-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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
