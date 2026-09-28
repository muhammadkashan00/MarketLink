import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusActions } from "@/components/farmer/OrderStatusActions";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ChevronLeft, User, Phone, Mail, Calendar, Clock, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return null;
  const order = await prisma.order.findFirst({
    where: { id, farmerId: profile.id },
    include: {
      customer: { select: { name: true, email: true, phone: true, address: true } },
      market: true,
      items: { include: { product: true } },
    },
  }).catch(() => null);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/farmer/orders" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-harvest-800">
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="serif-heading text-4xl text-ink-900">#{order.orderNumber.slice(-6).toUpperCase()}</h1>
          <span className={`badge ${statusBadge(order.status)}`}>{order.status}</span>
        </div>
        <p className="mt-1 text-ink-600">Placed {formatDateTime(order.createdAt)}</p>
      </div>

      <OrderStatusActions orderId={order.id} status={order.status} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="serif-heading text-xl text-ink-900">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 border-b border-cream-100 pb-3 last:border-0">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={i.product.imageUrl || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&q=80"} alt={i.productName} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{i.productName}</p>
                  <p className="text-xs text-ink-500">{i.quantity} × {formatCurrency(Number(i.priceAtPurchase))}</p>
                </div>
                <p className="serif-heading text-lg text-harvest-800">{formatCurrency(Number(i.subtotal))}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t-2 border-cream-200 pt-4">
            <p className="text-xs uppercase tracking-wider text-ink-500">Total (pay at pickup)</p>
            <p className="serif-heading text-2xl text-harvest-800">{formatCurrency(Number(order.totalAmount))}</p>
          </div>
          {order.notes && (
            <div className="mt-4 rounded-xl bg-cream-50 p-3">
              <p className="text-xs font-semibold uppercase text-ink-500 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Customer notes</p>
              <p className="mt-1 italic text-ink-700">"{order.notes}"</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="serif-heading text-xl text-ink-900 flex items-center gap-2"><User className="h-5 w-5 text-harvest-700" /> Customer</h2>
          <p className="mt-3 font-semibold text-ink-900">{order.customer.name}</p>
          <div className="mt-2 space-y-1 text-sm text-ink-700">
            <p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {order.customer.email}</p>
            {order.customer.phone && <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {order.customer.phone}</p>}
          </div>
          <div className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
            <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-harvest-700" /> {formatDate(order.pickupDate)}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-harvest-700" /> {order.pickupSlot}</p>
            {order.market && <p className="text-xs text-ink-500">@ {order.market.name}</p>}
          </div>
        </Card>
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
