import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { UserStatusActions } from "@/components/admin/UserStatusActions";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { customerOrders: true, favorites: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Customers</h1>
        <p className="mt-1 text-ink-600">{customers.length} customer{customers.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="space-y-2">
        {customers.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-100 text-xs font-semibold text-terracotta-700">
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    <span className={`badge ${c.status === "ACTIVE" ? "bg-harvest-100 text-harvest-800" : "bg-terracotta-100 text-terracotta-700"}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-ink-500">{c.email} · {c._count.customerOrders} orders · Joined {timeAgo(c.createdAt)}</p>
                </div>
              </div>
              <UserStatusActions userId={c.id} status={c.status} customer />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
