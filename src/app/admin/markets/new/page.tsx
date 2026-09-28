import { MarketForm } from "@/components/admin/MarketForm";

export default function NewMarketPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Add market</h1>
      <p className="mt-1 text-ink-600">Onboard a new weekly farmers market.</p>
      <div className="mt-8"><MarketForm /></div>
    </div>
  );
}
