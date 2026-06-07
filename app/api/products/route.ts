import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeId, readStore, writeStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.products, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Product>;
  const title = body.title?.trim();

  if (!title || !body.category || !body.image || typeof body.price !== "number") {
    return NextResponse.json({ message: "title, category, image and numeric price are required" }, { status: 400 });
  }

  const store = await readStore();
  const baseId = body.id?.trim() || makeId(title);
  let id = baseId;
  let counter = 2;

  while (store.products.some((product) => product.id === id)) {
    id = `${baseId}-${counter}`;
    counter += 1;
  }

  const product: Product = {
    id,
    title,
    category: body.category,
    image: body.image,
    price: body.price,
    oldPrice: body.oldPrice,
    badge: body.badge,
    badgeTone: body.badgeTone,
    stock: body.stock ?? "in",
    featured: Boolean(body.featured),
  };

  store.products.unshift(product);
  await writeStore(store);

  return NextResponse.json(product, { status: 201 });
}
