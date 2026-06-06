import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeId, uploadProductImage } from "@/lib/store";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Image file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image uploads are allowed" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "png";
  const fileName = `${makeId(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const url = await uploadProductImage(fileName, bytes, file.type);

  return NextResponse.json({ url });
}
