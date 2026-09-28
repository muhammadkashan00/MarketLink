"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-noise pt-8 pb-24 md:pt-16 md:pb-32">
      {/* Decorative blobs */}
      <div className="hero-blob absolute -top-20 -right-20 h-96 w-96 rounded-full bg-harvest-300/30" />
      <div className="hero-blob absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-terracotta-200/40" />
      <div className="hero-blob absolute -bottom-20 right-1/3 h-72 w-72 rounded-full bg-cream-400/30" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-harvest-800 shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
            eGreen Basket · Farmers-market for the modern kitchen
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="serif-heading mt-6 text-5xl leading-[1.05] tracking-tight text-ink-900 sm:text-6xl md:text-7xl text-balance"
          >
            The freshest{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic text-harvest-800">harvest</span>
              <svg viewBox="0 0 200 20" className="absolute -bottom-2 left-0 h-3 w-full text-cream-500">
                <path d="M0 15 Q50 3, 100 10 T200 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            , from{" "}
            <span className="italic text-terracotta-600">soil</span> to your table.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-600"
          >
            Browse tomorrow's stalls before you leave home. Reserve seasonal produce with your favorite growers.
            No lines, no sold-out surprises — just the farmers market, reimagined.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/markets">
              <Button variant="primary" size="lg" leftIcon={<MapPin className="h-4 w-4" />}>
                Find a market near me
              </Button>
            </Link>
            <Link href="/register?role=FARMER">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Sell your harvest
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex items-center gap-6 border-t border-cream-200 pt-6"
          >
            <div>
              <p className="serif-heading text-3xl text-harvest-800">120+</p>
              <p className="text-xs uppercase tracking-wider text-ink-500">Local farmers</p>
            </div>
            <div className="h-10 w-px bg-cream-300" />
            <div>
              <p className="serif-heading text-3xl text-harvest-800">36</p>
              <p className="text-xs uppercase tracking-wider text-ink-500">Weekly markets</p>
            </div>
            <div className="h-10 w-px bg-cream-300" />
            <div>
              <p className="serif-heading text-3xl text-harvest-800">4.9<span className="text-base">/5</span></p>
              <p className="text-xs uppercase tracking-wider text-ink-500">Customer rating</p>
            </div>
          </motion.div>
        </div>

        {/* Hero visual - hand-crafted illustration + real produce photo */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main photo card */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-cream-50 shadow-lift-lg">
              <Image
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80"
                alt="Fresh produce at a farmers market"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur">
                <p className="serif-heading text-lg text-ink-900">Green Valley Market</p>
                <p className="text-xs text-ink-600">Every Saturday · 22 farmers</p>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-16 hidden rounded-2xl border border-cream-200 bg-white p-4 shadow-lift md:block"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🍅</div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">Heirloom tomatoes</p>
                  <p className="text-xs text-ink-500">Rs. 320 / kg · reserved</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-20 hidden rounded-2xl border border-cream-200 bg-white p-4 shadow-lift md:block"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🥬</div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">Fresh spinach</p>
                  <p className="text-xs text-ink-500">Rs. 120 / bunch · 8 left</p>
                </div>
              </div>
            </motion.div>

            {/* Rotating badge */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-6 -right-6 hidden md:block"
            >
              <svg viewBox="0 0 100 100" className="h-24 w-24">
                <defs>
                  <path id="circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                </defs>
                <circle cx="50" cy="50" r="46" fill="#2D5F3F" />
                <text fontSize="10" fill="#FDF8F0" fontWeight="600" letterSpacing="2">
                  <textPath href="#circle">FARM FRESH · SEASONAL · LOCAL · </textPath>
                </text>
                <text x="50" y="55" textAnchor="middle" fontSize="20" fill="#FDF8F0">🌿</text>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
