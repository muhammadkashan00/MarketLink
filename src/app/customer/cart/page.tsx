"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBasket, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items, count, total, farmerName, update, remove, clear } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="serif-heading text-4xl text-ink-900">Your basket</h1>
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingBasket className="h-8 w-8" />}
            title="Your basket is empty"
            description="Add fresh picks from any of our local farmers."
            action={<Link href="/products"><Button variant="primary">Browse products</Button></Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="serif-heading text-4xl text-ink-900">Your basket</h1>
          {farmerName && <p className="mt-1 text-sm text-ink-500">Reserving from <span className="font-semibold text-harvest-800">{farmerName}</span></p>}
        </div>
        <button onClick={clear} className="text-xs text-ink-500 hover:text-terracotta-600">Clear basket</button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item.productId}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                layout>
                <Card className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=300&q=80"}
                        alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="serif-heading text-lg text-ink-900">{item.name}</h3>
                          <p className="text-xs text-ink-500">{formatCurrency(item.price)} / {item.unit}</p>
                        </div>
                        <button onClick={() => remove(item.productId)}
                          className="rounded-full p-2 text-ink-400 hover:bg-terracotta-100 hover:text-terracotta-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-cream-200 bg-cream-50 p-1">
                          <button onClick={() => update(item.productId, item.quantity - 1)}
                            className="rounded-full p-1.5 text-ink-700 hover:bg-white disabled:opacity-40" disabled={item.quantity <= 1}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[2ch] text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => update(item.productId, item.quantity + 1)}
                            className="rounded-full p-1.5 text-ink-700 hover:bg-white disabled:opacity-40" disabled={item.quantity >= item.stock}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="serif-heading text-lg text-harvest-800">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="serif-heading text-xl text-ink-900">Order summary</h2>
            <div className="mt-4 space-y-2 border-b border-cream-200 pb-4 text-sm">
              <div className="flex justify-between"><span className="text-ink-600">Items ({count})</span><span className="font-semibold">{formatCurrency(total)}</span></div>
              <div className="flex justify-between"><span className="text-ink-600">Pickup fee</span><span className="text-harvest-800">Free</span></div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs uppercase tracking-wider text-ink-500">Total (pay at pickup)</p>
              <p className="serif-heading text-2xl text-harvest-800">{formatCurrency(total)}</p>
            </div>
            <Link href="/customer/checkout" className="mt-6 block">
              <Button className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Continue to checkout
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-ink-500">Pay in cash at pickup · no online payment</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
