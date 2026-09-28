"use client";
import { useSyncExternalStore } from "react";
import type { CartItem } from "@/types";

const KEY = "marketlink_cart";
type CartState = { items: CartItem[] };
const EMPTY: CartState = { items: [] };

// useSyncExternalStore requires getSnapshot to return a STABLE reference when
// the underlying data hasn't changed — otherwise React re-renders infinitely.
// We cache the parsed snapshot and only invalidate when the raw string changes.
let cachedRaw: string | null = null;
let cachedSnapshot: CartState = EMPTY;

function readCart(): CartState {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  try {
    cachedSnapshot = raw ? JSON.parse(raw) : EMPTY;
  } catch {
    cachedSnapshot = EMPTY;
  }
  return cachedSnapshot;
}

function writeCart(state: CartState) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(state);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = state;
  window.dispatchEvent(new Event("cart-change"));
}

const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("cart-change", () => {
    listeners.forEach((l) => l());
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cachedRaw = null;
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): CartState {
  return readCart();
}

function getServerSnapshot(): CartState {
  return EMPTY;
}

export function useCart() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    items: state.items,
    count: state.items.reduce((s, i) => s + i.quantity, 0),
    total: state.items.reduce((s, i) => s + i.price * i.quantity, 0),
    farmerId: state.items[0]?.farmerId,
    farmerName: state.items[0]?.farmerName,
    add(item: CartItem) {
      const cur = { items: [...readCart().items] };
      if (cur.items.length > 0 && cur.items[0].farmerId !== item.farmerId) {
        if (!confirm(`Your basket has items from ${cur.items[0].farmerName}. Clear it and add from ${item.farmerName}?`)) return;
        cur.items = [];
      }
      const existing = cur.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity = Math.min(item.stock, existing.quantity + item.quantity);
      } else {
        cur.items.push(item);
      }
      writeCart(cur);
    },
    update(productId: string, quantity: number) {
      const cur = { items: [...readCart().items] };
      const item = cur.items.find((i) => i.productId === productId);
      if (item) {
        if (quantity <= 0) cur.items = cur.items.filter((i) => i.productId !== productId);
        else item.quantity = Math.min(item.stock, quantity);
        writeCart(cur);
      }
    },
    remove(productId: string) {
      const cur = { items: readCart().items.filter((i) => i.productId !== productId) };
      writeCart(cur);
    },
    clear() {
      writeCart({ items: [] });
    },
  };
}
