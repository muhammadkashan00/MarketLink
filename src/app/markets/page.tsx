import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketsExplorer } from "@/components/markets/MarketsExplorer";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const user = await getCurrentUser().catch(() => null);
  let markets: any[] = [];
  try {
    markets = await prisma.market.findMany({
      include: {
        farmers: { include: { farmer: { select: { id: true, stallName: true } } } },
        _count: { select: { farmers: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <section className="pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="serif-heading text-5xl text-ink-900">Farmers markets near you</h1>
          <p className="mt-3 max-w-2xl text-ink-600">Discover weekly markets in your city. Tap any pin to see participating farmers and this week's stock.</p>
        </div>
      </section>
      <MarketsExplorer markets={JSON.parse(JSON.stringify(markets))} />
      <Footer />
    </div>
  );
}
