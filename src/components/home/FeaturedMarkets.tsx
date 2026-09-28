import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";

export async function FeaturedMarkets() {
  let markets: Array<{ id: string; name: string; city: string; imageUrl: string | null; operatingDays: string[]; startTime: string; endTime: string }> = [];
  try {
    markets = await prisma.market.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not ready yet
  }

  const placeholders = [
    { id: "p1", name: "Green Valley Farmers Market", city: "Karachi Clifton", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80", operatingDays: ["SAT", "SUN"], startTime: "07:00", endTime: "13:00" },
    { id: "p2", name: "Harbour Front Market", city: "Karachi DHA", imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80", operatingDays: ["WED", "SAT"], startTime: "08:00", endTime: "14:00" },
    { id: "p3", name: "Old Town Grower's Square", city: "Lahore Gulberg", imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900&q=80", operatingDays: ["FRI", "SUN"], startTime: "06:30", endTime: "12:30" },
  ];

  const items = markets.length ? markets : placeholders;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">
              This week
            </span>
            <h2 className="serif-heading mt-4 text-4xl leading-tight text-ink-900">
              Markets happening near you
            </h2>
          </div>
          <Link href="/markets" className="hidden items-center gap-1 text-sm font-semibold text-harvest-800 hover:gap-2 hover:transition-all sm:inline-flex">
            View all markets <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((m) => (
            <Link key={m.id} href={`/markets/${m.id}`} className="group block">
              <div className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={m.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80"}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-xs text-cream-100">
                      <Clock className="h-3.5 w-3.5" /> {m.operatingDays.join(" · ")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="serif-heading text-xl text-ink-900 group-hover:text-harvest-800">{m.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                    <MapPin className="h-3.5 w-3.5" /> {m.city}
                  </p>
                </div>
                <span className="text-xs text-ink-500">{m.startTime}–{m.endTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
