import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { MarketRow } from "@/components/admin/MarketRow";
import { Button } from "@/components/ui/Button";
import { Plus, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMarketsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const markets = await prisma.market.findMany({
    include: { _count: { select: { farmers: true, orders: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="serif-heading text-4xl text-ink-900">Markets</h1>
          <p className="mt-1 text-ink-600">{markets.length} weekly market{markets.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/markets/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add market</Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {markets.map((m) => (
          <MarketRow key={m.id} market={JSON.parse(JSON.stringify(m))} />
        ))}
      </div>
    </div>
  );
}
