"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ProfileFormClient({ user }: { user: { name: string; email: string; phone: string | null; address: string | null } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    address: user.address || "",
  });
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const r = await fetch("/api/users/me", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Update failed"); return; }
      toast.success("Profile updated");
      router.refresh();
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Input label="Full name" leftIcon={<User className="h-4 w-4" />} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" leftIcon={<Mail className="h-4 w-4" />} value={user.email} disabled hint="Contact support to change your email." />
        <Input label="Phone" leftIcon={<Phone className="h-4 w-4" />} value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Address" leftIcon={<MapPin className="h-4 w-4" />} value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <Button onClick={save} loading={loading} className="mt-6" leftIcon={<Save className="h-4 w-4" />}>Save changes</Button>
    </Card>
  );
}
