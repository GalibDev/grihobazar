import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Banner } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<Banner>;
  const store = await readStore();
  const index = store.banners.findIndex((banner) => banner.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Banner not found" }, { status: 404 });
  }

  store.banners[index] = { ...store.banners[index], ...body, id };
  await writeStore(store);
  return NextResponse.json(store.banners[index]);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = await readStore();
  store.banners = store.banners.filter((banner) => banner.id !== id);
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
