"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Reply, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function ReviewResponseClient({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim()) { toast.error("Response required"); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: text }),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error); return; }
      toast.success("Response posted");
      router.refresh();
    } finally { setLoading(false); }
  }

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-harvest-800 hover:underline">
        <Reply className="h-3 w-3" /> Reply publicly
      </button>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      <Textarea rows={2} placeholder="Thanks so much!" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShow(false)}>Cancel</Button>
        <Button size="sm" loading={loading} onClick={submit}>Post reply</Button>
      </div>
    </div>
  );
}
