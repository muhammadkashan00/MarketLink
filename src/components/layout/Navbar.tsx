"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, User, ShoppingBasket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/products", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ user }: { user?: { name: string; role: string } | null }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashLink =
    user?.role === "CUSTOMER" ? "/customer" :
    user?.role === "FARMER" ? "/farmer" :
    user?.role === "ADMIN" ? "/admin" : "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "bg-cream-50/85 backdrop-blur-lg border-b border-cream-200 shadow-soft" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="transition-transform hover:scale-[1.02]">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-harvest-800" : "text-ink-600 hover:text-harvest-800"
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute inset-0 -z-10 rounded-full bg-harvest-100/70"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link href={dashLink}>
              <Button variant="primary" size="sm" leftIcon={<User className="h-4 w-4" />}>
                {user.name.split(" ")[0]}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link href="/register">
                <Button variant="primary" size="sm" leftIcon={<ShoppingBasket className="h-4 w-4" />}>
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-full p-2 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-cream-200 bg-cream-50/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-cream-200/60"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-cream-200 pt-3">
                {user ? (
                  <Link href={dashLink}>
                    <Button variant="primary" size="sm" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost w-full justify-center">Sign in</Link>
                    <Link href="/register"><Button variant="primary" size="sm" className="w-full">Get started</Button></Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
