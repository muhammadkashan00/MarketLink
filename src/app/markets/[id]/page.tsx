import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketMapClient } from "@/components/markets/MarketMapClient";
import { MapPin, Clock, Calendar, Users } from "lucide-react";
import { DAYS_LABEL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser().catch(() => null);
  const market = await prisma.market.findUnique({
    where: { id },
    include: {
      farmers: {
        include: {
          farmer: {
            include: {
              user: { select: { name: true } },
              _count: { select: { products: true } },
            },
          },
        },
      },
    },
  }).catch(() => null);

  if (!market) notFound();

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <section className="relative pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/markets" className="text-sm text-ink-500 hover:text-harvest-800">← All markets</Link>
          <div className="mt-4 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
                <Image
                  src={market.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"}
                  alt={market.name} fill className="object-cover" priority
                />
              </div>
              <h1 className="serif-heading mt-6 text-5xl text-ink-900">{market.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-ink-600">
                <MapPin className="h-4 w-4" /> {market.address}, {market.city}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge bg-harvest-100 text-harvest-800"><Calendar className="h-3 w-3" /> {market.operatingDays.map((d) => DAYS_LABEL[d]).join(", ")}</span>
                <span className="badge bg-cream-200 text-cream-800"><Clock className="h-3 w-3" /> {market.startTime} – {market.endTime}</span>
                <span className="badge bg-terracotta-100 text-terracotta-700"><Users className="h-3 w-3" /> {market.farmers.length} farmers</span>
              </div>
              {market.description && <p className="mt-6 leading-relaxed text-ink-700">{market.description}</p>}
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
                  <div className="h-80">
                    <MarketMapClient lat={market.latitude} lng={market.longitude} name={market.name} address={market.address} />
                  </div>
                  <div className="p-4">
                    <a target="_blank" rel="noopener noreferrer"
                      href={`https://www.openstreetmap.org/directions?to=${market.latitude},${market.longitude}`}
                      className="block w-full rounded-full bg-harvest-800 py-2.5 text-center text-sm font-semibold text-cream-50 shadow-soft hover:bg-harvest-900">
                      Get directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="serif-heading text-3xl text-ink-900">Farmers at this market</h2>
          {market.farmers.length === 0 ? (
            <p className="mt-4 text-ink-500">No farmers registered here yet.</p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {market.farmers.map((link) => (
                <Link key={link.farmer.id} href={`/farmers/${link.farmer.id}`}
                  className="group block rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-harvest-100 serif-heading text-xl text-harvest-800">
                      {link.farmer.stallName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="serif-heading text-lg text-ink-900 group-hover:text-harvest-800">{link.farmer.stallName}</h3>
                      <p className="text-xs text-ink-500">Stall #{link.stallNumber || "—"} · {link.farmer._count.products} products</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
