"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UserStatusActions({ userId, status, customer }: { userId: string; status: string; customer?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success("Status updated");
      router.refresh();
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PENDING" && (
        <Button size="sm" onClick={() => updateStatus("ACTIVE")} loading={loading} leftIcon={<CheckCircle2 className="h-3 w-3" />}>Approve</Button>
      )}
      {status === "ACTIVE" && (
        <Button size="sm" variant="danger" onClick={() => updateStatus("SUSPENDED")} loading={loading} leftIcon={<XCircle className="h-3 w-3" />}>
          {customer ? "Deactivate" : "Suspend"}
        </Button>
      )}
      {status === "SUSPENDED" && (
        <Button size="sm" variant="secondary" onClick={() => updateStatus("ACTIVE")} loading={loading} leftIcon={<RotateCcw className="h-3 w-3" />}>Reactivate</Button>
      )}
      {status === "PENDING" && (
        <Button size="sm" variant="danger" onClick={() => updateStatus("SUSPENDED")} loading={loading}>Reject</Button>
      )}
    </div>
  );
}
