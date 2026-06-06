"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { readCart, setCartQuantity, type StoredCartItem } from "@/lib/cart-storage";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function CartPage() {
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setItems(readCart());
  }, []);

  function updateQuantity(id: string, quantity: number) {
    setItems(setCartQuantity(id, quantity));
  }

  return (
    <main className="min-h-screen bg-brand-paper px-4 py-8 text-brand-ink">
      <section className="mx-auto max-w-[960px]">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold"><ShoppingCart className="h-7 w-7 text-brand-orange" /> Cart</h1>
          <Link href="/" className="rounded border border-brand-orange px-4 py-2 font-semibold text-brand-orange">Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center text-[#666]">Your cart is empty.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border bg-white p-4">
                  <img className="h-24 w-24 object-contain" src={item.image} alt={item.title} />
                  <div>
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="text-brand-orange">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-9 w-9 place-items-center rounded border"><Minus className="h-4 w-4" /></button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-9 w-9 place-items-center rounded border"><Plus className="h-4 w-4" /></button>
                      <button onClick={() => updateQuantity(item.id, 0)} className="grid h-9 w-9 place-items-center rounded bg-[#ef4444] text-white"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-lg border bg-white p-5">
              <div className="flex justify-between text-xl font-bold"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <Link href="/checkout" className="mt-5 grid h-12 place-items-center rounded bg-brand-orange font-bold text-white">Checkout</Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
