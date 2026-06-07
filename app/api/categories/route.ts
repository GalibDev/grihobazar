import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeId, readStore, writeStore } from "@/lib/store";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.categories, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Category>;
  const title = body.title?.trim();

  if (!title || !body.image) {
    return NextResponse.json({ message: "Category title and image are required" }, { status: 400 });
  }

  const store = await readStore();
  const category: Category = {
    title,
    image: body.image,
    slug: body.slug?.trim() || makeId(title),
  };

  if (store.categories.some((item) => item.slug === category.slug)) {
    return NextResponse.json({ message: "Category already exists" }, { status: 409 });
  }

  store.categories.push(category);
  await writeStore(store);
  return NextResponse.json(category, { status: 201 });
}
