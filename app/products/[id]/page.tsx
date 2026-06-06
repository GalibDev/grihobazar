"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { addCartItem } from "@/lib/cart-storage";
import type { Product } from "@/lib/types";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((products: Product[]) => setProduct(products.find((item) => item.id === params.id) ?? null));
  }, [params.id]);

  if (!product) {
    return <main className="grid min-h-screen place-items-center bg-brand-paper text-brand-ink">Product loading...</main>;
  }

  return (
    <main className="min-h-screen bg-brand-paper px-4 py-8 text-brand-ink">
      <section className="mx-auto grid max-w-[1040px] gap-8 rounded-lg border bg-white p-6 lg:grid-cols-[420px_1fr]">
        <img className="mx-auto max-h-[440px] object-contain" src={product.image} alt={product.title} />
        <div>
          <Link href={`/collections/${encodeURIComponent(product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`} className="text-sm font-bold text-brand-orange">{product.category}</Link>
          <h1 className="mt-3 text-4xl font-extrabold">{product.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <strong className="text-3xl text-brand-orange">{formatPrice(product.price)}</strong>
            {product.oldPrice ? <span className="text-lg text-[#777] line-through">{formatPrice(product.oldPrice)}</span> : null}
          </div>
          <p className="mt-5 leading-8 text-[#666]">Safe and reliable grocery product from Ghorer Bazar. Order online and receive delivery at your doorstep.</p>
          {message ? <p className="mt-4 rounded bg-[#fff2e7] p-3 text-sm font-semibold">{message}</p> : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                addCartItem(product);
                setMessage("Added to cart.");
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded border border-brand-orange font-bold text-brand-orange"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <Link
              href="/checkout"
              onClick={() => addCartItem(product)}
              className="grid h-12 place-items-center rounded bg-brand-orange font-bold text-white"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
