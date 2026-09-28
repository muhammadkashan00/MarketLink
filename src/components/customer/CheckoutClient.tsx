"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, Package, ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";

const SLOTS = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00"];

export function CheckoutClient() {
  const router = useRouter();
  const { items, count, total, farmerId, farmerName, clear } = useCart();
  const [pickupDate, setPickupDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableMarkets, setAvailableMarkets] = useState<Array<{ id: string; name: string }>>([]);
  const [marketId, setMarketId] = useState<string | null>(null);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!farmerId) return;
    fetch(`/api/farmers/${farmerId}/markets`).then((r) => r.json()).then((d) => {
      setAvailableMarkets(d.markets || []);
      if (d.markets?.[0]) setMarketId(d.markets[0].id);
    }).catch(() => {});
  }, [farmerId]);

  async function submit() {
    if (!pickupDate || !pickupSlot) { toast.error("Pick a date and time slot"); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId, marketId,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          pickupDate, pickupSlot, notes,
        }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Order failed"); return; }
      setSuccess(data.orderId);
      clear();
      toast.success("Order placed! Check your orders for updates.");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-cream-200 bg-white p-10 text-center shadow-lift">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-harvest-100">
          <CheckCircle2 className="h-10 w-10 text-harvest-800" />
        </motion.div>
        <h2 className="serif-heading text-4xl text-ink-900">Order placed 🌱</h2>
        <p className="mt-3 text-ink-600">Your farmer will confirm shortly. Look out for updates in your notifications.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/customer/orders/${success}`}><Button variant="primary">View order</Button></Link>
          <Link href="/products"><Button variant="secondary">Keep browsing</Button></Link>
        </div>
      </motion.div>
    );
  }

  if (count === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-ink-500">Your basket is empty. <Link href="/products" className="font-semibold text-harvest-800 hover:underline">Browse products →</Link></p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-5 lg:col-span-3">
        <Card className="p-6">
          <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><Calendar className="h-5 w-5 text-harvest-700" /> Pickup date</h2>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="input mt-4" />
          <p className="mt-2 text-xs text-ink-500">Selected: {pickupDate && formatDate(pickupDate)}</p>
        </Card>

        <Card className="p-6">
          <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><Clock className="h-5 w-5 text-harvest-700" /> Pickup slot</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {SLOTS.map((slot) => (
              <button key={slot} onClick={() => setPickupSlot(slot)}
                className={`rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-all ${pickupSlot === slot ? "border-harvest-800 bg-harvest-100 text-harvest-800" : "border-cream-200 bg-white text-ink-600 hover:border-cream-300"}`}>
                {slot}
              </button>
            ))}
          </div>
        </Card>

        {availableMarkets.length > 1 && (
          <Card className="p-6">
            <h2 className="serif-heading text-xl text-ink-900">Pickup market</h2>
            <div className="mt-4 space-y-2">
              {availableMarkets.map((m) => (
                <button key={m.id} onClick={() => setMarketId(m.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${marketId === m.id ? "border-harvest-800 bg-harvest-50" : "border-cream-200 hover:border-cream-300"}`}>
                  <p className="font-semibold text-ink-900">{m.name}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-harvest-700" /> Notes for farmer (optional)</h2>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
            className="mt-4" placeholder="e.g., extra-ripe tomatoes please, I'll pick up around 10:30" />
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-24 p-6">
          <h2 className="serif-heading text-xl text-ink-900">Order summary</h2>
          <p className="mt-1 text-xs text-ink-500">From <span className="font-semibold text-harvest-800">{farmerName}</span></p>
          <div className="mt-4 space-y-3 border-b border-cream-200 pb-4">
            {items.map((i) => (
              <div key={i.productId} className="flex gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={i.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&q=80"} alt={i.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 justify-between text-sm">
                  <div>
                    <p className="font-semibold text-ink-900">{i.name}</p>
                    <p className="text-xs text-ink-500">{i.quantity} × {formatCurrency(i.price)}</p>
                  </div>
                  <p className="font-semibold text-ink-900">{formatCurrency(i.price * i.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-xs uppercase tracking-wider text-ink-500">Pay at pickup</p>
            <p className="serif-heading text-2xl text-harvest-800">{formatCurrency(total)}</p>
          </div>
          <Button onClick={submit} loading={loading} className="mt-6 w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Place pre-order
          </Button>
          <p className="mt-3 text-center text-xs text-ink-500">Cancellable until farmer's cutoff time</p>
        </Card>
      </div>
    </div>
  );
}
