import { Chatbot } from "@/components/customer/Chatbot";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Help & chat</h1>
      <p className="mt-1 text-ink-600">Ask MarketLink Assist for quick answers on pickup, cancellations, and more.</p>
      <div className="mt-6">
        <Chatbot />
      </div>
    </div>
  );
}
