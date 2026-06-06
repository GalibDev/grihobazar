"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { readCart, writeCart, type StoredCartItem } from "@/lib/cart-storage";
import type { StoreSettings } from "@/lib/types";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

const fallbackSettings: StoreSettings = {
  insideDhakaDelivery: 80,
  outsideDhakaDelivery: 130,
  pickupDelivery: 0,
  bkashNumber: "01XXXXXXXXX",
  nagadNumber: "01XXXXXXXXX",
  whatsappNumber: "8809642922922",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(fallbackSettings);
  const [deliveryCharge, setDeliveryCharge] = useState(80);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "nagad" | "card">("cash");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setItems(readCart());
    fetch("/api/settings")
      .then((response) => response.json())
      .then((nextSettings: StoreSettings) => {
        setSettings(nextSettings);
        setDeliveryCharge(nextSettings.insideDhakaDelivery);
      })
      .catch(() => undefined);
  }, []);

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: String(form.get("customerName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        note: String(form.get("note") ?? ""),
        paymentMethod,
        paymentTransactionId: transactionId,
        deliveryCharge,
        items: items.map((item) => ({ productId: item.id, title: item.title, price: item.price, quantity: item.quantity })),
      }),
    });

    const order = await response.json();
    setSubmitting(false);

    if (response.ok) {
      writeCart([]);
      router.push(`/checkout/success?order=${order.id}&phone=${encodeURIComponent(order.phone)}`);
    }
  }

  return (
    <main className="min-h-screen bg-brand-paper px-4 py-8 text-brand-ink">
      <section className="mx-auto max-w-[1040px]">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-3xl font-extrabold"><ClipboardCheck className="h-7 w-7 text-brand-orange" /> Checkout</h1>
          <Link href="/cart" className="rounded border border-brand-orange px-4 py-2 font-semibold text-brand-orange">Back to Cart</Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center text-[#666]">Your cart is empty.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <form onSubmit={submitOrder} className="grid gap-4 rounded-lg border bg-white p-5">
              <input name="customerName" required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Full name" />
              <input name="phone" required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Phone number" />
              <select value={deliveryCharge} onChange={(event) => setDeliveryCharge(Number(event.target.value))} className="h-12 rounded border px-4 outline-none focus:border-brand-orange">
                <option value={settings.insideDhakaDelivery}>Inside Dhaka - {formatPrice(settings.insideDhakaDelivery)}</option>
                <option value={settings.outsideDhakaDelivery}>Outside Dhaka - {formatPrice(settings.outsideDhakaDelivery)}</option>
                <option value={settings.pickupDelivery}>Store Pickup - {formatPrice(settings.pickupDelivery)}</option>
              </select>
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as "cash" | "bkash" | "nagad" | "card")} className="h-12 rounded border px-4 outline-none focus:border-brand-orange">
                <option value="cash">Cash on Delivery</option>
                <option value="bkash">Manual bKash</option>
                <option value="nagad">Manual Nagad</option>
                <option value="card">Manual Card/Bank</option>
              </select>
              {paymentMethod !== "cash" ? (
                <div className="rounded border bg-[#fff2e7] p-4 text-sm">
                  <p className="font-semibold">Send money first, then enter transaction ID.</p>
                  <p>bKash: {settings.bkashNumber}</p>
                  <p>Nagad: {settings.nagadNumber}</p>
                  <input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} required className="mt-3 h-11 w-full rounded border px-3 outline-none focus:border-brand-orange" placeholder="Transaction ID" />
                </div>
              ) : null}
              <textarea name="address" required className="min-h-24 rounded border px-4 py-3 outline-none focus:border-brand-orange" placeholder="Delivery address" />
              <textarea name="note" className="min-h-20 rounded border px-4 py-3 outline-none focus:border-brand-orange" placeholder="Order note (optional)" />
              <button disabled={submitting} className="h-12 rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">{submitting ? "Placing..." : "Place Order"}</button>
            </form>
            <aside className="h-fit rounded-lg border bg-white p-5">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <span>{item.title} x {item.quantity}</span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="mt-2 flex justify-between"><span>Delivery</span><span>{formatPrice(deliveryCharge)}</span></div>
                <div className="mt-3 flex justify-between text-xl font-extrabold"><span>Total</span><span>{formatPrice(subtotal + deliveryCharge)}</span></div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
