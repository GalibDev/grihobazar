import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Product } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<Product>;
  const store = await readStore();
  const index = store.products.findIndex((product) => product.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  store.products[index] = {
    ...store.products[index],
    ...body,
    id,
  };

  await writeStore(store);
  return NextResponse.json(store.products[index]);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = await readStore();
  const nextProducts = store.products.filter((product) => product.id !== id);

  if (nextProducts.length === store.products.length) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  store.products = nextProducts;
  await writeStore(store);

  return NextResponse.json({ ok: true });
}
