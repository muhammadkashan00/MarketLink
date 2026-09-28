import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-cream-200 bg-cream-50/70">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-600">
              MarketLink brings your neighborhood farmers market to a single, seasonal-fresh platform.
              Meet the growers. Reserve the harvest. Skip the guesswork.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-full border border-cream-200 bg-white p-2.5 text-ink-600 transition-all hover:-translate-y-0.5 hover:border-harvest-300 hover:text-harvest-800 hover:shadow-soft"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Discover</h4>
            <ul className="space-y-2.5 text-sm text-ink-700">
              <li><Link href="/markets" className="hover:text-harvest-800">Markets</Link></li>
              <li><Link href="/products" className="hover:text-harvest-800">Products</Link></li>
              <li><Link href="/register?role=FARMER" className="hover:text-harvest-800">Become a farmer</Link></li>
              <li><Link href="/about" className="hover:text-harvest-800">Our story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Support</h4>
            <ul className="space-y-2.5 text-sm text-ink-700">
              <li><Link href="/contact" className="hover:text-harvest-800">Contact us</Link></li>
              <li><Link href="/about#faq" className="hover:text-harvest-800">FAQ</Link></li>
              <li><Link href="/about#privacy" className="hover:text-harvest-800">Privacy</Link></li>
              <li><Link href="/about#terms" className="hover:text-harvest-800">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream-200 pt-6 md:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} MarketLink. Built with love for local farmers.
          </p>
          <p className="text-xs text-ink-500">
            eGreen Basket · TechWiz 7 · End-to-End Web Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
