"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingBasket, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import type { CartItem } from "@/types";

export function AddToCartClient({
  product,
  isLoggedIn,
  isCustomer,
}: {
  product: Omit<CartItem, "quantity">;
  isLoggedIn: boolean;
  isCustomer: boolean;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  function handleAdd() {
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to cart");
      router.push("/login?redirect=/products");
      return;
    }
    if (!isCustomer) {
      toast.error("Only customers can place orders");
      return;
    }
    add({ ...product, quantity: qty });
    toast.success(`Added ${qty} ${product.unit} of ${product.name}`);
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 rounded-full border-2 border-cream-200 bg-white p-1">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="rounded-full p-2 text-ink-700 hover:bg-cream-100 disabled:opacity-40"
          disabled={qty <= 1 || outOfStock}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[3ch] text-center font-semibold">{qty}</span>
        <button
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          className="rounded-full p-2 text-ink-700 hover:bg-cream-100 disabled:opacity-40"
          disabled={qty >= product.stock || outOfStock}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button onClick={handleAdd} disabled={outOfStock} size="lg" leftIcon={<ShoppingBasket className="h-4 w-4" />} className="flex-1">
        {outOfStock ? "Out of stock" : "Add to basket"}
      </Button>
    </div>
  );
}
