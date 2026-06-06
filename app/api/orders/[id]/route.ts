import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Order } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<Order>;
  const store = await readStore();
  const index = store.orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  store.orders[index] = {
    ...store.orders[index],
    ...body,
    id,
  };

  await writeStore(store);
  return NextResponse.json(store.orders[index]);
}
