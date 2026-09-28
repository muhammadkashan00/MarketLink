import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { UserStatusActions } from "@/components/admin/UserStatusActions";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFarmersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) return null;
  const status = params.status?.toUpperCase();

  const farmers = await prisma.user.findMany({
    where: { role: "FARMER", ...(status ? { status: status as any } : {}) },
    include: { farmerProfile: { include: { _count: { select: { products: true, farmerOrders: true } } } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Farmers</h1>
        <p className="mt-1 text-ink-600">{farmers.length} farmer{farmers.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "ACTIVE", "SUSPENDED"].map((s) => (
          <Link key={s} href={s === "ALL" ? "/admin/farmers" : `/admin/farmers?status=${s}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${(s === "ALL" && !status) || status === s ? "bg-harvest-800 text-cream-50" : "bg-white text-ink-700 border border-cream-200 hover:bg-cream-100"}`}>
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {farmers.map((f) => (
          <Card key={f.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest-100 serif-heading text-lg text-harvest-800">
                  {(f.farmerProfile?.stallName || f.name).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="serif-heading text-lg text-ink-900">{f.farmerProfile?.stallName || f.name}</p>
                    <span className={`badge ${f.status === "ACTIVE" ? "bg-harvest-100 text-harvest-800" : f.status === "PENDING" ? "bg-cream-200 text-cream-800" : "bg-terracotta-100 text-terracotta-800"}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500">{f.name} · {f.email}</p>
                  <p className="text-xs text-ink-500">
                    {f.farmerProfile?._count.products || 0} products · {f.farmerProfile?._count.farmerOrders || 0} orders · Joined {timeAgo(f.createdAt)}
                  </p>
                </div>
              </div>
              <UserStatusActions userId={f.id} status={f.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
