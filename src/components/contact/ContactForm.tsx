"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Send, User, Mail, MessageCircle } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Message sent! We'll reply within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft md:p-8">
      <h2 className="serif-heading text-2xl text-ink-900">Send us a message</h2>
      <p className="mt-1 text-sm text-ink-500">Fill out the form and we'll be in touch.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Your name" required leftIcon={<User className="h-4 w-4" />} value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
        <Input label="Email" type="email" required leftIcon={<Mail className="h-4 w-4" />} value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      </div>
      <div className="mt-4">
        <Input label="Subject" required leftIcon={<MessageCircle className="h-4 w-4" />} value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" />
      </div>
      <div className="mt-4">
        <Textarea label="Message" required rows={5} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more…" />
      </div>
      <Button type="submit" size="lg" loading={loading} className="mt-6" rightIcon={<Send className="h-4 w-4" />}>
        Send message
      </Button>
    </form>
  );
}
