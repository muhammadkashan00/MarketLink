import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedMarkets } from "@/components/home/FeaturedMarkets";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FarmerCTA } from "@/components/home/FarmerCTA";
import { Testimonials } from "@/components/home/Testimonials";

export default async function Home() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="relative min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <main>
        <HeroSection />
        <HowItWorks />
        <FeaturedMarkets />
        <FeaturedProducts />
        <FarmerCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
