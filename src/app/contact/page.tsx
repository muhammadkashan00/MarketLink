import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default async function ContactPage() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <section className="relative overflow-hidden pt-16 pb-12">
        <div className="hero-blob absolute -top-20 -right-20 h-96 w-96 rounded-full bg-harvest-300/30" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="rounded-full border border-cream-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wider text-harvest-700">Get in touch</span>
          <h1 className="serif-heading mt-4 text-5xl text-ink-900">Say hello, or ask us anything</h1>
          <p className="mt-4 text-lg text-ink-600">We read every message. Usually reply within 24 hours.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
              <h2 className="serif-heading text-2xl text-ink-900">Reach us directly</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="rounded-xl bg-harvest-100 p-2 text-harvest-800"><Mail className="h-4 w-4" /></div>
                  <div><p className="text-xs uppercase text-ink-500">Email</p><p className="text-sm text-ink-900">hello@marketlink.app</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-xl bg-harvest-100 p-2 text-harvest-800"><Phone className="h-4 w-4" /></div>
                  <div><p className="text-xs uppercase text-ink-500">Phone</p><p className="text-sm text-ink-900">+92 300 1234 567</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-xl bg-harvest-100 p-2 text-harvest-800"><MapPin className="h-4 w-4" /></div>
                  <div><p className="text-xs uppercase text-ink-500">Office</p><p className="text-sm text-ink-900">Aptech Learning Center, Karachi, Pakistan</p></div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="rounded-xl bg-harvest-100 p-2 text-harvest-800"><Clock className="h-4 w-4" /></div>
                  <div><p className="text-xs uppercase text-ink-500">Hours</p><p className="text-sm text-ink-900">Mon–Sat · 9:00 – 18:00 PKT</p></div>
                </li>
              </ul>
            </div>

            <div className="mt-6 h-72 overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
              <ContactMap />
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
