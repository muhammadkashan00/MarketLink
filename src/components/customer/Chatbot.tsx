"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Rule-based FAQ assistant — deterministic, NOT AI.
// Uses keyword scoring so partial or casual queries still match.
type FAQ = { keywords: string[]; answer: string; suggestions?: string[] };

const FAQS: FAQ[] = [
  {
    keywords: ["hi", "hello", "hey", "salam", "assalam", "hola", "yo"],
    answer: "Hi there! 🌿 I can help with anything about ordering, pickups, farmers, favorites, or your account. What's up?",
    suggestions: ["How do I place an order?", "Where do I pick up?", "How do I pay?"],
  },
  {
    keywords: ["thank", "thanks", "thx", "cool", "great", "nice"],
    answer: "You're welcome! Anything else I can help with?",
    suggestions: ["Cancel an order", "Find markets near me", "Contact support"],
  },
  {
    keywords: ["who", "what are you", "what can you", "your name", "about you", "bot"],
    answer: "I'm MarketLink Assist — a small FAQ helper (not a real person). I can answer questions about orders, pickups, farmers, reviews and account settings.",
    suggestions: ["How do orders work?", "How to become a farmer?"],
  },

  {
    keywords: ["order", "place order", "place an order", "buy", "purchase", "book", "reserve", "pre-order", "preorder"],
    answer: "To place an order: browse markets or products, tap a product to add it to your basket, then head to checkout. Pick a date + time slot, confirm, and you're done. Payment happens in cash when you pick up.",
    suggestions: ["Where do I pick up?", "How do I pay?", "Can I cancel?"],
  },
  {
    keywords: ["pickup", "collect", "pick up", "get my order", "receive"],
    answer: "Pickups happen at the farmer's stall during their operating window. Once your order is ACCEPTED, you'll see the exact market, date and slot on your order page.",
    suggestions: ["What if I miss my slot?", "How to cancel an order?"],
  },
  {
    keywords: ["pay", "payment", "price", "cost", "how much", "money", "cash", "card", "online payment"],
    answer: "You pay in cash directly to the farmer when you collect your order. MarketLink doesn't charge any online fees — the price you see is the price you pay.",
    suggestions: ["Refund policy?", "What if item is unavailable?"],
  },
  {
    keywords: ["cancel", "refund", "change", "modify", "edit order", "update order"],
    answer: "You can cancel any order until the farmer's cutoff (usually the night before pickup). Go to My Orders → open your order → Cancel. If the farmer already accepted, cancel windows may be shorter.",
    suggestions: ["When is farmer's cutoff?", "How to modify quantity?"],
  },
  {
    keywords: ["miss", "late", "forgot", "no show", "missed pickup", "didn't collect"],
    answer: "If you can't make your pickup, please cancel first so the farmer can offer the stock to someone else. Missed pickups without cancellation may affect your account.",
    suggestions: ["Reschedule pickup?", "Cancel an order"],
  },

  {
    keywords: ["market", "when open", "hours", "operating", "timings", "schedule", "open today"],
    answer: "Each market has its own days and hours — you'll see them on the market's page and in your order. Most run Saturdays 7am–1pm. Head to the Markets tab to explore.",
    suggestions: ["Find markets near me", "How do farmers work?"],
  },
  {
    keywords: ["find", "near me", "nearby", "location", "map", "close to me", "directions"],
    answer: "Head to the Markets page — every market is pinned on an interactive map. You can filter by day and see which farmers are attending.",
    suggestions: ["Which markets are open today?"],
  },
  {
    keywords: ["farmer", "seller", "vendor", "stall", "grower"],
    answer: "Every farmer is verified by our admin team. Their profile shows stall name, markets they attend, operating days, past reviews and this week's stock.",
    suggestions: ["Become a farmer", "Rate a farmer"],
  },
  {
    keywords: ["become a farmer", "sell", "list my", "new farmer", "join as farmer", "signup as farmer"],
    answer: "Register with the 'I'm a farmer' option, fill in your stall name, and wait for admin approval. Once approved, you can list products and start accepting pre-orders.",
    suggestions: ["How long is approval?"],
  },
  {
    keywords: ["approval", "approve", "pending", "verify", "verification"],
    answer: "New farmer accounts stay in PENDING until an admin reviews them (usually within a day). You'll get a notification when your account is approved.",
  },

  {
    keywords: ["favorite", "favourite", "save", "bookmark", "wishlist", "heart"],
    answer: "Tap the heart icon on any farmer or product to save it. You'll find them all under Favorites in your dashboard for quick reorders.",
    suggestions: ["Restock alerts?", "How to reorder?"],
  },
  {
    keywords: ["restock", "back in stock", "alert", "notify me"],
    answer: "When a farmer's item you favorited comes back in stock, you'll see a notification. Keep the Notifications tab handy!",
  },
  {
    keywords: ["reorder", "buy again", "order again", "previous order", "history"],
    answer: "Head to My Orders → open a past order → tap Reorder. All the same items land in your basket, ready to check out.",
  },

  {
    keywords: ["review", "rate", "rating", "feedback", "stars"],
    answer: "You can leave reviews once your order is marked COMPLETED. Open the order and post a star rating + comment for the farmer or specific products.",
    suggestions: ["Can farmers reply?"],
  },
  {
    keywords: ["reply", "respond", "farmer response"],
    answer: "Yes — farmers can publicly reply to any review you leave. Their replies show up under your comment on their stall page.",
  },

  {
    keywords: ["profile", "account", "update profile", "change email", "change phone", "address"],
    answer: "Go to Profile from your dashboard sidebar. You can update your name, phone, and address. Email changes require support — contact us via the Contact page.",
    suggestions: ["Delete my account"],
  },
  {
    keywords: ["password", "reset password", "forgot", "forgot password", "change password"],
    answer: "For security, password resets currently need to be requested via the Contact form on the About page. We'll respond within 24 hours.",
  },
  {
    keywords: ["delete", "close account", "deactivate"],
    answer: "To close your account, please email hello@marketlink.app from your registered address. Your data will be removed within 7 days.",
  },
  {
    keywords: ["notification", "email alert", "sms", "text me"],
    answer: "MarketLink sends in-app notifications for every order update. Check the bell icon in your dashboard. Email + SMS alerts are coming soon.",
  },

  {
    keywords: ["organic", "pesticide", "certif", "natural", "spray-free"],
    answer: "MarketLink doesn't verify organic certification. Each farmer describes their growing practices in their profile — check there or ask them at the stall.",
  },
  {
    keywords: ["quality", "fresh", "freshness", "guarantee"],
    answer: "Every product is listed the same week it's harvested. If you're ever unhappy with quality, talk to the farmer at pickup — they usually make it right.",
  },
  {
    keywords: ["delivery", "deliver", "shipping", "ship", "courier", "home delivery"],
    answer: "MarketLink is pickup-only — we don't do delivery. This keeps prices low and lets you meet the grower.",
  },

  {
    keywords: ["contact", "support", "help me", "email", "phone number", "reach"],
    answer: "You can reach us via the Contact page (link in the footer). Email hello@marketlink.app or call +92 300 1234 567.",
  },
  {
    keywords: ["app", "mobile", "android", "ios", "iphone"],
    answer: "MarketLink runs great in your browser on any device. A dedicated mobile app is on our roadmap for 2027.",
  },
  {
    keywords: ["language", "urdu", "english", "translation"],
    answer: "Right now MarketLink is English-only. Urdu and Punjabi support is planned — stay tuned!",
  },
];

const DEFAULT_ANSWER =
  "I couldn't match that exactly. Try asking about orders, pickup, payments, cancellations, or farmers — or email hello@marketlink.app for anything else.";
const STARTER_SUGGESTIONS = [
  "How do I place an order?",
  "How do I pay?",
  "Can I cancel an order?",
  "How do I find markets near me?",
];

function scoreQuery(query: string, kw: string): number {
  const q = query.toLowerCase();
  const k = kw.toLowerCase();
  if (q === k) return k.length * 3;
  // whole-word match
  const wordRegex = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  if (wordRegex.test(query)) return k.length * 2;
  // substring match
  if (q.includes(k)) return k.length;
  return 0;
}

function respond(query: string): { text: string; suggestions?: string[] } {
  if (!query.trim()) return { text: DEFAULT_ANSWER, suggestions: STARTER_SUGGESTIONS };
  let best: { score: number; faq: FAQ | null } = { score: 0, faq: null };
  for (const faq of FAQS) {
    let s = 0;
    for (const kw of faq.keywords) s += scoreQuery(query, kw);
    if (s > best.score) best = { score: s, faq };
  }
  if (best.faq && best.score > 0) return { text: best.faq.answer, suggestions: best.faq.suggestions };
  return { text: DEFAULT_ANSWER, suggestions: STARTER_SUGGESTIONS };
}

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
    }, 500 + Math.random() * 300);
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
              {m.suggestions && m.suggestions.length > 0 && (
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
