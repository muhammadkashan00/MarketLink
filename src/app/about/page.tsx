import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { Heart, Sprout, Users, Award } from "lucide-react";

const team = [
  { name: "Muhammad Kashan", role: "Team Lead · Full-Stack", initials: "MK", color: "harvest" },
  { name: "Ayesha Ahmad", role: "Frontend & Design", initials: "AA", color: "terracotta" },
  { name: "Bilal Hussain", role: "Backend & DB", initials: "BH", color: "cream" },
  { name: "Zainab Riaz", role: "QA & Documentation", initials: "ZR", color: "harvest" },
];

const values = [
  { icon: Sprout, title: "Locally rooted", body: "We build for the farmers around the corner, not the mega-warehouses far away." },
  { icon: Heart, title: "Human first", body: "Every button, every screen — designed for someone with a basket in their hand." },
  { icon: Users, title: "Community-led", body: "Built alongside real farmers markets, real growers, real weekly shoppers." },
  { icon: Award, title: "Quality obsessed", body: "Fresh means fresh. We surface only what's harvested that week." },
];

export default async function AboutPage() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="hero-blob absolute -top-20 -right-20 h-96 w-96 rounded-full bg-harvest-300/30" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">Our story</span>
          <h1 className="serif-heading mt-4 text-5xl leading-tight text-ink-900 sm:text-6xl text-balance">
            We believe the market should <span className="italic text-harvest-800">meet you</span> where you are.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-600">
            MarketLink began as a weekend project when we kept hearing the same story: shoppers driving across town only to find their favorite stall was already out of tomatoes.
            Farmers, meanwhile, had no way to reach the customers who wanted their harvest most. We built the bridge.
          </p>
        </div>
      </section>

      <section className="py-16 bg-cream-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-harvest-100 text-harvest-800">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="serif-heading text-lg text-ink-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">The team</span>
            <h2 className="serif-heading mt-4 text-4xl text-ink-900">Made by four, for many</h2>
            <p className="mt-3 text-ink-600">A small team building for the biggest market of all — the local one.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <div key={t.name} className="rounded-2xl border border-cream-200 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className={`mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-${t.color}-100 text-2xl font-semibold text-${t.color}-800`}>
                  {t.initials}
                </div>
                <h3 className="serif-heading text-lg text-ink-900">{t.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-cream-50/50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="serif-heading text-center text-4xl text-ink-900">Common questions</h2>
          <div className="mt-10 space-y-4">
            {[
              { q: "Do I pay for orders online?", a: "No — MarketLink is pickup-only. You'll settle up in cash with the farmer when you collect your order at the stall. This keeps things simple and lets you meet the grower face-to-face." },
              { q: "What if I need to cancel or modify an order?", a: "You can cancel or edit any order right up until the farmer's cutoff time (usually the night before pickup). Just head to your orders and hit modify." },
              { q: "How do I know the produce is really local?", a: "Every farmer is verified by our admin team, and we display each stall's location and market presence transparently on their profile." },
              { q: "Can I favorite a farmer to reorder every week?", a: "Yes! Tap the heart on any farmer or product. Restock alerts and one-tap reorder are built right in." },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-cream-200 bg-white p-5 shadow-soft [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-ink-900">
                  {f.q}
                  <span className="ml-4 text-2xl font-light text-harvest-800 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
