"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { addCartItem } from "@/lib/cart-storage";
import { StorefrontHeader } from "@/components/storefront-header";
import type { Category, Product } from "@/lib/types";

const formatPrice = (price: number) => `\u09f3${price.toLocaleString("en-US")}`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const fallbackTitles: Record<string, string> = {
  "oil-ghee": "Oil & Ghee",
  "nuts-seeds": "Nuts & Seeds",
  "flours-lentils": "Flours & Lentils",
  "black-seed-honey": "Black Seed Honey",
  "lichu-flower-honey": "Lichu Flower Honey",
  "african-organic-honey": "African Organic Honey",
  "sundarban-honey": "Sundarban Honey",
  "sidr-honey": "Sidr Honey",
  "whole-spices": "Whole Spices",
  "basic-spices": "Basic Spices",
  "mixed-spices": "Mixed Spices",
  "safawi-kalmi": "Safawi/kalmi",
};

const categoryFilters: Record<string, (product: Product) => boolean> = {
  mango: (product) => product.category === "Mango",
  honey: (product) => product.category === "Honey",
  dates: (product) => product.category === "Dates",
  spices: (product) => product.category === "Spices",
  "oil-ghee": (product) => product.category === "Oil & Ghee",
  organic: (product) => product.category === "Organic",
  certified: (product) => product.category === "Organic",
  "nuts-seeds": (product) => product.category === "Nuts & Seeds",
  rice: (product) => product.category === "Rice",
  "flours-lentils": (product) => product.category === "Flours & Lentils",
  "black-seed-honey": (product) => product.category === "Honey" && /black seed/i.test(product.title),
  "sundarban-honey": (product) => product.category === "Honey" && /sundarban/i.test(product.title),
  "lichu-flower-honey": (product) => product.category === "Honey" && /lichu|lychee/i.test(product.title),
  "african-organic-honey": (product) => product.category === "Honey" && /african/i.test(product.title),
  "sidr-honey": (product) => product.category === "Honey" && /sidr/i.test(product.title),
  honeycomb: (product) => product.category === "Honey" && /honeycomb/i.test(product.title),
  "whole-spices": (product) => product.category === "Spices" && /cumin|jira|coriander|cardamom|cinnamon|turmeric|chili|morich|holud/i.test(product.title),
  "basic-spices": (product) => product.category === "Spices" && /powder|gura/i.test(product.title),
  "mixed-spices": (product) => product.category === "Spices" && /masala|bhuna/i.test(product.title),
  medjool: (product) => product.category === "Dates" && /medjool/i.test(product.title),
  ajwa: (product) => product.category === "Dates" && /ajwa/i.test(product.title),
  "safawi-kalmi": (product) => product.category === "Dates" && /safawi|kalmi/i.test(product.title),
  sukkari: (product) => product.category === "Dates" && /sukkari/i.test(product.title),
  mabroom: (product) => product.category === "Dates" && /mabroom/i.test(product.title),
  flours: (product) => product.category === "Flours & Lentils" && /flour|atta|gura/i.test(product.title),
  lentils: (product) => product.category === "Flours & Lentils" && /dal|lentil/i.test(product.title),
};

const parentCategorySlugs = new Set(["honey", "spices", "dates", "nuts-seeds", "flours-lentils"]);

export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/categories")])
      .then(async ([productResponse, categoryResponse]) => {
        setProducts(await productResponse.json());
        setCategories(await categoryResponse.json());
      });
  }, []);

  const title = categories.find((item) => item.slug === params.slug)?.title ?? fallbackTitles[params.slug] ?? params.slug.replace(/-/g, " ");
  const baseFilter = categoryFilters[params.slug] ?? ((product: Product) => slugify(product.category) === params.slug);

  const filteredProducts = useMemo(() => {
    const nextProducts = products.filter((product) => {
      const matchesCategory = baseFilter(product);
      const matchesQuery = !query || product.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    return [...nextProducts].sort((first, second) => {
      if (sort === "low") return first.price - second.price;
      if (sort === "high") return second.price - first.price;
      if (sort === "oldest") return first.id.localeCompare(second.id);
      return 0;
    });
  }, [baseFilter, products, query, sort]);

  const maxPrice = filteredProducts.reduce((max, product) => Math.max(max, product.oldPrice ?? product.price), 0);
  const filterOptions = parentCategorySlugs.has(params.slug) ? categoryFilterOptions(params.slug, title) : [];

  return (
    <main className="min-h-screen bg-[#eef0f5] text-brand-ink">
      <StorefrontHeader />
      <section className="mx-auto max-w-[1760px] px-4 py-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="capitalize text-[32px] font-semibold lg:text-[38px]">{title}</h1>
          <div className="text-lg text-[#666]">
            <Link href="/" className="hover:text-brand-orange">Home</Link>
            <span className="mx-2">›</span>
            <span className="capitalize text-brand-ink">{title}</span>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[436px_1fr]">
          <aside className="grid content-start gap-3">
            {filterOptions.length ? (
              <FilterPanel title="FILTER BY CATEGORY">
                <div className="grid gap-3">
                  {filterOptions.map((option) => (
                    <Link key={option} href={`/collections/${slugify(option)}`} className="flex items-center gap-3 text-[20px] text-brand-ink hover:text-brand-orange">
                      <span className={`h-5 w-5 rounded border ${slugify(option) === params.slug ? "border-brand-orange bg-brand-orange" : "border-[#c9c9c9] bg-white"}`} />
                      {option}
                    </Link>
                  ))}
                </div>
              </FilterPanel>
            ) : null}
            <FilterPanel title="PRICE RANGE">
              <div className="mb-4 flex justify-between text-[20px] font-semibold">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <div className="relative h-2 rounded-full bg-brand-orange">
                <span className="absolute -top-2 left-0 h-6 w-6 rounded-full bg-brand-orange shadow-soft" />
                <span className="absolute -top-2 right-0 h-6 w-6 rounded-full bg-brand-orange shadow-soft" />
              </div>
            </FilterPanel>
            <FilterPanel title="BRANDS">
              <label className="flex items-center gap-3 text-[20px] text-brand-ink">
                <span className="h-5 w-5 rounded border border-[#c9c9c9] bg-white" />
                {brandNameFor(title)}
              </label>
            </FilterPanel>
          </aside>

          <section>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded bg-white px-5 py-4 shadow-soft">
              <label className="flex items-center gap-3 text-lg font-semibold">
                Sort By :
                <span className="relative">
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 appearance-none rounded border border-[#d7d7d7] bg-white px-4 pr-11 font-normal outline-none focus:border-brand-orange">
                    <option value="default">Default Sorting</option>
                    <option value="oldest">Sort by Oldest</option>
                    <option value="low">Price Low to High</option>
                    <option value="high">Price High to Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-orange" />
                </span>
              </label>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 rounded border px-5 text-lg outline-none focus:border-brand-orange" placeholder="Search products" />
            </div>

            {filteredProducts.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[repeat(auto-fill,219px)] xl:justify-between">
                {filteredProducts.map((product) => <CollectionProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="rounded bg-white p-10 text-center text-xl text-[#666] shadow-soft">No products found.</div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function categoryFilterOptions(slug: string, title: string) {
  if (slug.includes("honey") || /honey/i.test(title)) return ["Sundarban Honey", "Black Seed Honey", "Lichu Flower Honey", "African Organic Honey", "Sidr Honey", "Honeycomb"];
  if (slug.includes("spices") || /spices/i.test(title)) return ["Whole Spices", "Basic Spices", "Mixed Spices"];
  if (slug.includes("dates") || /dates/i.test(title)) return ["Safawi/kalmi", "Medjool", "Sukkari", "Ajwa", "Mabroom"];
  if (slug.includes("nuts")) return ["Nuts", "Seeds"];
  if (slug.includes("flours") || slug.includes("lentils")) return ["Flours", "Lentils"];
  return [];
}

function brandNameFor(title: string) {
  if (/honey/i.test(title)) return "Honeyraj";
  if (/spices/i.test(title)) return "Shosti food";
  return "Griho Bazar";
}

function FilterPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded bg-white px-5 py-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between border-b border-[#dedede] pb-3">
        <div>
          <h2 className="text-lg font-bold tracking-wide">{title}</h2>
          <div className="mt-3 h-1 w-[142px] rounded-full bg-brand-orange" />
        </div>
        <span className="text-xl text-[#666]">-</span>
      </div>
      {children}
    </div>
  );
}

function CollectionProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  return (
    <article className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[5px] border border-[#d7d7d7] bg-white xl:h-[332px] xl:min-h-[332px]">
      {product.badge ? <span className="absolute right-3 top-4 z-[1] rounded bg-[#35c486] px-2 py-1 text-xs font-semibold text-white">{product.badge}</span> : null}
      <Link href={`/products/${product.id}`} className="block">
        <div className="grid h-[190px] place-items-center p-4 xl:h-[174px] xl:p-5">
          <img className="max-h-full max-w-full object-contain" src={product.image} alt={product.title} />
        </div>
        <h2 className="min-h-[48px] overflow-hidden px-3 text-[18px] font-medium leading-tight xl:min-h-[46px] xl:text-[20px]">{product.title}</h2>
      </Link>
      <div className="mt-2 flex items-center gap-2 px-3">
        <strong className="text-[22px] font-extrabold text-brand-orange">{formatPrice(product.price)}</strong>
        {product.oldPrice ? <span className="text-base text-[#9a9a9a] line-through">{formatPrice(product.oldPrice)}</span> : null}
      </div>
      <div className="mt-auto p-3">
        <button type="button" onClick={() => { addCartItem(product); setAdded(true); }} className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded border border-brand-orange text-base font-bold text-brand-orange">
          <ShoppingCart className="h-5 w-5" />
          {added ? "Added" : "Add To Cart"}
        </button>
      </div>
    </article>
  );
}
