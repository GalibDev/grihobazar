import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Category } from "@/lib/types";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const body = (await request.json()) as Partial<Category>;
  const store = await readStore();
  const index = store.categories.findIndex((category) => category.slug === slug);

  if (index === -1) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  store.categories[index] = {
    ...store.categories[index],
    ...body,
    slug,
  };

  await writeStore(store);
  return NextResponse.json(store.categories[index]);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const store = await readStore();
  store.categories = store.categories.filter((category) => category.slug !== slug);
  await writeStore(store);

  return NextResponse.json({ ok: true });
}
