import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarketLink — Fresh from Farmer to Table",
  description:
    "Discover local farmers markets near you. Reserve fresh produce, meet the growers, and skip the guesswork on market day.",
  keywords: ["farmers market", "local produce", "farm to table", "MarketLink", "eGreen Basket"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-cream-100 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2D5F3F",
              color: "#FDF8F0",
              borderRadius: "12px",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 10px 30px rgba(45,95,63,0.25)",
            },
          }}
        />
      </body>
    </html>
  );
}
