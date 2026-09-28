"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";

export function ProductsExplorer({ products, categories }: { products: any[]; categories: any[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<"newest" | "price-low" | "price-high" | "popular">("newest");
  const [priceMax, setPriceMax] = useState(2000);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.farmer.stallName.toLowerCase().includes(q.toLowerCase());
      const matchCat = !cat || p.categoryId === cat;
      const matchPrice = Number(p.price) <= priceMax;
      return matchQ && matchCat && matchPrice;
    });
    switch (sort) {
      case "price-low": list.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price-high": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "popular": list.sort((a, b) => b.totalSold - a.totalSold); break;
    }
    return list;
  }, [products, q, cat, sort, priceMax]);

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  <SlidersHorizontal className="h-3 w-3" /> Filters
                </p>
                <Input placeholder="Search…" leftIcon={<Search className="h-4 w-4" />} value={q} onChange={(e) => setQ(e.target.value)} />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Categories</p>
                <div className="space-y-1">
                  <button onClick={() => setCat(null)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${!cat ? "bg-harvest-100 font-semibold text-harvest-800" : "text-ink-700 hover:bg-cream-100"}`}>
                    <span>All categories</span>
                    <span className="text-xs text-ink-500">{products.length}</span>
                  </button>
                  {categories.map((c) => {
                    const count = products.filter((p) => p.categoryId === c.id).length;
                    return (
                      <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${cat === c.id ? "bg-harvest-100 font-semibold text-harvest-800" : "text-ink-700 hover:bg-cream-100"}`}>
                        <span>{c.icon} {c.name}</span>
                        <span className="text-xs text-ink-500">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Max price: {formatCurrency(priceMax)}
                </p>
                <input type="range" min={50} max={2000} step={50} value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-harvest-800" />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-cream-200 bg-white px-4 py-3 shadow-soft">
              <p className="text-sm text-ink-600">
                <span className="font-semibold text-ink-900">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-ink-500" />
                <select value={sort} onChange={(e) => setSort(e.target.value as any)}
                  className="rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm font-medium outline-none focus:border-harvest-500">
                  <option value="newest">Newest</option>
                  <option value="popular">Most popular</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="Nothing matches your filters" description="Try widening your search or clearing filters." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}>
                    <Link href={`/products/${p.id}`}
                      className="group block rounded-2xl border border-cream-200 bg-white p-3 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <Image
                          src={p.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80"}
                          alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {p.stock < 10 && p.stock > 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-terracotta-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream-50">
                            Only {p.stock} left
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-ink-500">{p.category.icon} {p.category.name}</p>
                        <h3 className="serif-heading mt-1 text-base text-ink-900 group-hover:text-harvest-800">{p.name}</h3>
                        <p className="mt-0.5 text-xs text-ink-500">by {p.farmer.stallName}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="serif-heading text-lg text-harvest-800">
                            {formatCurrency(Number(p.price))}
                            <span className="ml-1 text-xs text-ink-500">/ {p.unit}</span>
                          </p>
                          <span className="rounded-full bg-harvest-100 px-2 py-1 text-[10px] font-semibold text-harvest-800">
                            +Add
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
