"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";

export function OrderActionsClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function cancel() {
    if (!reason.trim()) { toast.error("Please tell us why"); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Cancel failed"); return; }
      toast.success("Order cancelled");
      router.refresh();
      setShowConfirm(false);
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-terracotta-100 p-2 text-terracotta-700"><AlertTriangle className="h-4 w-4" /></div>
        <div className="flex-1">
          <p className="serif-heading text-lg text-ink-900">Need to cancel?</p>
          <p className="text-xs text-ink-500">Cancel before the farmer's cutoff. Once accepted, you have less time.</p>
        </div>
        {!showConfirm && (
          <Button variant="secondary" size="sm" onClick={() => setShowConfirm(true)}>Cancel order</Button>
        )}
      </div>
      {showConfirm && (
        <div className="mt-4 space-y-3">
          <Textarea rows={3} placeholder="Tell us why (helps our farmers)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>Keep order</Button>
            <Button variant="danger" size="sm" loading={loading} onClick={cancel}>Confirm cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
