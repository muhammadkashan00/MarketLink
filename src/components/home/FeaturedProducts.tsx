import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export async function FeaturedProducts() {
  let products: Array<{ id: string; name: string; price: any; unit: string; imageUrl: string | null; farmer: { stallName: string } }> = [];
  try {
    products = await prisma.product.findMany({
      take: 6,
      where: { isAvailable: true, isSoldOut: false },
      include: { farmer: { select: { stallName: true } } },
      orderBy: { totalSold: "desc" },
    });
  } catch {}

  const placeholders = [
    { id: "p1", name: "Heirloom tomatoes", price: 320, unit: "kg", imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80", farmer: { stallName: "Roshan Family Farm" } },
    { id: "p2", name: "Fresh basil bunch", price: 90, unit: "bunch", imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80", farmer: { stallName: "Kitchen Garden Co." } },
    { id: "p3", name: "Farm butter (500g)", price: 720, unit: "pack", imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80", farmer: { stallName: "Meadow Dairy" } },
    { id: "p4", name: "Sourdough loaf", price: 480, unit: "loaf", imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80", farmer: { stallName: "Copper Oven Bakery" } },
    { id: "p5", name: "Cage-free eggs", price: 380, unit: "dozen", imageUrl: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9efd?w=600&q=80", farmer: { stallName: "Sunrise Poultry" } },
    { id: "p6", name: "Baby carrots", price: 180, unit: "kg", imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80", farmer: { stallName: "Root & Row" } },
  ];

  const items = products.length ? products : placeholders;

  return (
    <section className="py-24 bg-cream-50/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta-700">
            <Sparkles className="h-3 w-3" /> This season's picks
          </span>
          <h2 className="serif-heading mt-4 text-4xl leading-tight text-ink-900">
            Handpicked from this week's harvest
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group block rounded-2xl bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[5/4] overflow-hidden rounded-xl">
                <Image
                  src={p.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80"}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="serif-heading text-lg text-ink-900">{p.name}</h3>
                  <p className="text-xs text-ink-500">by {p.farmer.stallName}</p>
                </div>
                <div className="text-right">
                  <p className="serif-heading text-lg text-harvest-800">{formatCurrency(Number(p.price))}</p>
                  <p className="text-xs text-ink-500">/ {p.unit}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
