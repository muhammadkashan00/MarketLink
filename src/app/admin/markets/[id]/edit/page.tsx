import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarketForm } from "@/components/admin/MarketForm";

export const dynamic = "force-dynamic";

export default async function EditMarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const market = await prisma.market.findUnique({ where: { id } }).catch(() => null);
  if (!market) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Edit market</h1>
      <div className="mt-8"><MarketForm market={JSON.parse(JSON.stringify(market))} /></div>
    </div>
  );
}
