"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DeleteReviewClient({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function del() {
    if (!confirm("Delete this review?")) return;
    setLoading(true);
    const r = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    if (r.ok) { toast.success("Removed"); router.refresh(); }
    else toast.error("Failed");
    setLoading(false);
  }
  return <Button size="sm" variant="danger" onClick={del} loading={loading} leftIcon={<Trash2 className="h-3 w-3" />}>Remove</Button>;
}
