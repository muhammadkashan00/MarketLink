"use client";
import { motion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";

const reviews = [
  {
    name: "Ayesha K.",
    role: "Weekly customer",
    text: "I used to drive across town hoping the farmer would still have basil. Now I reserve on Friday and it's waiting for me. Life-changing.",
    color: "harvest",
  },
  {
    name: "Rahim's Family Farm",
    role: "Farmer, 3rd generation",
    text: "We used to lose half our leafy greens by 11am. MarketLink pre-orders mean we harvest to demand. Waste is way down.",
    color: "terracotta",
  },
  {
    name: "Priya M.",
    role: "New parent",
    text: "The app told me exactly which stalls had strollers-friendly aisles and where organic eggs were. That's the kind of detail I didn't know I needed.",
    color: "cream",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">
            Community voices
          </span>
          <h2 className="serif-heading mt-4 text-4xl leading-tight text-ink-900 sm:text-5xl">
            "It just works. Every Saturday."
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-cream-200 bg-white p-8 shadow-soft"
            >
              <svg className="absolute -top-3 left-6 h-10 w-10 text-cream-300" viewBox="0 0 40 40" fill="currentColor">
                <path d="M14 8c-4 0-7 3-7 7v10h10V15h-5c0-2 2-4 2-4V8zm16 0c-4 0-7 3-7 7v10h10V15h-5c0-2 2-4 2-4V8z" />
              </svg>
              <div className="mb-3"><StarRating value={5} readOnly size={14} /></div>
              <p className="serif-heading text-lg italic leading-relaxed text-ink-800">"{r.text}"</p>
              <footer className="mt-6 border-t border-cream-200 pt-4">
                <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                <p className="text-xs text-ink-500">{r.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
