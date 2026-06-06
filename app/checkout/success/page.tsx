"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, MessageCircle } from "lucide-react";
import type { Order } from "@/lib/types";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-brand-paper text-brand-ink">Loading order...</main>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const phone = params.get("phone") ?? "";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId || !phone) return;
    fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`)
      .then((response) => response.json())
      .then(setOrder)
      .catch(() => undefined);
  }, [orderId, phone]);

  const message = order
    ? `Assalamu alaikum, my Ghorer Bazar order is ${order.id}. Phone: ${order.phone}. Total: ${formatPrice(order.total)}.`
    : `Assalamu alaikum, my Ghorer Bazar order is ${orderId}.`;

  return (
    <main className="grid min-h-screen place-items-center bg-brand-paper px-4 py-10 text-brand-ink">
      <section className="w-full max-w-[620px] rounded-lg border bg-white p-6 text-center shadow-soft">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#22c55e]" />
        <h1 className="text-3xl font-extrabold">Order Placed</h1>
        <p className="mt-2 text-[#666]">Please save your order ID for tracking.</p>
        <div className="mt-5 rounded bg-[#f7f7f7] p-4 text-left">
          <p><strong>Order ID:</strong> {order?.id ?? orderId}</p>
          <p><strong>Tracking:</strong> {order?.trackingCode ?? "Loading..."}</p>
          <p><strong>Status:</strong> {order?.status ?? "pending"}</p>
          {order ? <p><strong>Total:</strong> {formatPrice(order.total)}</p> : null}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button onClick={() => navigator.clipboard.writeText(order?.id ?? orderId)} className="inline-flex h-11 items-center justify-center gap-2 rounded border font-bold"><Copy className="h-4 w-4" /> Copy ID</button>
          <a href={`https://api.whatsapp.com/send?phone=8809642922922&text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded bg-[#22c55e] font-bold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          <Link href={`/track/order`} className="grid h-11 place-items-center rounded bg-brand-orange font-bold text-white">Track</Link>
        </div>
      </section>
    </main>
  );
}
