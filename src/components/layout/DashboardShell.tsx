"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn, initials } from "@/lib/utils";
import {
  LogOut, Menu, X, Bell, Home, ShoppingBasket, PackageCheck, Heart, User, MessagesSquare,
  MapPin, Package, MessageSquare, Store, BarChart3, Sprout, Users, Tag, Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Home, ShoppingBasket, PackageCheck, Heart, User, MessagesSquare, MapPin, Package,
  MessageSquare, Store, BarChart3, Bell, Sprout, Users, Tag, Megaphone,
};

export type NavLinkConfig = { href: string; label: string; icon: string; badge?: number };

export function DashboardShell({
  user, navLinks, sectionTitle, children, notifications = 0,
}: {
  user: { name: string; email: string; role: string };
  navLinks: NavLinkConfig[];
  sectionTitle: string;
  children: React.ReactNode;
  notifications?: number;
}) {
  const path = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-cream-100">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-cream-200 bg-white transition-transform lg:translate-x-0 lg:static",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-cream-200 px-5">
          <Link href="/" onClick={() => setMobileOpen(false)}><Logo /></Link>
          <button onClick={() => setMobileOpen(false)} className="rounded-full p-1.5 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-ink-500">{sectionTitle}</p>
          <nav className="space-y-1">
            {navLinks.map((l) => {
              const active = path === l.href || (l.href !== "/" && path.startsWith(l.href + "/"));
              const Icon = ICON_MAP[l.icon] || Home;
              return (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-harvest-100 text-harvest-800" : "text-ink-700 hover:bg-cream-100"
                  )}>
                  {active && (
                    <motion.span layoutId="dash-active" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-harvest-800" />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{l.label}</span>
                  {l.badge ? (
                    <span className="rounded-full bg-terracotta-500 px-2 py-0.5 text-[10px] font-bold text-cream-50">{l.badge}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-harvest-800 text-sm font-semibold text-cream-50">
                {initials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                <p className="truncate text-xs text-ink-500">{user.email}</p>
              </div>
            </div>
            <button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-cream-200 bg-white py-2 text-xs font-semibold text-ink-700 hover:bg-terracotta-50 hover:text-terracotta-700 hover:border-terracotta-200">
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cream-200 bg-cream-50/85 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="rounded-full p-2 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <Link href={
              user.role === "CUSTOMER" ? "/customer/notifications"
              : user.role === "FARMER" ? "/farmer/notifications"
              : "/admin/notifications"
            }
              className="relative rounded-full p-2 text-ink-700 hover:bg-cream-200/60">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-terracotta-500" />
              )}
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden px-4 py-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
