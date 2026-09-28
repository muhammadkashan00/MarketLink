"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function AnnouncementForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", body: "", audience: "ALL" });
  const [loading, setLoading] = useState(false);
  async function send() {
    if (!form.title || !form.body) return toast.error("Fill in title and body");
    setLoading(true);
    const r = await fetch("/api/admin/announcements", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (!r.ok) { toast.error(data.error); setLoading(false); return; }
    toast.success("Announcement sent");
    setForm({ title: "", body: "", audience: "ALL" });
    router.refresh();
    setLoading(false);
  }
  return (
    <Card className="p-6 space-y-4">
      <p className="serif-heading text-lg text-ink-900">New announcement</p>
      <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekly stock update" />
      <Textarea label="Body" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="This week we've onboarded three new farms…" />
      <div>
        <label className="label">Audience</label>
        <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="input">
          <option value="ALL">Everyone</option>
          <option value="CUSTOMERS">Customers only</option>
          <option value="FARMERS">Farmers only</option>
        </select>
      </div>
      <Button onClick={send} loading={loading} leftIcon={<Send className="h-4 w-4" />}>Broadcast</Button>
    </Card>
  );
}
