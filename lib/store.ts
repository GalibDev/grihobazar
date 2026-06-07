import { createClient } from "@supabase/supabase-js";
import type { Banner, Category, Order, Product, StoreData, StoreSettings } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

const defaultCategories: Category[] = [
  { title: "Oil & Ghee", slug: "oil-ghee", image: "https://backoffice.ghorerbazar.com/category_images/Zf99g1774766372.png" },
  { title: "Organic", slug: "organic", image: "https://backoffice.ghorerbazar.com/category_images/HJOrw1774766749.png" },
  { title: "Honey", slug: "honey", image: "https://backoffice.ghorerbazar.com/category_images/KbWCe1774766391.png" },
  { title: "Dates", slug: "dates", image: "https://backoffice.ghorerbazar.com/category_images/wgCR01774766402.png" },
  { title: "Spices", slug: "spices", image: "https://backoffice.ghorerbazar.com/category_images/hXyU71774766413.png" },
  { title: "Nuts & Seeds", slug: "nuts-seeds", image: "https://backoffice.ghorerbazar.com/category_images/5u39t1774766425.png" },
  { title: "Mango", slug: "mango", image: "https://backoffice.ghorerbazar.com/productImages/gOT1X1779006694.jpg" },
  { title: "Flours & Lentils", slug: "flours-lentils", image: "https://backoffice.ghorerbazar.com/productImages/XA6LK1767439665.jpg" },
  { title: "Exclusive Combo Deals", slug: "exclusive-combo-deals", image: "/placeholders/product.svg" },
  { title: "Cooking Essentials", slug: "cooking-essentials", image: "/placeholders/product.svg" },
  { title: "Organic Certified", slug: "organic-certified", image: "/placeholders/product.svg" },
  { title: "Just For You", slug: "just-for-you", image: "/placeholders/product.svg" },
  { title: "Our Brands", slug: "our-brands", image: "/placeholders/product.svg" },
];

const defaultProducts: Product[] = [
  { id: "sundarban-honey-1kg", title: "Sundarban Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/CvT2N1767414529.jpg", price: 2300, oldPrice: 2500, badge: "Save Tk 200", badgeTone: "green", featured: true, stock: "in" },
  { id: "gawa-ghee-1kg", title: "Gawa Ghee 1kg", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/VvzII1767097227.jpg", price: 1800, badge: "Best Selling", badgeTone: "red", featured: true, stock: "in" },
  { id: "black-seed-honey-1kg", title: "Black Seed Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/fAewT1767418525.jpg", price: 1500, oldPrice: 1600, badge: "Save Tk 100", badgeTone: "green", stock: "in" },
  { id: "mustard-oil-5l", title: "Deshi Mustard Oil 5 liter", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/vkVdH1767248022.jpg", price: 1550, badge: "Best Selling", badgeTone: "red", stock: "in" },
  { id: "himsagar-mango-25kg", title: "Himsagar Mango-25 kg", category: "Mango", image: "https://backoffice.ghorerbazar.com/productImages/gOT1X1779006694.jpg", price: 3750, oldPrice: 4000, badge: "Save 6%", badgeTone: "green", stock: "preorder" },
  { id: "african-honey-500g", title: "African Organic Wild Honey 500g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/g7Qx11775107164.jpg", price: 1100, oldPrice: 1250, badge: "Save 12%", badgeTone: "green", stock: "in" },
  { id: "medjool-large-1kg", title: "Egyptian Medjool Large 1kg", category: "Dates", image: "https://backoffice.ghorerbazar.com/productImages/YOL6J1767074338.jpg", price: 1984, oldPrice: 2200, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "chili-powder-500g", title: "Chili (Morich) Powder 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/j32Ba1767262660.jpg", price: 400, stock: "in" },
  { id: "rice-flour-2kg", title: "Rice Flour (Chaler Gura) 2kg", category: "Flours & Lentils", image: "https://backoffice.ghorerbazar.com/productImages/XA6LK1767439665.jpg", price: 200, stock: "in" },
  { id: "spirulina-250g", title: "Organic Spirulina Powder 250 gm", category: "Organic", image: "https://backoffice.ghorerbazar.com/productImages/Ba33d1767588217.jpg", price: 1140, oldPrice: 1200, badge: "New Arrival", badgeTone: "orange", stock: "in" },
];

const defaultBanners: Banner[] = [
  { id: "mango-hero", title: "Mango offer", image: "https://backoffice.ghorerbazar.com/banner/hSjx41780379939-dark-1000x400.png", mobileImage: "https://backoffice.ghorerbazar.com/banner/Gcahd1780379939-dark-500x280.png", category: "Mango", active: true },
  { id: "dates-hero", title: "Dates collection", image: "https://backoffice.ghorerbazar.com/banner/sCUkg1774768074-dark.png", mobileImage: "https://backoffice.ghorerbazar.com/banner/I2Vto1774768074-dark.png", category: "Dates", active: true },
  { id: "honey-hero", title: "Honey collection", image: "https://backoffice.ghorerbazar.com/banner/wvLKI1771837751.jpeg", mobileImage: "https://backoffice.ghorerbazar.com/banner/3ANBj1767529509.jpg", category: "Honey", active: true },
];

const defaultSettings: StoreSettings = {
  insideDhakaDelivery: 80,
  outsideDhakaDelivery: 130,
  pickupDelivery: 0,
  bkashNumber: "01XXXXXXXXX",
  nagadNumber: "01XXXXXXXXX",
  whatsappNumber: "8809642922922",
};

let seeded = false;

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    image: String(row.image),
    price: Number(row.price),
    oldPrice: row.old_price === null ? undefined : Number(row.old_price),
    badge: row.badge === null ? undefined : String(row.badge),
    badgeTone: row.badge_tone === null ? undefined : row.badge_tone as Product["badgeTone"],
    stock: row.stock as Product["stock"],
    featured: Boolean(row.featured),
  };
}

function toProductRow(product: Product) {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    image: product.image,
    price: product.price,
    old_price: product.oldPrice ?? null,
    badge: product.badge ?? null,
    badge_tone: product.badgeTone ?? null,
    stock: product.stock ?? "in",
    featured: Boolean(product.featured),
  };
}

function mapBanner(row: Record<string, unknown>): Banner {
  return {
    id: String(row.id),
    title: String(row.title),
    image: String(row.image),
    mobileImage: row.mobile_image === null ? undefined : String(row.mobile_image),
    category: String(row.category),
    active: Boolean(row.active),
  };
}

function toBannerRow(banner: Banner) {
  return {
    id: banner.id,
    title: banner.title,
    image: banner.image,
    mobile_image: banner.mobileImage ?? null,
    category: banner.category,
    active: Boolean(banner.active),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    note: row.note === null ? undefined : String(row.note),
    status: row.status as Order["status"],
    paymentMethod: row.payment_method as Order["paymentMethod"],
    paymentStatus: row.payment_status as Order["paymentStatus"],
    paymentTransactionId: row.payment_transaction_id === null ? undefined : String(row.payment_transaction_id),
    deliveryCharge: Number(row.delivery_charge),
    trackingCode: String(row.tracking_code),
    items: Array.isArray(row.items) ? row.items as Order["items"] : JSON.parse(String(row.items)) as Order["items"],
    total: Number(row.total),
    createdAt: String(row.created_at),
  };
}

function toOrderRow(order: Order) {
  return {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    note: order.note ?? null,
    status: order.status,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    payment_transaction_id: order.paymentTransactionId ?? null,
    delivery_charge: order.deliveryCharge,
    tracking_code: order.trackingCode,
    items: order.items,
    total: order.total,
    created_at: order.createdAt,
  };
}

function toSettingsRows(settings: StoreSettings) {
  return Object.entries(settings).map(([key, value]) => ({ key, value: String(value) }));
}

async function seedDatabase() {
  if (seeded) return;
  seeded = true;

  const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });
  if (error) {
    throw new Error(`Supabase schema missing. Run supabase/schema.sql first. ${error.message}`);
  }

  await supabase.from("categories").upsert(defaultCategories);

  if ((count ?? 0) > 0) return;

  await supabase.from("products").upsert(defaultProducts.map(toProductRow));
  await supabase.from("banners").upsert(defaultBanners.map(toBannerRow));
  await supabase.from("settings").upsert(toSettingsRows(defaultSettings));
}

async function readSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;

  const settings = { ...defaultSettings };
  (data ?? []).forEach((row) => {
    const key = row.key as keyof StoreSettings;
    if (key === "insideDhakaDelivery" || key === "outsideDhakaDelivery" || key === "pickupDelivery") {
      settings[key] = Number(row.value) as never;
    } else {
      settings[key] = String(row.value) as never;
    }
  });

  return settings;
}

export async function readStore(): Promise<StoreData> {
  await seedDatabase();

  const [productsResult, categoriesResult, bannersResult, ordersResult, settings] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("banners").select("*").order("created_at", { ascending: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    readSettings(),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;
  if (bannersResult.error) throw bannersResult.error;
  if (ordersResult.error) throw ordersResult.error;

  return {
    products: (productsResult.data ?? []).map(mapProduct),
    categories: categoriesResult.data ?? [],
    banners: (bannersResult.data ?? []).map(mapBanner),
    settings,
    orders: (ordersResult.data ?? []).map(mapOrder),
  };
}

export async function writeStore(data: StoreData) {
  await seedDatabase();

  await supabase.from("products").delete().neq("id", "__never__");
  await supabase.from("categories").delete().neq("slug", "__never__");
  await supabase.from("banners").delete().neq("id", "__never__");
  await supabase.from("orders").delete().neq("id", "__never__");
  await supabase.from("settings").delete().neq("key", "__never__");

  if (data.categories.length) await supabase.from("categories").upsert(data.categories);
  if (data.products.length) await supabase.from("products").upsert(data.products.map(toProductRow));
  if (data.banners.length) await supabase.from("banners").upsert(data.banners.map(toBannerRow));
  if (data.orders.length) await supabase.from("orders").upsert(data.orders.map(toOrderRow));
  await supabase.from("settings").upsert(toSettingsRows(data.settings));
}

export async function uploadProductImage(fileName: string, bytes: Buffer, contentType: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
  const { error } = await supabase.storage.from(bucket).upload(fileName, bytes, {
    contentType,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export function makeId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeOrderId() {
  return `GB-${Date.now().toString(36).toUpperCase()}`;
}

export function makeTrackingCode() {
  return `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export type { Order, Product, StoreData };
