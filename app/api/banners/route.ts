import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeId, readStore, writeStore } from "@/lib/store";
import type { Banner } from "@/lib/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.banners);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Banner>;

  if (!body.title || !body.image || !body.category) {
    return NextResponse.json({ message: "Title, image and category are required" }, { status: 400 });
  }

  const store = await readStore();
  const banner: Banner = {
    id: body.id || makeId(body.title),
    title: body.title,
    image: body.image,
    mobileImage: body.mobileImage,
    category: body.category,
    active: body.active ?? true,
  };

  store.banners.push(banner);
  await writeStore(store);

  return NextResponse.json(banner, { status: 201 });
}
