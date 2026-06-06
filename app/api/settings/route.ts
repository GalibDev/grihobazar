import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { StoreSettings } from "@/lib/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.settings);
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<StoreSettings>;
  const store = await readStore();

  store.settings = {
    ...store.settings,
    ...body,
    insideDhakaDelivery: Number(body.insideDhakaDelivery ?? store.settings.insideDhakaDelivery),
    outsideDhakaDelivery: Number(body.outsideDhakaDelivery ?? store.settings.outsideDhakaDelivery),
    pickupDelivery: Number(body.pickupDelivery ?? store.settings.pickupDelivery),
  };

  await writeStore(store);
  return NextResponse.json(store.settings);
}
