import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import type { Category, Order, OrderItem, Product, StoreData } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "grihobazar.db");

mkdirSync(dataDir, { recursive: true });

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

const categories: Category[] = [
  { title: "Oil & Ghee", slug: "oil-ghee", image: "https://backoffice.ghorerbazar.com/category_images/Zf99g1774766372.png" },
  { title: "Organic", slug: "organic", image: "https://backoffice.ghorerbazar.com/category_images/HJOrw1774766749.png" },
  { title: "Honey", slug: "honey", image: "https://backoffice.ghorerbazar.com/category_images/KbWCe1774766391.png" },
  { title: "Dates", slug: "dates", image: "https://backoffice.ghorerbazar.com/category_images/wgCR01774766402.png" },
  { title: "Spices", slug: "spices", image: "https://backoffice.ghorerbazar.com/category_images/hXyU71774766413.png" },
  { title: "Nuts & Seeds", slug: "nuts-seeds", image: "https://backoffice.ghorerbazar.com/category_images/5u39t1774766425.png" },
  { title: "Mango", slug: "mango", image: "https://backoffice.ghorerbazar.com/productImages/gOT1X1779006694.jpg" },
  { title: "Flours & Lentils", slug: "flours-lentils", image: "https://backoffice.ghorerbazar.com/productImages/XA6LK1767439665.jpg" },
];

const products: Product[] = [
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

type ProductRow = Omit<Product, "featured"> & { featured: 0 | 1 };
type OrderRow = Omit<Order, "items"> & { items: string };

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    price INTEGER NOT NULL,
    oldPrice INTEGER,
    badge TEXT,
    badgeTone TEXT,
    stock TEXT DEFAULT 'in',
    featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    status TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    paymentStatus TEXT NOT NULL,
    deliveryCharge INTEGER NOT NULL,
    trackingCode TEXT NOT NULL,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

seedDatabase();

function toProductRecord(item: Product) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    price: item.price,
    oldPrice: item.oldPrice ?? null,
    badge: item.badge ?? null,
    badgeTone: item.badgeTone ?? null,
    stock: item.stock ?? "in",
    featured: item.featured ? 1 : 0,
  };
}

function toOrderRecord(item: Order) {
  return {
    id: item.id,
    customerName: item.customerName,
    phone: item.phone,
    address: item.address,
    status: item.status,
    paymentMethod: item.paymentMethod ?? "cash",
    paymentStatus: item.paymentStatus ?? "unpaid",
    deliveryCharge: item.deliveryCharge ?? 0,
    trackingCode: item.trackingCode ?? item.id,
    items: JSON.stringify(item.items),
    total: item.total,
    createdAt: item.createdAt,
  };
}

function seedDatabase() {
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };

  if (categoryCount.count === 0) {
    const insertCategory = db.prepare("INSERT INTO categories (slug, title, image) VALUES (@slug, @title, @image)");
    const insertMany = db.transaction((items: Category[]) => items.forEach((item) => insertCategory.run(item)));
    insertMany(categories);
  }

  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, title, category, image, price, oldPrice, badge, badgeTone, stock, featured)
      VALUES (@id, @title, @category, @image, @price, @oldPrice, @badge, @badgeTone, @stock, @featured)
    `);
    const insertMany = db.transaction((items: Product[]) => {
      items.forEach((item) => insertProduct.run(toProductRecord(item)));
    });
    insertMany(products);
  }
}

function mapProduct(row: ProductRow): Product {
  return {
    ...row,
    oldPrice: row.oldPrice ?? undefined,
    badge: row.badge ?? undefined,
    badgeTone: row.badgeTone ?? undefined,
    stock: row.stock ?? "in",
    featured: Boolean(row.featured),
  };
}

function mapOrder(row: OrderRow): Order {
  return {
    ...row,
    items: JSON.parse(row.items) as OrderItem[],
    status: row.status as Order["status"],
    paymentMethod: row.paymentMethod as Order["paymentMethod"],
    paymentStatus: row.paymentStatus as Order["paymentStatus"],
  };
}

export async function readStore(): Promise<StoreData> {
  const productRows = db.prepare("SELECT * FROM products ORDER BY rowid DESC").all() as ProductRow[];
  const categoryRows = db.prepare("SELECT * FROM categories ORDER BY rowid ASC").all() as Category[];
  const orderRows = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as OrderRow[];

  return {
    products: productRows.map(mapProduct),
    categories: categoryRows,
    orders: orderRows.map(mapOrder),
  };
}

export async function writeStore(data: StoreData) {
  const replace = db.transaction((nextData: StoreData) => {
    db.prepare("DELETE FROM products").run();
    db.prepare("DELETE FROM categories").run();
    db.prepare("DELETE FROM orders").run();

    const insertProduct = db.prepare(`
      INSERT INTO products (id, title, category, image, price, oldPrice, badge, badgeTone, stock, featured)
      VALUES (@id, @title, @category, @image, @price, @oldPrice, @badge, @badgeTone, @stock, @featured)
    `);
    const insertCategory = db.prepare("INSERT INTO categories (slug, title, image) VALUES (@slug, @title, @image)");
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customerName, phone, address, status, paymentMethod, paymentStatus, deliveryCharge, trackingCode, items, total, createdAt)
      VALUES (@id, @customerName, @phone, @address, @status, @paymentMethod, @paymentStatus, @deliveryCharge, @trackingCode, @items, @total, @createdAt)
    `);

    nextData.products.forEach((item) => insertProduct.run(toProductRecord(item)));
    nextData.categories.forEach((item) => insertCategory.run(item));
    nextData.orders.forEach((item) => insertOrder.run(toOrderRecord(item)));
  });

  replace(data);
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
