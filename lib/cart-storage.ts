import type { Product } from "./types";

export type StoredCartItem = Product & { quantity: number };

export const cartStorageKey = "grihobazar_cart";

export function readCart(): StoredCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]") as StoredCartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: StoredCartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("grihobazar-cart"));
}

export function addCartItem(product: Product, quantity = 1) {
  const current = readCart();
  const existing = current.find((item) => item.id === product.id);
  const next = existing
    ? current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
    : [...current, { ...product, quantity }];

  writeCart(next);
  return next;
}

export function setCartQuantity(productId: string, quantity: number) {
  const next = readCart()
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(next);
  return next;
}
