"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Package, XCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function OrderStatusActions({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState("");

  async function advance() {
    setLoading(true);
    try {
      const r = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance" }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success("Order updated");
      router.refresh();
    } finally { setLoading(false); }
  }

  async function decline() {
    if (!reason.trim()) { toast.error("Please tell customer why"); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success("Order declined");
      router.refresh();
    } finally { setLoading(false); }
  }

  if (["CANCELLED", "DECLINED", "COMPLETED"].includes(status)) return null;

  const nextLabels: Record<string, { label: string; icon: any; variant: any }> = {
    PLACED: { label: "Accept order", icon: CheckCircle2, variant: "primary" },
    ACCEPTED: { label: "Mark ready for pickup", icon: Package, variant: "accent" },
    READY: { label: "Mark completed", icon: CheckCircle2, variant: "primary" },
  };
  const next = nextLabels[status];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-3">
        {next && (
          <Button onClick={advance} loading={loading} variant={next.variant} leftIcon={<next.icon className="h-4 w-4" />}>
            {next.label}
          </Button>
        )}
        {status === "PLACED" && !showDecline && (
          <Button onClick={() => setShowDecline(true)} variant="secondary" leftIcon={<XCircle className="h-4 w-4" />}>
            Decline
          </Button>
        )}
      </div>
      {showDecline && (
        <div className="mt-4 space-y-3">
          <Textarea rows={2} placeholder="Reason for decline (customer will see this)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDecline(false)}>Never mind</Button>
            <Button variant="danger" size="sm" loading={loading} onClick={decline}>Confirm decline</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
