"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error || "Login failed"); return; }
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      const redirect = search.get("redirect");
      const dash = data.user.role === "CUSTOMER" ? "/customer" : data.user.role === "FARMER" ? "/farmer" : "/admin";
      router.push(redirect || dash);
      router.refresh();
    } catch { setErr("Network error. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="w-full max-w-md rounded-3xl border border-cream-200 bg-white/85 p-8 shadow-lift-lg backdrop-blur-md md:p-10">
      <Link href="/"><Logo className="mb-6 justify-center" /></Link>
      <h1 className="serif-heading text-center text-3xl text-ink-900">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-ink-600">Sign in to your MarketLink account</p>

      <form onSubmit={submit} className="mt-8 space-y-4" autoComplete="off">
        <Input label="Email" name="marketlink-email" type="email" required autoComplete="off"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" name="marketlink-password" type="password" required autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="••••••••" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {err && <p className="rounded-xl bg-terracotta-100 px-3 py-2 text-xs text-terracotta-800">{err}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        New to MarketLink?{" "}
        <Link href="/register" className="font-semibold text-harvest-800 hover:underline">Create an account</Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noise px-6 py-12">
      <div className="hero-blob absolute -top-20 -left-20 h-96 w-96 rounded-full bg-harvest-300/30" />
      <div className="hero-blob absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-terracotta-200/30" />
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
