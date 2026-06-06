"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Heart, MapPin, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { readCart } from "@/lib/cart-storage";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const formatPrice = (price: number) => `\u09f3${price.toLocaleString("en-US")}`;

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
        <div className="mx-auto grid h-[85px] max-w-[1200px] grid-cols-[140px_500px_400px] items-center justify-between gap-0 px-0 xl:w-[calc(100%-240px)]">
          <Link href="/" aria-label="Griho Bazar home">
            <img className="w-[140px]" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
          </Link>
          <label className="relative block">
            <input className="h-[45px] w-full rounded bg-[#f5f5f5] px-5 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-brand-orange/30" placeholder="Search in..." />
            <Search className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-ink" />
          </label>
          <div className="flex h-[45px] items-center justify-between text-brand-ink">
            <HeaderAction href="/track/order" icon={<MapPin />} label="Track Order" />
            <HeaderAction href="/admin/login" icon={<UserRound />} label="Sign In" />
            <HeaderAction href="/" icon={<Heart />} label="Wishlist" />
            <HeaderAction href="/cart" icon={<ShoppingCart />} label="Cart" count={cartCount} />
            <HeaderAction href="/" icon={<Menu />} label="More" />
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-[#002c26] text-white">
        <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between gap-4 overflow-x-auto px-0 text-[14px] font-medium [scrollbar-width:none] xl:w-[calc(100%-240px)] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <div key={item.title} className="group relative flex h-full shrink-0 items-center">
              <Link href={item.href} className="flex items-center gap-2 hover:text-brand-orange">
                {item.title}
                {item.children ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              </Link>
              {item.children ? (
                <div className="invisible fixed top-[135px] z-40 min-w-[260px] bg-white py-2 text-[14px] font-normal text-[#666] opacity-0 shadow-float transition group-hover:visible group-hover:opacity-100">
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

      <Link href="/cart" className="fixed right-0 top-1/2 z-30 hidden w-[70px] -translate-y-1/2 overflow-hidden rounded-l-lg bg-white text-center shadow-float lg:block">
        <span className="grid h-[56px] bg-brand-orange px-1 py-2 text-white">
          <ShoppingCart className="mx-auto h-5 w-5" />
          <span className="text-sm font-semibold">{cartCount} Items</span>
        </span>
        <strong className="block h-[29px] px-1 py-1.5 text-base text-brand-orange">{formatPrice(cartTotal)}</strong>
      </Link>
    </>
  );
}

function HeaderAction({ href, icon, label, count }: { href: string; icon: ReactNode; label: string; count?: number }) {
  return (
    <Link href={href} className="relative grid justify-items-center gap-0.5 text-[13px]">
      <span className="[&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-[2]">{icon}</span>
      {typeof count === "number" && count > 0 ? <b className="absolute right-4 top-0 grid h-6 min-w-6 place-items-center rounded-full bg-brand-orange px-1 text-sm text-white">{count}</b> : null}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}
