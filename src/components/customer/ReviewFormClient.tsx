"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Textarea } from "@/components/ui/Input";

export function ReviewFormClient({
  orderId, farmer, products,
}: {
  orderId: string;
  farmer: { id: string; name: string };
  products: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<{ type: "FARMER" | "PRODUCT"; id: string; name: string }>({ type: "FARMER", id: farmer.id, name: farmer.name });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (comment.trim().length < 5) { toast.error("Comment must be at least 5 characters"); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: target.type, targetId: target.id, rating, comment }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Review failed"); return; }
      toast.success("Review posted!");
      setComment("");
      router.refresh();
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-terracotta-500" />
        <h2 className="serif-heading text-xl text-ink-900">Leave a review</h2>
      </div>
      <p className="mt-1 text-xs text-ink-500">Help other customers pick the freshest picks.</p>

      <div className="mt-4">
        <p className="label">Reviewing</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTarget({ type: "FARMER", id: farmer.id, name: farmer.name })}
            className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold ${target.type === "FARMER" ? "border-harvest-800 bg-harvest-100 text-harvest-800" : "border-cream-200 text-ink-600"}`}>
            🌾 {farmer.name}
          </button>
          {products.map((p) => (
            <button key={p.id} onClick={() => setTarget({ type: "PRODUCT", id: p.id, name: p.name })}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold ${target.id === p.id ? "border-harvest-800 bg-harvest-100 text-harvest-800" : "border-cream-200 text-ink-600"}`}>
              🍅 {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="label">Rating</p>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="mt-4">
        <Textarea label="Your review" rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Loved the strawberries — perfectly ripe, delivered right on time…" />
      </div>

      <Button onClick={submit} loading={loading} className="mt-4" leftIcon={<Star className="h-4 w-4" />}>
        Post review
      </Button>
    </Card>
  );
}
