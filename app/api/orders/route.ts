import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeOrderId, makeTrackingCode, readStore, writeStore } from "@/lib/store";
import type { Order } from "@/lib/types";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  return NextResponse.json(store.orders);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Order>;

  if (!body.customerName || !body.phone || !body.address || !body.items?.length) {
    return NextResponse.json({ message: "customerName, phone, address and items are required" }, { status: 400 });
  }

  const deliveryCharge = Number(body.deliveryCharge ?? 80);
  const itemTotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order: Order = {
    id: makeOrderId(),
    customerName: body.customerName,
    phone: body.phone,
    address: body.address,
    note: body.note,
    items: body.items,
    total: itemTotal + deliveryCharge,
    status: "pending",
    paymentMethod: body.paymentMethod ?? "cash",
    paymentStatus: "unpaid",
    paymentTransactionId: body.paymentTransactionId,
    deliveryCharge,
    trackingCode: makeTrackingCode(),
    createdAt: new Date().toISOString(),
  };

  const store = await readStore();
  store.orders.unshift(order);
  await writeStore(store);

  return NextResponse.json(order, { status: 201 });
}
