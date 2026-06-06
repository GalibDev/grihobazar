"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { addCartItem } from "@/lib/cart-storage";
import type { Category, Product } from "@/lib/types";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/categories")])
      .then(async ([productResponse, categoryResponse]) => {
        setProducts(await productResponse.json());
        setCategories(await categoryResponse.json());
      });
  }, []);

  const category = categories.find((item) => item.slug === params.slug);
  const title = category?.title ?? params.slug.replace(/-/g, " ");
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = slugify(product.category) === params.slug;
      const matchesQuery = !query || product.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [params.slug, products, query]);

  return (
    <main className="min-h-screen bg-brand-paper px-4 py-8 text-brand-ink">
      <section className="mx-auto max-w-[1180px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="capitalize text-3xl font-extrabold">{title}</h1>
            <p className="text-[#666]">{filteredProducts.length} products</p>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Search in collection" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="rounded-lg border bg-white p-4">
              <Link href={`/products/${product.id}`}>
                <img className="mx-auto h-44 object-contain" src={product.image} alt={product.title} />
                <h2 className="mt-3 min-h-12 font-bold leading-tight">{product.title}</h2>
              </Link>
              <strong className="mt-2 block text-xl text-brand-orange">{formatPrice(product.price)}</strong>
              <button onClick={() => addCartItem(product)} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded bg-brand-orange font-bold text-white">
                <ShoppingCart className="h-4 w-4" />
                Add
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
