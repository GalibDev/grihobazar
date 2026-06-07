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
  { title: "Beverage", slug: "beverage", image: "/placeholders/product.svg" },
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

const liveOilHoneyBeverageOrganicSeedProducts: Product[] = [
  { id: "local-maghi-sarisha-oil-5-ltr", title: "Deshi Mustard Oil 5 liter", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/vkVdH1767248022.jpg", price: 1550, badge: "Best Selling", badgeTone: "orange", stock: "in" },
  { id: "gawa-ghee-1kg", title: "Gawa Ghee 1kg", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/VvzII1767097227.jpg", price: 1700, oldPrice: 1800, badge: "Save 6%", badgeTone: "green", stock: "in" },
  { id: "shosti-ghee-500gm", title: "Gawa Ghee 500gm", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/l4UhS1767097338.jpg", price: 850, oldPrice: 900, badge: "Save 6%", badgeTone: "green", stock: "in" },
  { id: "deshi-mustard-oil-2ltr", title: "Deshi Mustard Oil 2 liter", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/xZ5261767248563.jpg", price: 620, stock: "in" },
  { id: "gawa-ghee-400gm", title: "Gawa Ghee 400gm", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/hTKy21767012358.jpg", price: 720, stock: "in" },
  { id: "organic-extra-virgin-coconut-oil-1ltr", title: "Organic Extra Virgin Coconut Oil 1ltr", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/WzvLW1771392026.jpg", price: 2030, stock: "in" },
  { id: "gawa-ghee-200gm", title: "Gawa Ghee 200gm", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/RH0a31767012545.jpg", price: 360, stock: "in" },
  { id: "organic-extra-virgin-coconut-oil-500ml", title: "Organic Extra Virgin Coconut Oil 500ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/BQ2SU1771304187.jpg", price: 1230, stock: "in" },
  { id: "local-kalijira-oil-500ml", title: "Black Cumin Seed Oil 500ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/PvMzG1767099936.jpg", price: 1250, stock: "in" },
  { id: "deshi-mustard-oil-1ltr", title: "Deshi Mustard Oil 1 liter", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/ETt5J1767248095.jpg", price: 310, stock: "in" },
  { id: "palermo-extra-virgin-olive-oil-in-dark-marasca-glass-bottle-1-ltr-2", title: "Palermo Extra Virgin Olive Oil In Dark Marasca Glass Bottle 1 Ltr.", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/QvRXJ1773215972.jpg", price: 2499, stock: "in" },
  { id: "local-kalijira-oil-1ltr", title: "Black Cumin Seed Oil 1ltr", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/dOEzT1767099850.jpg", price: 2500, stock: "in" },
  { id: "gawa-ghee-250gm", title: "Gawa Ghee 250gm", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/PpKUt1767012456.jpg", price: 450, stock: "in" },
  { id: "applied-nutrition-mct-oil-490-ml", title: "Applied Nutrition MCT Oil 490 ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/yKJ2k1777289453.jpg", price: 4650, stock: "in" },
  { id: "olitalia-pomace-olive-oil-500ml", title: "Olitalia Pomace Olive Oil 500ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/QsruT1767264667.jpg", price: 1150, stock: "in" },
  { id: "palermo-organic-extra-virgin-olive-oil-1ltr", title: "Palermo Organic Extra virgin Olive oil 1ltr", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/6Utax1778321314.jpg", price: 2999, stock: "in" },
  { id: "olitalia-pomace-olive-oil-250ml", title: "Olitalia Pomace Olive Oil 250ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/qXWcs1767264944.jpg", price: 750, stock: "in" },
  { id: "glarvest-organic-extra-virgin-olive-oil-5000-ml", title: "Glarvest Organic Extra Virgin Olive Oil 5000 ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/eeiO51767097933.jpg", price: 11000, stock: "out" },
  { id: "deshi-mustard-oil-500ml", title: "Deshi Mustard Oil 500 ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/Nloeg1767248447.jpg", price: 155, stock: "in" },
  { id: "local-kalijira-oil-250ml", title: "Black Cumin Seed Oil 250ml", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/B9QpI1767100108.jpg", price: 625, stock: "in" },
  { id: "palermo-extra-virgin-olive-oil-in-tin-5-ltr", title: "Palermo Extra Virgin Olive Oil In Tin 5 Ltr", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/Hq9H21777788826.jpg", price: 11299, stock: "out" },
  { id: "palermo-organic-extra-virgin-olive-oil-5ltr", title: "Palermo Organic Extra Virgin Olive Oil 5ltr", category: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/productImages/1oNuT1777788069.jpg", price: 13499, stock: "out" },
  { id: "sundarban-honey", title: "Sundarban Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/CvT2N1767414529.jpg", price: 2300, oldPrice: 2500, badge: "Save 8%", badgeTone: "green", stock: "in" },
  { id: "african-organic-wild-honey-500g", title: "African Organic Wild Honey 500g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/g7Qx11775107164.jpg", price: 1100, oldPrice: 1250, badge: "Save 12%", badgeTone: "green", stock: "in" },
  { id: "black-seed-honey-500g", title: "Black Seed Honey 500g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/JdeWl1767418564.jpg", price: 750, oldPrice: 800, badge: "Save 6%", badgeTone: "green", stock: "in" },
  { id: "natural-honeycomb-1kg", title: "Natural Honeycomb- 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/8ZFYk1767532058.jpg", price: 2250, oldPrice: 2500, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "lichu-fuler-modhu-500-gm", title: "Lychee Flower Honey 500g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/TtgOl1767418640.jpg", price: 550, oldPrice: 600, badge: "Save 8%", badgeTone: "green", stock: "in" },
  { id: "kashmiri-sidr-honey-800g", title: "Kashmiri Sidr Honey 800g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/OY4JB1768121526.jpg", price: 1800, oldPrice: 2000, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "lichu-flower-honey-1kg", title: "Lychee Flower Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/A14zf1767418585.jpg", price: 1100, oldPrice: 1200, badge: "Save 8%", badgeTone: "green", stock: "in" },
  { id: "sundarban-honey-15g-x-24-pcs-box", title: "Sundarban Honey 15g X 24 pcs (BOX)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/xtAP01776075952.png", price: 768, stock: "in" },
  { id: "sundarban-honey-500gm", title: "Sundarban Honey 500 gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/jaJ6i1767418800.jpg", price: 1150, oldPrice: 1250, badge: "Save 8%", badgeTone: "green", stock: "in" },
  { id: "lychee-flower-honey-15g-x-24-pcs-box", title: "Lychee Flower Honey 15g X 24 pcs (BOX)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/UxodJ1776075897.png", price: 432, stock: "in" },
  { id: "sundarban-honey-8g-x-24-pcs-box", title: "Sundarban Honey 8g X 24 pcs (BOX)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/omV471776075964.png", price: 432, stock: "in" },
  { id: "lychee-flower-honey-8g-x-24-pcs-box", title: "Lychee Flower Honey 8g X 24 pcs (BOX)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/tpOaP1776075938.png", price: 240, stock: "in" },
  { id: "african-organic-wild-honey-250g", title: "African Organic Wild Honey 250g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/htkho1767418769.jpg", price: 625, stock: "in" },
  { id: "crystal-honey-2kg", title: "Crystal Honey 2kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/4hJVs1767855299.jpg", price: 2000, oldPrice: 2200, badge: "Save 9%", badgeTone: "green", stock: "in" },
  { id: "honeyraj-mixed-flower-honey-with-honeycomb-500g", title: "Mixed Flower Honey with Comb 500g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/0ldaX1767531519.jpg", price: 900, oldPrice: 1000, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "african-organic-wild-honey-1kg", title: "African Organic Wild Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/6ctmE1775107173.jpg", price: 2200, oldPrice: 2500, badge: "Save 12%", badgeTone: "green", stock: "in" },
  { id: "kashmiri-sidr-honey-250g", title: "Kashmiri Sidr Honey 250g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/QdxZW1771328171.png", price: 625, stock: "in" },
  { id: "black-seed-honey-1kg", title: "Black Seed Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/fAewT1767418525.jpg", price: 1500, oldPrice: 1600, badge: "Save 6%", badgeTone: "green", stock: "in" },
  { id: "honeyraj-mixed-flower-honey-with-honeycomb-250g", title: "Mixed Flower Honey with Comb 250g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/XCftg1767531570.jpg", price: 450, oldPrice: 500, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "sundarban-honey-250gm", title: "Sundarban Honey 250gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/wPcmU1767418820.jpg", price: 625, stock: "in" },
  { id: "black-seed-honey-250g", title: "Black Seed Honey 250g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/4mXh51767258754.jpg", price: 400, stock: "in" },
  { id: "lichu-fuler-modhu-250gm", title: "Lychee Flower Honey 250g", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/ykmIX1767418655.jpg", price: 300, stock: "in" },
  { id: "natural-honeycomb-1800g-briefcase", title: "Natural Honeycomb-1800g (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/SvuQG1767531952.jpg", price: 4050, oldPrice: 4500, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "black-seed-flower-honey-sachet-box-8x24-192-gm", title: "Black Seed Flower Honey Sachet Box (8x24) 192 gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/Nq4N51777290379.png", price: 360, stock: "in" },
  { id: "natural-honeycomb-1600gm-briefcase", title: "Natural Honeycomb-1600gm (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/aJbHf1767531809.jpg", price: 3600, oldPrice: 4000, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "honey-special-combo-pack-4-types-honey-2", title: "Honey Special Combo Pack (4 types Honey)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/OxAWv1770619134.jpeg", price: 1700, oldPrice: 1950, badge: "Save 13%", badgeTone: "green", stock: "in" },
  { id: "crystal-honey-1kg", title: "Crystal Honey 1kg", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/ObvIi1767855359.jpg", price: 1000, oldPrice: 1100, badge: "Save 9%", badgeTone: "green", stock: "in" },
  { id: "natural-honeycomb-1700g-briefcase", title: "Natural Honeycomb- 1700g (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/mn9wX1767531906.jpg", price: 3825, oldPrice: 4250, badge: "Save 10%", badgeTone: "green", stock: "in" },
  { id: "african-organic-wild-honey-8g-24-pcs-box-192-gm", title: "African Organic Wild Honey 8g x 24 pcs (Box) 192 gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/7EyFg1779602650.jpeg", price: 432, stock: "in" },
  { id: "african-organic-wild-honey-15g-24-pcs-box-360-gm", title: "African Organic Wild Honey 15g x 24 pcs (Box) 360 gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/icPDg1779602669.jpeg", price: 768, stock: "in" },
  { id: "black-seed-flower-honey-sachet-box-15x24-360-gm", title: "Black Seed Flower Honey Sachet Box (15x24) 360 gm", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/w7Z7V1779530070.jpeg", price: 623, stock: "in" },
  { id: "natural-honeycomb-1500gm-briefcase", title: "Natural Honeycomb-1500gm (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/YG3so1778149783.jpg", price: 3750, stock: "out" },
  { id: "natural-honeycomb-2000gm-briefcase", title: "Natural Honeycomb-2000gm (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/eqcyQ1778149725.jpg", price: 5000, stock: "out" },
  { id: "natural-honeycomb-1400gm-briefcase", title: "Natural Honeycomb-1400gm (Briefcase)", category: "Honey", image: "https://backoffice.ghorerbazar.com/productImages/1UETs1778142413.jpg", price: 3500, stock: "out" },
  { id: "glarvest-organic-longjing-green-tea-100gm", title: "Glarvest Organic Longjing Green Tea 100gm", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/N5YD71771491292.png", price: 1400, stock: "in" },
  { id: "glarvest-organic-matcha-green-tea-100gm", title: "Glarvest Organic Matcha Green Tea 100gm", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/lUcpq1771491205.webp", price: 1500, stock: "in" },
  { id: "sreemangals-tea-gold-500g", title: "Sreemangal's Tea Gold 500g", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/gXpJj1767441387.jpg", price: 300, stock: "in" },
  { id: "sreemangals-tea-gold-1kg", title: "Sreemangal's Tea Gold 1kg", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/mwiY41767441265.jpg", price: 600, stock: "in" },
  { id: "maccoffee-gold-100gm", title: "Maccoffee Gold 100gm", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/LGVJZ1767264473.jpg", price: 850, stock: "in" },
  { id: "maccoffee-original-100gm", title: "Maccoffee Original 100gm", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/NfH0L1767264327.jpg", price: 675, stock: "in" },
  { id: "maccoffee-orginal-95gm", title: "MacCoffee Orginal 95gm", category: "Beverage", image: "https://backoffice.ghorerbazar.com/productImages/jF75P1767264254.jpg", price: 465, stock: "in" },
  { id: "ashwagandha-powder-100g-usda-organic-certified", title: "Ashwagandha Powder 100g (USDA Organic Certified)", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/rubc61777091900.jpg", price: 600, stock: "in" },
  { id: "ceylon-organic-coconut-milk-c-400ml", title: "Ceylon Organic Coconut Milk (C) 400ml", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/lNdtA1767521662.jpeg", price: 350, stock: "in" },
  { id: "ceylon-organic-coconut-vinegar-500ml", title: "Ceylon Organic Coconut Vinegar 500ml", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/GHKMJ1772862114.png", price: 1065, stock: "in" },
  { id: "discovery-organic-apple-cider-vinegar-250ml", title: "Discovery Organic Apple Cider Vinegar 250ml", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/TTSB61772525925.png", price: 490, stock: "out" },
  { id: "karkuma-organic-apple-cider-vinegar-480ml", title: "Karkuma Organic Apple Cider Vinegar (480ml)", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/nzvWc1767505402.jpg", price: 750, stock: "in" },
  { id: "discovery-organic-apple-cider-vinegar-1-litter", title: "Discovery Organic Apple Cider Vinegar 1 litter", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/NNucf1767440969.jpg", price: 1325, stock: "in" },
  { id: "discovery-organic-apple-cider-vinegar-500ml", title: "Discovery Organic Apple Cider Vinegar (500ml)", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/6qLeh1767440861.jpg", price: 750, stock: "out" },
  { id: "karkuma-organic-turmeric-immune-booster", title: "Karkuma Organic Turmeric Immune Booster", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/n3lmQ1767438839.jpg", price: 390, stock: "in" },
  { id: "karkuma-organic-healthy-gut", title: "Karkuma Organic Healthy Gut", category: "Organic Certified", image: "https://backoffice.ghorerbazar.com/productImages/3Htjv1767438695.jpg", price: 800, stock: "in" },
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
    await seedLiveOilHoneyBeverageOrganicProducts();
    return;
  }

  await supabase.from("products").upsert(defaultProducts.map(toProductRow));
  await supabase.from("banners").upsert(defaultBanners.map(toBannerRow));
  await supabase.from("settings").upsert(toSettingsRows(defaultSettings));
  await seedLiveSpicesNutsProducts();
  await seedLiveOilHoneyBeverageOrganicProducts();
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

async function seedLiveOilHoneyBeverageOrganicProducts() {
  const seedKey = "liveOilHoneyBeverageOrganicSeed20260607";
  const { data: existingSeed, error: seedError } = await supabase.from("settings").select("value").eq("key", seedKey).maybeSingle();
  if (seedError) throw seedError;
  if (existingSeed) return;

  const { data: existingProducts, error: productError } = await supabase.from("products").select("id,title");
  if (productError) throw productError;

  const existingIds = new Set((existingProducts ?? []).map((product) => String(product.id)));
  const existingTitles = new Set((existingProducts ?? []).map((product) => String(product.title).toLowerCase()));
  const missingProducts = liveOilHoneyBeverageOrganicSeedProducts.filter((product) => !existingIds.has(product.id) && !existingTitles.has(product.title.toLowerCase()));
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
