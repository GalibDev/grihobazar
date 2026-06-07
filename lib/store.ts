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

const liveCategorySeedProducts: Product[] = [
  { id: "combo-half-ghee", title: "Ghee (Half Kg) & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/1Xbv0tpGtgeSD6T0BHNp5daunFfZTAeDk9Qg76Eb.jpg", price: 1000, oldPrice: 1140, badge: "Save 12.3%", badgeTone: "green", stock: "in" },
  { id: "combo-ghee-1kg", title: "Ghee (1 Kg) & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/eHFlh1X3A3xFiWdXUe2kXfVtaY5Ei77wEtlnC9fB.jpg", price: 1800, oldPrice: 2040, badge: "Save 11.8%", badgeTone: "green", stock: "in" },
  { id: "combo-shahi-masala", title: "Shahi Masala & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/v2mWnfZX4GmmR0tFAT1KVpVwhEGS6F7H1BaRCPHJ.jpg", price: 1500, oldPrice: 1740, badge: "Save 13.8%", badgeTone: "green", stock: "in" },
  { id: "combo-kala-bhuna", title: "Kala Bhuna & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/v2mWnfZX4GmmR0tFAT1KVpVwhEGS6F7H1BaRCPHJ.jpg", price: 1500, oldPrice: 1740, badge: "Save 13.8%", badgeTone: "green", stock: "in" },
  { id: "combo-mustard-oil", title: "Mustard Oil & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/JmSEKuQ77LS2jBtQzhbqulglNPM9YIfOC3lS9sB6.jpg", price: 1600, oldPrice: 1790, badge: "Save 10.6%", badgeTone: "green", stock: "in" },
  { id: "combo-black-cumin-oil", title: "Black Cumin Seed Oil & Lychee Honey Sachet Combo", category: "Exclusive Combo Deals", image: "https://backoffice.ghorerbazar.com/storage/combos/JmSEKuQ77LS2jBtQzhbqulglNPM9YIfOC3lS9sB6.jpg", price: 2500, oldPrice: 2740, badge: "Save 8.8%", badgeTone: "green", stock: "in" },
  { id: "brand-honeyraj", title: "Honeyraj", category: "Our Brands", image: "https://backoffice.ghorerbazar.com/brand_images/7hNKq1768887947.png", price: 1, stock: "in" },
  { id: "brand-shosti", title: "Shosti", category: "Our Brands", image: "https://backoffice.ghorerbazar.com/brand_images/RNTIU1763611802.png", price: 1, stock: "in" },
  { id: "brand-ghorer-bazar", title: "Ghorer Bazar", category: "Our Brands", image: "https://backoffice.ghorerbazar.com/brand_images/M89ch1768888003.png", price: 1, stock: "in" },
  { id: "brand-glarvest", title: "Glarvest", category: "Our Brands", image: "https://backoffice.ghorerbazar.com/brand_images/wPRK91768888154.png", price: 1, stock: "in" },
  { id: "brand-tabaya", title: "Tabaya", category: "Our Brands", image: "https://backoffice.ghorerbazar.com/brand_images/YuK9J1768888227.png", price: 1, stock: "in" },
];

const liveSpicesNutsSeedProducts: Product[] = [
  { id: "chili-morich-powder-500g", title: "Chili (Morich) Powder 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/j32Ba1767262660.jpg", price: 400, stock: "in" },
  { id: "turmeric-holud-powder-500g", title: "Turmeric (Holud) Powder 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/GuI2U1767262030.jpg", price: 295, stock: "in" },
  { id: "coriander-powder-500gm", title: "Coriander Powder 500gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/hYhgA1767262598.jpg", price: 240, stock: "in" },
  { id: "kala-bhuna-masala-500gm", title: "Kala Bhuna Masala-500gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/t44nb1767261833.jpg", price: 1350, oldPrice: 1500, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "shahi-masala-500gm", title: "Shahi Masala 500gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/TrEmJ1767101265.jpg", price: 1350, oldPrice: 1500, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "cumin-jira-powder-500gm", title: "Cumin (Jira) Powder 500gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/gkojl1767262517.jpg", price: 880, stock: "in" },
  { id: "kala-bhuna-masala-250gm", title: "Kala Bhuna Masala-250gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/Hexa11767261902.jpg", price: 675, oldPrice: 750, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "black-cardamom-200g", title: "Black Cardamom 200g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/MiZu11767260879.jpg", price: 700, stock: "in" },
  { id: "gura-masala-combo-mini-pack", title: "Gura Masala Combo (Mini Pack)", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/BVB2a1767100552.jpg", price: 950, oldPrice: 985, badge: "Save 4%", badgeTone: "green", stock: "in" },
  { id: "shahi-masala-250gm", title: "Shahi Masala 250gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/aSOoS1767779077.jpg", price: 675, oldPrice: 750, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "white-pepper-200g", title: "White Pepper 200g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/KC6on1767260635.jpg", price: 700, stock: "in" },
  { id: "shahi-masala-combo", title: "Shahi Masala Combo", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/Nly4i1767100328.jpg", price: 1600, oldPrice: 1700, badge: "Save 6%", badgeTone: "green", stock: "in" },
  { id: "shahi-masala-100g", title: "Shahi Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/agItn1778758616.png", price: 300, stock: "in" },
  { id: "cinnamon-200g", title: "Cinnamon 200g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/SaUyH1767261091.jpg", price: 400, stock: "in" },
  { id: "masala-combo", title: "Masala Combo", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/x3RSK1767249608.jpg", price: 1700, oldPrice: 1785, badge: "Save 5%", badgeTone: "green", stock: "in" },
  { id: "panch-foron-50g", title: "Panch Foron 50g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/fn9f51778742184.png", price: 30, stock: "in" },
  { id: "chaat-masala-100g", title: "Chaat Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/fOcTg1778742108.png", price: 160, stock: "in" },
  { id: "turmeric-holud-powder-250g", title: "Turmeric (Holud) Powder 250g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/36x6e1767262411.jpg", price: 155, stock: "in" },
  { id: "cardamom-100g", title: "Cardamom 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/bkc581767261015.jpg", price: 750, stock: "in" },
  { id: "fish-curry-masala-100g", title: "Fish Curry Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/5G74w1778742057.png", price: 80, stock: "in" },
  { id: "chili-morich-powder-250g", title: "Chili (Morich) Powder 250g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/eEm5D1771737328.jpg", price: 220, stock: "in" },
  { id: "coriander-500g", title: "Coriander 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/4wi5y1767259113.jpg", price: 225, stock: "in" },
  { id: "muttonbeef-curry-masala-100g", title: "Mutton/Beef Curry Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/zzYbk1778742001.png", price: 100, stock: "in" },
  { id: "cumin-jira-powder-250gm", title: "Cumin (Jira) Powder 250gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/FA8kg1771390221.jpg", price: 460, stock: "in" },
  { id: "tehari-masala-40g", title: "Tehari Masala 40g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/1lLzD1778741794.png", price: 60, stock: "in" },
  { id: "coriander-powder-250gm", title: "Coriander Powder 250gm", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/4OFec1771390023.jpg", price: 130, stock: "in" },
  { id: "kacchi-biriyani-masala-40g", title: "Kacchi Biriyani Masala 40g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/vqA8h1778741717.png", price: 70, stock: "in" },
  { id: "bbq-masala-50g", title: "BBQ Masala 50g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/nPs9f1778741500.png", price: 80, stock: "in" },
  { id: "cumin-500g", title: "Cumin 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/YYo901767589406.jpg", price: 600, stock: "in" },
  { id: "meat-curry-masala-100g", title: "Meat Curry Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/5RSD31778741380.png", price: 100, stock: "in" },
  { id: "biryani-masala-40g", title: "Biryani Masala 40g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/XSNCo1778741300.png", price: 60, stock: "in" },
  { id: "chicken-masala-100g", title: "Chicken Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/PTc8V1778741217.png", price: 100, stock: "in" },
  { id: "kala-bhuna-masala-100g", title: "Kala Bhuna Masala 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/rEIW21778740478.png", price: 300, stock: "in" },
  { id: "mace-100g", title: "Mace 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/E5CYl1767258964.jpg", price: 600, stock: "in" },
  { id: "star-anise-100g", title: "Star Anise 100g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/k2mhM1767260724.jpg", price: 550, stock: "in" },
  { id: "black-pepper-200g", title: "Black Pepper 200g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/m6Brm1767260570.jpg", price: 500, stock: "in" },
  { id: "clove-200g", title: "Clove 200g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/KzwkX1767259367.jpg", price: 650, stock: "in" },
  { id: "methi-500g", title: "Methi 500g", category: "Spices", image: "https://backoffice.ghorerbazar.com/productImages/TsuAa1767259209.jpg", price: 250, stock: "in" },
  { id: "honey-nuts-800gm", title: "Honey Nuts 800gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/4BTRl1767443347.jpg", price: 1500, badge: "Best Selling", badgeTone: "orange", stock: "in" },
  { id: "almond-1kg", title: "Almond 1kg", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/IvsiP1767095664.jpg", price: 1500, stock: "in" },
  { id: "walnut-250gm", title: "Walnut 250gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/mGGzp1767587913.jpg", price: 500, stock: "in" },
  { id: "walnut-1kg", title: "Walnut 1kg", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/7ruzF1767591190.jpg", price: 1800, stock: "in" },
  { id: "almond-250g", title: "Almond 250g", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/tdtHB1767096113.jpg", price: 400, stock: "in" },
  { id: "cashew-nuts-medium-size-250g", title: "Cashew Nuts Medium Size 250g", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/U970T1767096491.jpg", price: 550, stock: "in" },
  { id: "cashew-nut-medium-size-500gm", title: "Cashew Nuts Medium Size 500gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/6e55t1767441512.jpg", price: 1000, stock: "in" },
  { id: "honey-nuts-500gm", title: "Honey Nuts 500gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/1ubAo1767443414.jpg", price: 1000, stock: "in" },
  { id: "walnut-500gm", title: "Walnut 500gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/HsQQ51767096867.jpg", price: 900, stock: "in" },
  { id: "almond-500gm", title: "Almond 500gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/T6QIT1767095834.jpg", price: 750, stock: "in" },
  { id: "black-cumin-kalojira-1kg", title: "Black Cumin (Kalojira) 1kg", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/DxUUp1767441748.jpg", price: 1000, stock: "in" },
  { id: "black-cumin-kalojira-500gm", title: "Black Cumin (Kalojira) 500gm", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/zG2Lz1767441659.jpg", price: 500, stock: "in" },
  { id: "local-mustard-seed-500g", title: "Local Mustard Seed 500g", category: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/productImages/GitND1767515685.jpg", price: 165, stock: "in" },
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
  await seedLiveCategoryProducts();

  if ((count ?? 0) > 0) {
    await seedLiveSpicesNutsProducts();
    return;
  }

  await supabase.from("products").upsert(defaultProducts.map(toProductRow));
  await supabase.from("banners").upsert(defaultBanners.map(toBannerRow));
  await supabase.from("settings").upsert(toSettingsRows(defaultSettings));
  await seedLiveSpicesNutsProducts();
}

async function seedLiveCategoryProducts() {
  const seedKey = "liveCategorySeed20260607";
  const { data: existingSeed, error: seedError } = await supabase.from("settings").select("value").eq("key", seedKey).maybeSingle();
  if (seedError) throw seedError;
  if (existingSeed) return;

  const seedIds = liveCategorySeedProducts.map((product) => product.id);
  const { data: existingProducts, error: productError } = await supabase.from("products").select("id").in("id", seedIds);
  if (productError) throw productError;

  const existingIds = new Set((existingProducts ?? []).map((product) => String(product.id)));
  const missingProducts = liveCategorySeedProducts.filter((product) => !existingIds.has(product.id));
  if (missingProducts.length) {
    const { error } = await supabase.from("products").insert(missingProducts.map(toProductRow));
    if (error) throw error;
  }

  await supabase.from("settings").upsert({ key: seedKey, value: new Date().toISOString() });
}

async function seedLiveSpicesNutsProducts() {
  const seedKey = "liveSpicesNutsSeed20260607";
  const { data: existingSeed, error: seedError } = await supabase.from("settings").select("value").eq("key", seedKey).maybeSingle();
  if (seedError) throw seedError;
  if (existingSeed) return;

  const { data: existingProducts, error: productError } = await supabase.from("products").select("id,title");
  if (productError) throw productError;

  const existingIds = new Set((existingProducts ?? []).map((product) => String(product.id)));
  const existingTitles = new Set((existingProducts ?? []).map((product) => String(product.title).toLowerCase()));
  const missingProducts = liveSpicesNutsSeedProducts.filter((product) => !existingIds.has(product.id) && !existingTitles.has(product.title.toLowerCase()));
  if (missingProducts.length) {
    const { error } = await supabase.from("products").insert(missingProducts.map(toProductRow));
    if (error) throw error;
  }

  await supabase.from("settings").upsert({ key: seedKey, value: new Date().toISOString() });
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
