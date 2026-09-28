"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Rule-based FAQ assistant — NOT AI. Handcrafted responses.
const FAQ: Array<{ patterns: RegExp[]; answer: string; suggestions?: string[] }> = [
  {
    patterns: [/pickup/i, /collect/i, /pick up/i],
    answer: "Pickups happen at the farmer's stall during the farmer's operating window. Once your order is ACCEPTED, you'll see the exact market and slot on your order page.",
    suggestions: ["What if I miss my slot?", "How to cancel an order?"],
  },
  {
    patterns: [/pay|payment|price|cost|how much/i],
    answer: "You pay in cash directly to the farmer when you collect your order. MarketLink doesn't charge any online fees — the price you see is the price you pay.",
    suggestions: ["Can I refund?", "What if item is unavailable?"],
  },
  {
    patterns: [/cancel|refund|change/i],
    answer: "You can cancel any order until the farmer's cutoff (usually the night before pickup). Go to My Orders → open your order → Cancel. If the farmer already accepted, cancel windows may be shorter.",
    suggestions: ["When is farmer's cutoff?", "How to modify quantity?"],
  },
  {
    patterns: [/miss|late|forgot/i],
    answer: "If you can't make your pickup, please cancel first so the farmer can offer the stock to someone else. Missed pickups without cancellation may affect your account.",
    suggestions: ["Reschedule pickup?"],
  },
  {
    patterns: [/market.*time|when.*open|hours/i],
    answer: "Each market has its own days and hours — you'll see them on the market's page and in your order. Most run Saturdays 7am–1pm.",
    suggestions: ["Find markets near me"],
  },
  {
    patterns: [/farmer|seller|vendor/i],
    answer: "Every farmer is verified by our admin team. Their profile shows stall name, markets they attend, operating days, and past reviews.",
    suggestions: ["How are farmers approved?"],
  },
  {
    patterns: [/favorite|favourite|save/i],
    answer: "Tap the heart icon on any farmer or product. You'll find them under Favorites for quick reorders.",
  },
  {
    patterns: [/review|rate|rating/i],
    answer: "You can leave reviews once your order is marked COMPLETED. Head to the order page and post a rating for the farmer or specific products.",
  },
  {
    patterns: [/organic|pesticide|certif/i],
    answer: "MarketLink doesn't verify organic certification. Each farmer describes their growing practices in their profile — check there or ask them at the stall.",
  },
];

const DEFAULT_ANSWER = "I couldn't match that exactly. Try asking about pickup, payments, cancellations, or how to find farmers. Or you can email hello@marketlink.app for anything else.";

const STARTER_SUGGESTIONS = [
  "How do I pick up my order?",
  "How do I pay?",
  "Can I cancel an order?",
  "How do I find markets near me?",
];

type Msg = { role: "bot" | "user"; text: string; suggestions?: string[] };

export function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm MarketLink Assist 🌿 — here to answer quick questions about orders, pickups, and farmers. What can I help with?",
      suggestions: STARTER_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function respond(query: string) {
    const match = FAQ.find((f) => f.patterns.some((p) => p.test(query)));
    return match
      ? { text: match.answer, suggestions: match.suggestions }
      : { text: DEFAULT_ANSWER, suggestions: STARTER_SUGGESTIONS };
  }

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const r = respond(q);
      setMessages((m) => [...m, { role: "bot", text: r.text, suggestions: r.suggestions }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  return (
    <Card className="flex h-[600px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-cream-200 bg-harvest-800 p-4 text-cream-50">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="serif-heading text-lg">MarketLink Assist</p>
          <p className="text-xs opacity-80">FAQ helper · always here</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "bot" && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-harvest-100 text-harvest-800"><Bot className="h-4 w-4" /></div>}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "bot" ? "bg-cream-100 text-ink-800" : "bg-harvest-800 text-cream-50"}`}>
              {m.text}
              {m.suggestions && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-harvest-800 shadow-soft hover:bg-white">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-cream-50"><User className="h-4 w-4" /></div>}
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-harvest-100 text-harvest-800"><Bot className="h-4 w-4" /></div>
              <div className="rounded-2xl bg-cream-100 px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-harvest-700 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-harvest-700 [animation-delay:200ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-harvest-700 [animation-delay:400ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form className="flex gap-2 border-t border-cream-200 p-4" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about pickups, orders, farmers…"
          className="input flex-1" />
        <Button type="submit" size="md" leftIcon={<Send className="h-4 w-4" />}>Send</Button>
      </form>
    </Card>
  );
}
