import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="flex min-h-[60vh] items-center justify-center px-6 py-24">
        <div className="text-center">
          <p className="text-8xl serif-heading text-harvest-800">404</p>
          <h1 className="serif-heading mt-4 text-3xl text-ink-900">This basket is empty</h1>
          <p className="mt-2 text-ink-600">The page you're looking for isn't here.</p>
          <Link href="/" className="mt-6 inline-block btn-primary">Back to home</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
