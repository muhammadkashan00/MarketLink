"use client";
import { motion } from "framer-motion";
import { Search, ShoppingBasket, MapPin, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & discover",
    body: "See which farmers are at which market, what they're bringing, and when — all before you leave home.",
    color: "harvest",
  },
  {
    icon: ShoppingBasket,
    title: "Reserve fresh stock",
    body: "Add produce to your basket and lock in this week's harvest. Pay in cash on pickup, no fees.",
    color: "cream",
  },
  {
    icon: MapPin,
    title: "Pickup at the stall",
    body: "Show your order code, grab your box, chat with the farmer. Directions built right in.",
    color: "terracotta",
  },
  {
    icon: ThumbsUp,
    title: "Rate & re-order",
    body: "Loved your carrots? Favorite the farmer and one-tap reorder next week. Simple.",
    color: "harvest",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">
            Four simple steps
          </span>
          <h2 className="serif-heading mt-4 text-4xl leading-tight text-ink-900 sm:text-5xl">
            The way markets should work
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            No chalkboards, no missed stock, no wasted trips. Everything is a tap away.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-cream-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-harvest-100 text-harvest-800 transition-colors group-hover:bg-harvest-800 group-hover:text-cream-50">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="serif-heading text-xl text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.body}</p>
              <span className="absolute right-5 top-5 serif-heading text-4xl italic text-cream-300 opacity-40 transition-opacity group-hover:opacity-100">
                {i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
