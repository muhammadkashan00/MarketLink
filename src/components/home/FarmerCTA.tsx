"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const perks = [
  "List your stock in under 2 minutes",
  "Accept pre-orders, cut day-of waste",
  "Build a customer list that returns weekly",
  "Free forever · no listing fees",
];

export function FarmerCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-harvest-800 p-8 md:p-16">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="leaves" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M30 15 Q20 25 20 35 Q30 40 30 25 Z" fill="#FDF8F0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#leaves)" />
            </svg>
          </div>
          <div className="hero-blob absolute -top-20 -right-20 h-96 w-96 rounded-full bg-terracotta-500/30" />
          <div className="hero-blob absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-cream-400/30" />

          <div className="relative grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-cream-50/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cream-100">
                For farmers
              </span>
              <h2 className="serif-heading mt-4 text-4xl leading-tight text-cream-50 md:text-5xl">
                Your best customers are already looking for you.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream-100/90">
                Turn every Saturday into a sold-out morning. List once, sell all week.
              </p>

              <ul className="mt-6 space-y-2">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-cream-100">
                    <CheckCircle2 className="h-4 w-4 text-terracotta-300" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=FARMER">
                  <Button variant="accent" size="lg">Start listing free</Button>
                </Link>
                <Link href="/about" className="btn-ghost text-cream-100 hover:bg-cream-50/10">Learn more</Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border-4 border-cream-50/30 shadow-lift-lg">
                <Image
                  src="https://images.unsplash.com/photo-1595475207225-428b62bda831?w=900&q=80"
                  alt="Farmer at market"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-lift">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-harvest-100 p-2">
                    <svg className="h-6 w-6 text-harvest-800" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l3 9L9 3M15 3l3 9 3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="serif-heading text-lg text-ink-900">Rs. 48,200</p>
                    <p className="text-xs text-ink-500">Weekly avg. revenue</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
