"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ClipboardList } from "lucide-react";

type TrackedOrder = {
  id: string;
  status: string;
  trackingCode: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryCharge: number;
  createdAt: string;
};

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setOrder(null);

    const response = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
    const data = await response.json();

    if (response.ok) {
      setOrder(data);
    } else {
      setMessage(data.message ?? "Order not found");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-brand-paper px-4 py-10 text-brand-ink">
      <section className="mx-auto max-w-[620px] rounded-lg border bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-brand-orange text-white">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">Track Order</h1>
            <p className="text-sm text-[#666]">Order ID and phone number দিয়ে status দেখুন</p>
          </div>
        </div>

        <form onSubmit={track} className="grid gap-3">
          <input value={orderId} onChange={(event) => setOrderId(event.target.value)} required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Order ID" />
          <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Phone number" />
          <button disabled={loading} className="h-12 rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">
            {loading ? "Checking..." : "Track Order"}
          </button>
        </form>

        {message ? <p className="mt-4 rounded bg-[#fee2e2] p-3 text-sm font-semibold text-[#991b1b]">{message}</p> : null}

        {order ? (
          <div className="mt-5 rounded border bg-[#f7f7f7] p-4">
            <h2 className="mb-3 text-xl font-bold">{order.id}</h2>
            <div className="grid gap-2 text-sm">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Tracking:</strong> {order.trackingCode}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} / {order.paymentStatus}</p>
              <p><strong>Delivery:</strong> {formatPrice(order.deliveryCharge)}</p>
              <p><strong>Total:</strong> {formatPrice(order.total)}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
