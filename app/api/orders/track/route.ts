import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim();
  const phone = url.searchParams.get("phone")?.trim();

  if (!id || !phone) {
    return NextResponse.json({ message: "Order ID and phone are required" }, { status: 400 });
  }

  const store = await readStore();
  const order = store.orders.find((item) => item.id.toLowerCase() === id.toLowerCase() && item.phone === phone);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
