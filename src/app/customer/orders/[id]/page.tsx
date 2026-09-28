import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderActionsClient } from "@/components/customer/OrderActionsClient";
import { ReviewFormClient } from "@/components/customer/ReviewFormClient";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, formatDateTime, timeAgo } from "@/lib/utils";
import { PackageCheck, CheckCircle2, Store, Calendar, Clock, ShoppingBasket, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const STEPS = [
  { key: "PLACED", label: "Placed" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Picked up" },
];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findFirst({
    where: { id, customerId: user.id },
    include: {
      farmer: { include: { user: { select: { name: true, phone: true } } } },
      market: true,
      items: { include: { product: true } },
    },
  }).catch(() => null);

  if (!order) notFound();

  const currentStepIdx = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "DECLINED";
  const canCancel = order.status === "PLACED" || order.status === "ACCEPTED";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/customer/orders" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-harvest-800">
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="serif-heading text-4xl text-ink-900">Order #{order.orderNumber.slice(-6).toUpperCase()}</h1>
          <span className={`badge ${statusBadge(order.status)}`}>{order.status}</span>
        </div>
        <p className="mt-1 text-ink-600">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <Card className="p-6">
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-cream-200" />
            <div className="absolute top-4 left-4 h-0.5 bg-harvest-800 transition-all"
              style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }} />
            <div className="relative flex justify-between">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${i <= currentStepIdx ? "border-harvest-800 bg-harvest-800 text-cream-50" : "border-cream-300 bg-white text-ink-400"}`}>
                    {i < currentStepIdx ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${i <= currentStepIdx ? "text-harvest-800" : "text-ink-500"}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><ShoppingBasket className="h-5 w-5 text-harvest-700" /> Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.product.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&q=80"} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink-900">{item.productName}</p>
                    <p className="text-xs text-ink-500">{item.quantity} × {formatCurrency(Number(item.priceAtPurchase))}</p>
                  </div>
                  <p className="serif-heading text-lg text-harvest-800">{formatCurrency(Number(item.subtotal))}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-cream-200 pt-4 text-right">
              <p className="text-xs uppercase tracking-wider text-ink-500">Total (pay at pickup)</p>
              <p className="serif-heading text-3xl text-harvest-800">{formatCurrency(Number(order.totalAmount))}</p>
            </div>
          </Card>

          {order.notes && (
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-ink-500">Notes for farmer</p>
              <p className="mt-2 italic text-ink-700">"{order.notes}"</p>
            </Card>
          )}

          {order.status === "COMPLETED" && (
            <ReviewFormClient
              orderId={order.id}
              farmer={{ id: order.farmerId, name: order.farmer.stallName }}
              products={order.items.map((i) => ({ id: i.productId, name: i.productName }))}
            />
          )}

          {canCancel && <OrderActionsClient orderId={order.id} />}
        </div>

        <div>
          <Card className="p-6">
            <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><Store className="h-5 w-5 text-harvest-700" /> Farmer</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest-100 serif-heading text-lg text-harvest-800">
                {order.farmer.stallName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="serif-heading text-lg text-ink-900">{order.farmer.stallName}</p>
                <p className="text-xs text-ink-500">{order.farmer.user.name}</p>
              </div>
            </div>
            {order.farmer.user.phone && (
              <p className="mt-4 text-xs"><span className="text-ink-500">Phone: </span><span className="font-mono text-ink-900">{order.farmer.user.phone}</span></p>
            )}
            <div className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-harvest-700" /> {formatDate(order.pickupDate)}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-harvest-700" /> {order.pickupSlot}</p>
              {order.market && <p className="flex items-center gap-2 text-xs text-ink-500">@ {order.market.name}</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function statusBadge(status: string) {
  switch (status) {
    case "PLACED": return "bg-cream-200 text-cream-800";
    case "ACCEPTED": return "bg-harvest-100 text-harvest-800";
    case "READY": return "bg-terracotta-100 text-terracotta-700";
    case "COMPLETED": return "bg-ink-100 text-ink-700";
    case "CANCELLED": case "DECLINED": return "bg-terracotta-100 text-terracotta-800";
    default: return "bg-cream-100 text-ink-700";
  }
}
