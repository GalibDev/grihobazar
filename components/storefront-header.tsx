"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Heart, MapPin, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { readCart } from "@/lib/cart-storage";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

const navItems = [
  { title: "Combos", href: "/collections/combos" },
  { title: "Offer Zone", href: "/collections/offer-zone" },
  { title: "Mango", href: "/collections/mango" },
  {
    title: "Honey",
    href: "/collections/honey",
    children: ["Sundarban Honey", "Black Seed Honey", "Lichu Flower Honey", "African Organic Honey", "Sidr Honey", "Honeycomb"],
  },
  { title: "Oil & Ghee", href: "/collections/oil-ghee" },
  {
    title: "Dates",
    href: "/collections/dates",
    children: ["Safawi/kalmi", "Medjool", "Sukkari", "Ajwa", "Mabroom"],
  },
  {
    title: "Spices",
    href: "/collections/spices",
    children: ["Whole Spices", "Basic Spices", "Mixed Spices"],
  },
  {
    title: "Nuts & Seeds",
    href: "/collections/nuts-seeds",
    children: ["Nuts", "Seeds"],
  },
  {
    title: "Beverage",
    href: "/collections/beverage",
    children: ["Tea", "Coffee"],
  },
  { title: "Rice", href: "/collections/rice" },
  {
    title: "Flours & Lentils",
    href: "/collections/flours-lentils",
    children: ["Flours", "Lentils"],
  },
  { title: "Certified", href: "/collections/certified" },
  { title: "Pickle", href: "/collections/pickle" },
  { title: "Tabaya", href: "/collections/tabaya" },
];

export function StorefrontHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const items = readCart();
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      setCartTotal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    updateCart();
    window.addEventListener("grihobazar-cart", updateCart);
    return () => window.removeEventListener("grihobazar-cart", updateCart);
  }, []);

  return (
    <>
      <header className="hidden bg-white lg:block">
        <div className="mx-auto grid h-[130px] max-w-[1760px] grid-cols-[300px_1fr_520px] items-center gap-8 px-8">
          <Link href="/" aria-label="Griho Bazar home">
            <img className="w-[180px]" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
          </Link>
          <label className="relative block">
            <input className="h-[70px] w-full rounded-lg bg-[#f5f5f5] px-7 pr-16 text-[20px] outline-none focus:ring-2 focus:ring-brand-orange/30" placeholder="Search in..." />
            <Search className="absolute right-6 top-1/2 h-9 w-9 -translate-y-1/2 text-brand-ink" />
          </label>
          <div className="flex items-center justify-end gap-8 text-brand-ink">
            <HeaderAction href="/track/order" icon={<MapPin />} label="Track Order" />
            <HeaderAction href="/admin/login" icon={<UserRound />} label="Sign In" />
            <HeaderAction href="/" icon={<Heart />} label="Wishlist" />
            <HeaderAction href="/cart" icon={<ShoppingCart />} label="Cart" count={cartCount} />
            <HeaderAction href="/" icon={<Menu />} label="More" />
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-[#002c26] text-white">
        <div className="mx-auto flex h-[98px] max-w-[1760px] items-center gap-8 overflow-x-auto px-8 text-[22px] font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <div key={item.title} className="group relative flex h-full shrink-0 items-center">
              <Link href={item.href} className="flex items-center gap-2 hover:text-brand-orange">
                {item.title}
                {item.children ? <ChevronDown className="h-5 w-5" /> : null}
              </Link>
              {item.children ? (
                <div className="invisible fixed top-[228px] z-40 min-w-[320px] bg-white py-3 text-[21px] font-normal text-[#666] opacity-0 shadow-float transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link key={child} href={`/collections/${slugify(child)}`} className="block px-7 py-3 hover:bg-brand-orange hover:text-white">
                      {child}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </nav>

      <Link href="/cart" className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 overflow-hidden rounded-l-lg bg-white text-center shadow-float lg:block">
        <span className="grid bg-brand-orange px-5 py-4 text-white">
          <ShoppingCart className="mx-auto h-8 w-8" />
          <span className="text-lg font-semibold">{cartCount} Items</span>
        </span>
        <strong className="block px-5 py-3 text-xl text-brand-orange">{formatPrice(cartTotal)}</strong>
      </Link>
    </>
  );
}

function HeaderAction({ href, icon, label, count }: { href: string; icon: ReactNode; label: string; count?: number }) {
  return (
    <Link href={href} className="relative grid justify-items-center gap-1 text-[20px]">
      <span className="[&>svg]:h-9 [&>svg]:w-9 [&>svg]:stroke-[2]">{icon}</span>
      {typeof count === "number" && count > 0 ? <b className="absolute right-4 top-0 grid h-6 min-w-6 place-items-center rounded-full bg-brand-orange px-1 text-sm text-white">{count}</b> : null}
      <span>{label}</span>
    </Link>
  );
}
