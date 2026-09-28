"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, User, Phone, MapPin, Store, ArrowRight, ShoppingBasket, Sprout } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const initialRole = search.get("role") === "FARMER" ? "FARMER" : "CUSTOMER";
  const [role, setRole] = useState<"CUSTOMER" | "FARMER">(initialRole as any);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", address: "", stallName: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error || "Registration failed"); return; }
      if (data.pending) {
        toast.success("Registration submitted for admin approval");
        router.push("/login");
        return;
      }
      toast.success(`Welcome to MarketLink, ${data.user.name.split(" ")[0]}!`);
      router.push(role === "CUSTOMER" ? "/customer" : "/");
      router.refresh();
    } catch { setErr("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="w-full max-w-lg rounded-3xl border border-cream-200 bg-white/85 p-8 shadow-lift-lg backdrop-blur-md md:p-10">
      <Link href="/"><Logo className="mb-6 justify-center" /></Link>
      <h1 className="serif-heading text-center text-3xl text-ink-900">Join the harvest</h1>
      <p className="mt-2 text-center text-sm text-ink-600">Start reserving fresh produce or list your own stall</p>

      {/* Role toggle */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setRole("CUSTOMER")}
          className={cn("relative rounded-2xl border-2 p-4 text-left transition-all",
            role === "CUSTOMER" ? "border-harvest-800 bg-harvest-50 shadow-soft" : "border-cream-200 hover:border-cream-300")}>
          <ShoppingBasket className={cn("h-6 w-6", role === "CUSTOMER" ? "text-harvest-800" : "text-ink-500")} />
          <p className="mt-2 font-semibold text-ink-900">I'm a customer</p>
          <p className="text-xs text-ink-500">Reserve fresh produce</p>
        </button>
        <button type="button" onClick={() => setRole("FARMER")}
          className={cn("relative rounded-2xl border-2 p-4 text-left transition-all",
            role === "FARMER" ? "border-harvest-800 bg-harvest-50 shadow-soft" : "border-cream-200 hover:border-cream-300")}>
          <Sprout className={cn("h-6 w-6", role === "FARMER" ? "text-harvest-800" : "text-ink-500")} />
          <p className="mt-2 font-semibold text-ink-900">I'm a farmer</p>
          <p className="text-xs text-ink-500">List my stall</p>
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input label="Full name" name="name" required leftIcon={<User className="h-4 w-4" />}
          placeholder="Your full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" name="email" type="email" required leftIcon={<Mail className="h-4 w-4" />}
            placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" name="password" type="password" required minLength={6}
            leftIcon={<Lock className="h-4 w-4" />} placeholder="6+ characters" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Phone" name="phone" leftIcon={<Phone className="h-4 w-4" />}
            placeholder="+92 300 1234567" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Address" name="address" leftIcon={<MapPin className="h-4 w-4" />}
            placeholder="City, area" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        {role === "FARMER" && (
          <Input label="Stall / business name" name="stallName" required
            leftIcon={<Store className="h-4 w-4" />} placeholder="e.g. Green Valley Organics"
            value={form.stallName} onChange={(e) => setForm({ ...form, stallName: e.target.value })}
            hint="This is how customers will find you." />
        )}
        {err && <p className="rounded-xl bg-terracotta-100 px-3 py-2 text-xs text-terracotta-800">{err}</p>}
        {role === "FARMER" && (
          <div className="rounded-xl border border-cream-300 bg-cream-50 p-3 text-xs text-ink-600">
            Farmer accounts require admin approval before you can list products. You'll get a notification once approved.
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-harvest-800 hover:underline">Sign in</Link>
      </p>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noise px-6 py-12">
      <div className="hero-blob absolute -top-20 -left-20 h-96 w-96 rounded-full bg-harvest-300/30" />
      <div className="hero-blob absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cream-400/30" />
      <Suspense><RegisterForm /></Suspense>
    </div>
  );
}
