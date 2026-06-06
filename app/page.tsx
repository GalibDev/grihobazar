"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Flame,
  Gift,
  Heart,
  Home,
  Instagram,
  LayoutGrid,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Twitter,
  UserRound,
  X,
} from "lucide-react";
import { readCart, writeCart } from "@/lib/cart-storage";

type Product = {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  badgeTone?: "green" | "orange" | "red";
  stock?: "in" | "out" | "preorder";
};

type ProductSectionData = {
  title: string;
  action?: string;
  category: string;
  products: Product[];
};

type CartItem = Product & { quantity: number };
type ModalType = "signin" | "track" | "wishlist" | "checkout" | "details" | "search" | "about" | null;

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

const categories = [
  { title: "Oil & Ghee", image: "https://backoffice.ghorerbazar.com/category_images/Zf99g1774766372.png" },
  { title: "Organic", image: "https://backoffice.ghorerbazar.com/category_images/HJOrw1774766749.png" },
  { title: "Honey", image: "https://backoffice.ghorerbazar.com/category_images/KbWCe1774766391.png" },
  { title: "Dates", image: "https://backoffice.ghorerbazar.com/category_images/wgCR01774766402.png" },
  { title: "Spices", image: "https://backoffice.ghorerbazar.com/category_images/hXyU71774766413.png" },
  { title: "Nuts & Seeds", image: "https://backoffice.ghorerbazar.com/category_images/5u39t1774766425.png" },
  { title: "Beverage", image: "https://backoffice.ghorerbazar.com/category_images/Zf99g1774766372.png" },
  { title: "Rice", image: "https://backoffice.ghorerbazar.com/productImages/XA6LK1767439665.jpg" },
  { title: "Flours & Lentils", image: "https://backoffice.ghorerbazar.com/productImages/97jKW1767439464.jpg" },
  { title: "Functional Food", image: "https://backoffice.ghorerbazar.com/productImages/Ba33d1767588217.jpg" },
];

const products: Product[] = [
  {
    id: "sundarban-honey-1kg",
    title: "Sundarban Honey 1kg",
    category: "Honey",
    image: "https://backoffice.ghorerbazar.com/productImages/CvT2N1767414529.jpg",
    price: 2300,
    oldPrice: 2500,
    badge: "Save ৳200",
    badgeTone: "green",
  },
  {
    id: "gawa-ghee-1kg",
    title: "Gawa Ghee 1kg",
    category: "Oil & Ghee",
    image: "https://backoffice.ghorerbazar.com/productImages/VvzII1767097227.jpg",
    price: 1800,
    badge: "Best Selling",
    badgeTone: "red",
  },
  {
    id: "black-seed-honey-1kg",
    title: "Black Seed Honey 1kg",
    category: "Honey",
    image: "https://backoffice.ghorerbazar.com/productImages/fAewT1767418525.jpg",
    price: 1500,
    oldPrice: 1600,
    badge: "Save ৳100",
    badgeTone: "green",
  },
  {
    id: "mustard-oil-5l",
    title: "Deshi Mustard Oil 5 liter",
    category: "Oil & Ghee",
    image: "https://backoffice.ghorerbazar.com/productImages/vkVdH1767248022.jpg",
    price: 1550,
    badge: "Best Selling",
    badgeTone: "red",
  },
  {
    id: "himsagar-mango-25kg",
    title: "Himsagar Mango-25 kg",
    category: "Mango",
    image: "https://backoffice.ghorerbazar.com/productImages/gOT1X1779006694.jpg",
    price: 3750,
    oldPrice: 4000,
    badge: "Save 6%",
    badgeTone: "green",
  },
  {
    id: "himsagar-mango-20kg",
    title: "Himsagar Mango-20 kg",
    category: "Mango",
    image: "https://backoffice.ghorerbazar.com/productImages/Ab42F1779008937.jpg",
    price: 3000,
    oldPrice: 3200,
    badge: "Save 6%",
    badgeTone: "green",
  },
  {
    id: "himsagar-mango-10kg",
    title: "Himsagar Mango-10 kg",
    category: "Mango",
    image: "https://backoffice.ghorerbazar.com/productImages/8yYcX1779009339.jpg",
    price: 1600,
  },
  {
    id: "himsagar-mango-5kg",
    title: "Himsagar Mango-5 kg",
    category: "Mango",
    image: "https://backoffice.ghorerbazar.com/productImages/VG72t1779009482.jpg",
    price: 850,
  },
  {
    id: "african-honey-500g",
    title: "African Organic Wild Honey 500g",
    category: "Honey",
    image: "https://backoffice.ghorerbazar.com/productImages/g7Qx11775107164.jpg",
    price: 1100,
    oldPrice: 1250,
    badge: "Save 12%",
    badgeTone: "green",
  },
  {
    id: "lychee-honey-500g",
    title: "Lychee Flower Honey 500g",
    category: "Honey",
    image: "https://backoffice.ghorerbazar.com/productImages/UuQNs1767418009.jpg",
    price: 550,
    oldPrice: 600,
    badge: "Save 8%",
    badgeTone: "green",
  },
  {
    id: "medjool-large-1kg",
    title: "Egyptian Medjool Large 1kg",
    category: "Dates",
    image: "https://backoffice.ghorerbazar.com/productImages/YOL6J1767074338.jpg",
    price: 1984,
    oldPrice: 2200,
    badge: "Save 10%",
    badgeTone: "green",
  },
  {
    id: "ajwa-premium-1kg",
    title: "Ajwa Premium Dates 1kg (Jumbo)",
    category: "Dates",
    image: "https://backoffice.ghorerbazar.com/productImages/GgBwT1775107212.webp",
    price: 2250,
    oldPrice: 2500,
    badge: "New Arrival",
    badgeTone: "orange",
  },
  {
    id: "safawi-1kg",
    title: "Safawi/kalmi Dates (A Grade) 1kg",
    category: "Dates",
    image: "https://backoffice.ghorerbazar.com/productImages/fJvJl1767074683.jpg",
    price: 1170,
    oldPrice: 1300,
    badge: "Save 10%",
    badgeTone: "green",
  },
  {
    id: "chili-powder-500g",
    title: "Chili (Morich) Powder 500g",
    category: "Spices",
    image: "https://backoffice.ghorerbazar.com/productImages/j32Ba1767262660.jpg",
    price: 400,
  },
  {
    id: "rice-flour-2kg",
    title: "Rice Flour (Chaler Gura) 2kg",
    category: "Flours & Lentils",
    image: "https://backoffice.ghorerbazar.com/productImages/XA6LK1767439665.jpg",
    price: 200,
  },
  {
    id: "turmeric-powder-500g",
    title: "Turmeric (Holud) Powder 500g",
    category: "Spices",
    image: "https://backoffice.ghorerbazar.com/productImages/GuI2U1767262030.jpg",
    price: 295,
  },
  {
    id: "laal-atta-2kg",
    title: "Laal Atta 2kg",
    category: "Flours & Lentils",
    image: "https://backoffice.ghorerbazar.com/productImages/97jKW1767439464.jpg",
    price: 200,
  },
  {
    id: "spirulina-250g",
    title: "Organic Spirulina Powder 250 gm",
    category: "Organic",
    image: "https://backoffice.ghorerbazar.com/productImages/Ba33d1767588217.jpg",
    price: 1140,
    oldPrice: 1200,
    badge: "New Arrival",
    badgeTone: "orange",
  },
  {
    id: "matcha-100g",
    title: "Glarvest Organic Matcha Green Tea 100gm",
    category: "Organic",
    image: "https://backoffice.ghorerbazar.com/productImages/3v2qM1775107292.jpg",
    price: 1500,
  },
  {
    id: "apple-cider-vinegar",
    title: "Discovery Organic Apple Cider Vinegar 250ml",
    category: "Organic",
    image: "https://backoffice.ghorerbazar.com/productImages/PvmUc1775107416.jpg",
    price: 490,
    stock: "out",
  },
  {
    id: "honey-nuts-800g",
    title: "Honey Nuts 800gm",
    category: "Nuts & Seeds",
    image: "https://backoffice.ghorerbazar.com/productImages/wJSpb1767078668.jpg",
    price: 1500,
    badge: "Best Selling",
    badgeTone: "orange",
  },
];

const combos: Product[] = [
  {
    id: "combo-half-ghee",
    title: "Ghee (Half Kg) & Lychee Honey Sachet Combo",
    category: "Combos",
    image: "https://backoffice.ghorerbazar.com/storage/combos/1Xbv0tpGtgeSD6T0BHNp5daunFfZTAeDk9Qg76Eb.jpg",
    price: 1000,
    oldPrice: 1140,
    badge: "Save 12.3%",
    badgeTone: "green",
  },
  {
    id: "combo-ghee-1kg",
    title: "Ghee (1 Kg) & Lychee Honey Sachet Combo",
    category: "Combos",
    image: "https://backoffice.ghorerbazar.com/storage/combos/eHFlh1X3A3xFiWdXUe2kXfVtaY5Ei77wEtlnC9fB.jpg",
    price: 1800,
    oldPrice: 2040,
    badge: "Save 11.8%",
    badgeTone: "green",
  },
  {
    id: "combo-masala",
    title: "Shahi Masala & Lychee Honey Sachet Combo",
    category: "Combos",
    image: "https://backoffice.ghorerbazar.com/storage/combos/v2mWnfZX4GmmR0tFAT1KVpVwhEGS6F7H1BaRCPHJ.jpg",
    price: 1500,
    oldPrice: 1740,
    badge: "Save 13.8%",
    badgeTone: "green",
  },
  {
    id: "combo-mustard",
    title: "Mustard Oil & Lychee Honey Sachet Combo",
    category: "Combos",
    image: "https://backoffice.ghorerbazar.com/storage/combos/JmSEKuQ77LS2jBtQzhbqulglNPM9YIfOC3lS9sB6.jpg",
    price: 1600,
    oldPrice: 1790,
    badge: "Save 10.6%",
    badgeTone: "green",
  },
];

const brands = [
  "https://backoffice.ghorerbazar.com/brand_images/7hNKq1768887947.png",
  "https://backoffice.ghorerbazar.com/brand_images/RNTIU1763611802.png",
  "https://backoffice.ghorerbazar.com/brand_images/M89ch1768888003.png",
  "https://backoffice.ghorerbazar.com/brand_images/wPRK91768888154.png",
  "https://backoffice.ghorerbazar.com/brand_images/YuK9J1768888227.png",
];

const menuItems = [
  "Combos",
  "Offer Zone",
  "Mango",
  "Honey",
  "Oil & Ghee",
  "Dates",
  "Spices",
  "Nuts & Seeds",
  "Beverage",
  "Rice",
  "Flours & Lentils",
  "Organic",
  "Pickle",
  "Tabaya",
];

const heroSlides = [
  {
    category: "Mango",
    desktop: "https://backoffice.ghorerbazar.com/banner/hSjx41780379939-dark-1000x400.png",
    mobile: "https://backoffice.ghorerbazar.com/banner/Gcahd1780379939-dark-500x280.png",
    alt: "Mango offer",
  },
  {
    category: "Dates",
    desktop: "https://backoffice.ghorerbazar.com/banner/sCUkg1774768074-dark.png",
    mobile: "https://backoffice.ghorerbazar.com/banner/I2Vto1774768074-dark.png",
    alt: "Dates collection",
  },
  {
    category: "Honey",
    desktop: "https://backoffice.ghorerbazar.com/banner/wvLKI1771837751.jpeg",
    mobile: "https://backoffice.ghorerbazar.com/banner/3ANBj1767529509.jpg",
    alt: "Honey collection",
  },
  {
    category: "Oil & Ghee",
    desktop: "https://backoffice.ghorerbazar.com/banner/5vlkL1778734911-dark-1000x400.png",
    mobile: "https://backoffice.ghorerbazar.com/banner/OK8Rw1778736050-light-1000x560.jpg",
    alt: "Oil and ghee collection",
  },
];

const allStoreProducts = [...products, ...combos];
const topSellingIds = ["sundarban-honey-1kg", "gawa-ghee-1kg", "black-seed-honey-1kg", "mustard-oil-5l"];

const sections: ProductSectionData[] = [
  { title: "Mango", action: "VIEW ALL ITEMS", category: "Mango", products: products.filter((product) => product.category === "Mango") },
  { title: "All Natural Honey", action: "VIEW ALL ITEMS", category: "Honey", products: products.filter((product) => product.category === "Honey") },
  { title: "Premium Dates", action: "VIEW ALL ITEMS", category: "Dates", products: products.filter((product) => product.category === "Dates") },
  { title: "Cooking Essentials", action: "VIEW ALL ITEMS", category: "Spices", products: products.filter((product) => ["Spices", "Flours & Lentils"].includes(product.category)) },
  { title: "Organic Certified", action: "VIEW ALL ITEMS", category: "Organic", products: products.filter((product) => product.category === "Organic") },
  { title: "Just For You", action: "VIEW ALL PRODUCTS", category: "All", products },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [wishlist, setWishlist] = useState<Record<string, Product>>({});
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllJustForYou, setShowAllJustForYou] = useState(false);
  const [storeProducts, setStoreProducts] = useState<Product[]>(products);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const storeCatalog = useMemo(() => [...storeProducts, ...combos], [storeProducts]);
  const storeSections = useMemo<ProductSectionData[]>(
    () => [
      { title: "Mango", action: "VIEW ALL ITEMS", category: "Mango", products: storeProducts.filter((product) => product.category === "Mango") },
      { title: "All Natural Honey", action: "VIEW ALL ITEMS", category: "Honey", products: storeProducts.filter((product) => product.category === "Honey") },
      { title: "Premium Dates", action: "VIEW ALL ITEMS", category: "Dates", products: storeProducts.filter((product) => product.category === "Dates") },
      { title: "Cooking Essentials", action: "VIEW ALL ITEMS", category: "Spices", products: storeProducts.filter((product) => ["Spices", "Flours & Lentils"].includes(product.category)) },
      { title: "Organic Certified", action: "VIEW ALL ITEMS", category: "Organic", products: storeProducts.filter((product) => product.category === "Organic") },
      { title: "Just For You", action: "VIEW ALL PRODUCTS", category: "All", products: storeProducts },
    ],
    [storeProducts],
  );

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return storeCatalog.filter((product) => {
      const matchesQuery = !normalized || `${product.title} ${product.category}`.toLowerCase().includes(normalized);
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [activeCategory, query, storeCatalog]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen || cartOpen || modal !== null);
    return () => document.body.classList.remove("menu-open");
  }, [cartOpen, menuOpen, modal]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((nextProducts: Product[]) => setStoreProducts(nextProducts))
      .catch(() => setStoreProducts(products));
  }, []);

  useEffect(() => {
    const savedCart = readCart();
    if (savedCart.length) {
      setCart(Object.fromEntries(savedCart.map((item) => [item.id, item])));
    }
  }, []);

  function addToCart(product: Product, quantity = 1) {
    if (product.stock === "out") return;
    setCart((current) => ({
      ...current,
      [product.id]: { ...product, quantity: (current[product.id]?.quantity ?? 0) + quantity },
    }));
    const nextCart = {
      ...cart,
      [product.id]: { ...product, quantity: (cart[product.id]?.quantity ?? 0) + quantity },
    };
    writeCart(Object.values(nextCart));
    setCartOpen(true);
  }

  function setQuantity(product: Product, quantity: number) {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[product.id];
      } else {
        next[product.id] = { ...product, quantity };
      }
      writeCart(Object.values(next));
      return next;
    });
  }

  function openDetails(product: Product) {
    window.location.href = `/products/${product.id}`;
  }

  function buyNow(product: Product) {
    addToCart(product);
    setSelectedProduct(product);
    setModal("checkout");
  }

  function toggleWishlist(product: Product) {
    setWishlist((current) => {
      const next = { ...current };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = product;
      }
      return next;
    });
  }

  function jumpToCategory(category: string) {
    setActiveCategory(category === "Offer Zone" ? "All" : category);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-brand-paper shadow-[0_0_0_1px_rgba(0,0,0,0.04)] lg:max-w-none lg:shadow-none">
      <header className="sticky top-0 z-10 grid h-[70px] grid-cols-[64px_1fr_64px] items-center border-b border-[#ececec] bg-white lg:hidden">
        <IconButton label="Open menu" onClick={() => setMenuOpen(true)}><Menu className="h-[34px] w-[34px]" /></IconButton>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img className="mx-auto w-24" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
        </button>
        <button type="button" aria-label="Cart" onClick={() => setCartOpen(true)} className="relative mx-auto text-brand-ink">
          <ShoppingCart className="h-[34px] w-[34px] stroke-[2.1]" />
          <Counter count={cartCount} />
        </button>
      </header>

      <DesktopHeader cartCount={cartCount} onModal={setModal} onCart={() => setCartOpen(true)} query={query} setQuery={setQuery} />
      <DesktopNav onCategory={jumpToCategory} />

      <main className="px-2 pb-[120px] pt-5 lg:mx-auto lg:max-w-[1200px] lg:px-0 lg:pb-24 lg:pt-9 xl:w-[calc(100%-240px)]">
        <Hero onCategory={jumpToCategory} />
        <FeaturedCategories onCategory={jumpToCategory} />

        <section className="relative text-center">
          <h1 className="mb-[18px] mt-[22px] text-[27px] font-bold leading-tight lg:mb-7 lg:mt-12 lg:text-[34px]">Top Selling Products</h1>
          <ProductGrid
            products={storeProducts.filter((product) => topSellingIds.includes(product.id))}
            cart={cart}
            wishlist={wishlist}
            onAdd={addToCart}
            onQuantity={setQuantity}
            onDetails={openDetails}
            onBuy={buyNow}
            onWishlist={toggleWishlist}
          />
        </section>

        <Brands onSeeAll={() => setModal("about")} />
        <ProductSection section={storeSections[0]} cart={cart} wishlist={wishlist} onAction={() => jumpToCategory("Mango")} onAdd={addToCart} onQuantity={setQuantity} onDetails={openDetails} onBuy={buyNow} onWishlist={toggleWishlist} />
        <ProductSection section={storeSections[1]} cart={cart} wishlist={wishlist} onAction={() => jumpToCategory("Honey")} onAdd={addToCart} onQuantity={setQuantity} onDetails={openDetails} onBuy={buyNow} onWishlist={toggleWishlist} />
        <ComboSection onDetails={openDetails} onAdd={addToCart} />
        <ProductSection section={storeSections[2]} cart={cart} wishlist={wishlist} onAction={() => jumpToCategory("Dates")} onAdd={addToCart} onQuantity={setQuantity} onDetails={openDetails} onBuy={buyNow} onWishlist={toggleWishlist} />

        <PromoBanner />
        <ProductSection section={storeSections[3]} cart={cart} wishlist={wishlist} onAction={() => jumpToCategory("Spices")} onAdd={addToCart} onQuantity={setQuantity} onDetails={openDetails} onBuy={buyNow} onWishlist={toggleWishlist} />
        <ProductSection section={storeSections[4]} cart={cart} wishlist={wishlist} onAction={() => jumpToCategory("Organic")} onAdd={addToCart} onQuantity={setQuantity} onDetails={openDetails} onBuy={buyNow} onWishlist={toggleWishlist} />
        <ProductSection
          section={{ ...storeSections[5], products: showAllJustForYou ? storeSections[5].products : storeSections[5].products.slice(0, 10) }}
          cart={cart}
          wishlist={wishlist}
          onAction={() => jumpToCategory("All")}
          onAdd={addToCart}
          onQuantity={setQuantity}
          onDetails={openDetails}
          onBuy={buyNow}
          onWishlist={toggleWishlist}
          showLoadMore={!showAllJustForYou}
          onLoadMore={() => setShowAllJustForYou(true)}
        />

        <SearchPanel results={searchResults} catalog={storeCatalog} activeCategory={activeCategory} query={query} setQuery={setQuery} setActiveCategory={setActiveCategory} onAdd={addToCart} onDetails={openDetails} />
        <Testimonials />
        <Footer onModal={setModal} onCategory={jumpToCategory} />
      </main>

      <FloatingCart cartCount={cartCount} cartTotal={cartTotal} onClick={() => setCartOpen(true)} />
      <ChatButton />
      <BottomNav cartCount={cartCount} onMenuClick={() => setMenuOpen(true)} onCart={() => setCartOpen(true)} onModal={setModal} />
      <Drawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} onModal={setModal} onCategory={jumpToCategory} wishlistCount={Object.keys(wishlist).length} />
      <CartDrawer open={cartOpen} items={cartItems} total={cartTotal} onClose={() => setCartOpen(false)} onQuantity={setQuantity} onCheckout={() => setModal("checkout")} />
      <AppModal modal={modal} product={selectedProduct} cartItems={cartItems} wishlist={Object.values(wishlist)} total={cartTotal} query={query} setQuery={setQuery} results={searchResults} onClose={() => setModal(null)} onAdd={addToCart} onDetails={openDetails} onQuantity={setQuantity} onCheckout={() => setModal("checkout")} />
    </div>
  );
}

function DesktopHeader({ cartCount, onModal, onCart, query, setQuery }: { cartCount: number; onModal: (modal: ModalType) => void; onCart: () => void; query: string; setQuery: (query: string) => void }) {
  const actions = [
    { label: "Track Order", icon: <MapPin />, onClick: () => onModal("track") },
    { label: "Sign In", icon: <UserRound />, onClick: () => onModal("signin") },
    { label: "Wishlist", icon: <Heart />, onClick: () => onModal("wishlist") },
    { label: "Cart", icon: <ShoppingCart />, onClick: onCart, count: cartCount },
    { label: "More", icon: <Menu />, onClick: () => onModal("about") },
  ];

  return (
    <header className="hidden border-b border-[#ececec] bg-white lg:block">
      <div className="mx-auto grid h-[85px] max-w-[1200px] grid-cols-[140px_500px_400px] items-center justify-between gap-0 px-0">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img className="w-[140px]" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
        </button>
        <form className="relative" onSubmit={(event) => { event.preventDefault(); onModal("search"); }}>
          <input aria-label="Search products" value={query} onChange={(event) => setQuery(event.target.value)} className="h-[45px] w-full rounded bg-[#f4f4f4] px-5 pr-12 text-[14px] outline-none" placeholder="Search in..." />
          <button type="submit" aria-label="Search" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink">
            <Search className="h-6 w-6 stroke-[2]" />
          </button>
        </form>
        <div className="flex h-[45px] items-center justify-between">
          {actions.map((action) => (
            <button key={action.label} type="button" onClick={action.onClick} className="relative grid justify-items-center text-brand-ink">
              <span className="[&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-[1.9]">{action.icon}</span>
              {typeof action.count === "number" ? <Counter count={action.count} /> : null}
              <span className="mt-0.5 whitespace-nowrap text-[13px] leading-none">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ onCategory }: { onCategory: (category: string) => void }) {
  return (
    <nav className="hidden bg-[#052925] text-white lg:block">
      <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between gap-4 overflow-x-auto px-0">
        {menuItems.map((label) => (
          <button key={label} type="button" onClick={() => onCategory(label)} className="flex shrink-0 items-center gap-1 text-[14px] font-semibold leading-none">
            <span>{label}</span>
            {["Honey", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Flours & Lentils"].includes(label) ? <ChevronRight className="h-3.5 w-3.5 shrink-0 rotate-90" /> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Hero({ onCategory }: { onCategory: (category: string) => void }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  const move = (direction: number) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative overflow-hidden rounded-[5px] bg-[#111] lg:grid lg:h-[300px] lg:grid-cols-[750px_430px] lg:gap-5 lg:bg-transparent">
      <div className="relative overflow-hidden rounded-[8px] bg-[#111]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <button
              key={slide.category}
              type="button"
              onClick={() => onCategory(slide.category)}
              className="block w-full shrink-0"
              aria-label={`Open ${slide.category}`}
            >
              <picture>
                <source media="(min-width: 1024px)" srcSet={slide.desktop} />
                <img className="block aspect-[500/280] w-full object-cover lg:h-[300px] lg:aspect-auto" src={slide.mobile} alt={slide.alt} />
              </picture>
            </button>
          ))}
        </div>
        <SliderDots
          className="absolute bottom-[9px] left-7"
          count={heroSlides.length}
          active={activeSlide}
          onSelect={setActiveSlide}
        />
      </div>
      <button type="button" onClick={() => onCategory("Honey")} className="hidden h-full w-full lg:block">
        <img className="h-full w-full rounded-[8px] object-cover" src="https://backoffice.ghorerbazar.com/banner/ECXVc1780379887-500x410.png" alt="Follow us on Facebook" />
      </button>
      <button type="button" onClick={() => move(-1)} aria-label="Previous" className="absolute left-0 top-1/2 grid h-[40px] w-[40px] -translate-y-1/2 place-items-center bg-white text-brand-orange"><ArrowLeft className="h-[20px] w-[20px]" /></button>
      <button type="button" onClick={() => move(1)} aria-label="Next" className="absolute right-0 top-1/2 grid h-[40px] w-[40px] -translate-y-1/2 place-items-center bg-white text-brand-orange"><ArrowRight className="h-[20px] w-[20px]" /></button>
    </section>
  );
}

function SlidingRail<T,>({
  items,
  renderItem,
  itemClassName,
  trackClassName = "",
  mobileItemsPerPage,
  desktopItemsPerPage,
  autoplay = false,
  interval = 4800,
  arrowTopClassName = "top-1/2",
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemClassName: string;
  trackClassName?: string;
  mobileItemsPerPage: number;
  desktopItemsPerPage: number;
  autoplay?: boolean;
  interval?: number;
  arrowTopClassName?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(mobileItemsPerPage);
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(window.innerWidth >= 1024 ? desktopItemsPerPage : mobileItemsPerPage);
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [desktopItemsPerPage, mobileItemsPerPage]);

  useEffect(() => {
    if (activePage < pageCount) return;
    setActivePage(pageCount - 1);
  }, [activePage, pageCount]);

  const scrollToPage = (page: number) => {
    const nextPage = (page + pageCount) % pageCount;
    const rail = railRef.current;
    setActivePage(nextPage);
    rail?.scrollTo({ left: nextPage * rail.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoplay || pageCount < 2) return;
    const timer = window.setInterval(() => {
      setActivePage((current) => {
        const nextPage = (current + 1) % pageCount;
        const rail = railRef.current;
        rail?.scrollTo({ left: nextPage * rail.clientWidth, behavior: "smooth" });
        return nextPage;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, interval, pageCount]);

  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail?.clientWidth) return;
    const nextPage = Math.min(pageCount - 1, Math.max(0, Math.round(rail.scrollLeft / rail.clientWidth)));
    setActivePage(nextPage);
  };

  return (
    <div className="relative">
      {pageCount > 1 ? (
        <>
          <button type="button" onClick={() => scrollToPage(activePage - 1)} aria-label="Previous slide" className={`absolute -left-[18px] ${arrowTopClassName} z-[2] grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-full bg-brand-orange text-white shadow-soft lg:-left-5 lg:h-[46px] lg:w-[46px]`}>
            <ChevronLeft className="h-[25px] w-[25px] lg:h-8 lg:w-8" />
          </button>
          <button type="button" onClick={() => scrollToPage(activePage + 1)} aria-label="Next slide" className={`absolute -right-[18px] ${arrowTopClassName} z-[2] grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-full bg-brand-orange text-white shadow-soft lg:-right-5 lg:h-[46px] lg:w-[46px]`}>
            <ChevronRight className="h-[25px] w-[25px] lg:h-8 lg:w-8" />
          </button>
        </>
      ) : null}
      <div
        ref={railRef}
        onScroll={handleScroll}
        className={`flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${trackClassName}`}
      >
        {items.map((item, index) => (
          <div key={index} className={`shrink-0 snap-start ${itemClassName}`}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {pageCount > 1 ? <SliderDots className="mt-7 justify-center" count={pageCount} active={activePage} onSelect={scrollToPage} /> : null}
    </div>
  );
}

function FeaturedCategories({ onCategory }: { onCategory: (category: string) => void }) {
  return (
    <section className="relative text-center">
      <h1 className="mb-[18px] mt-[24px] text-[25px] font-bold leading-tight lg:mb-10 lg:mt-[26px] lg:text-[26px]">Featured Categories</h1>
      <SlidingRail
        items={categories}
        mobileItemsPerPage={3}
        desktopItemsPerPage={6}
        itemClassName="w-[29%] min-w-[29%] sm:w-[22%] sm:min-w-[22%] lg:w-[15%] lg:min-w-[15%]"
        trackClassName="gap-8 px-[21px] max-[360px]:gap-5 max-[360px]:px-[17px] lg:gap-8 lg:px-8"
        autoplay
        arrowTopClassName="top-[92px] lg:top-[95px]"
        renderItem={(category) => (
          <button key={category.title} type="button" onClick={() => onCategory(category.title)} className="min-w-0 text-center">
            <img className="aspect-square w-full scale-[1.22] rounded-[18px] bg-white object-contain p-2.5 shadow-soft lg:scale-100 lg:p-5" src={category.image} alt={category.title} />
            <h2 className="mt-[13px] min-h-12 text-[clamp(16px,5.1vw,22px)] font-medium leading-[1.15] lg:text-[20px]">{category.title}</h2>
          </button>
        )}
      />
    </section>
  );
}

function Brands({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <section className="pt-7 lg:pt-14">
      <SectionHeader title="Our Brands" action="SEE ALL" onAction={onSeeAll} />
      <SlidingRail
        items={brands}
        mobileItemsPerPage={2}
        desktopItemsPerPage={5}
        itemClassName="w-[47%] min-w-[47%] lg:w-[18.8%] lg:min-w-[18.8%]"
        trackClassName="gap-4 pt-4 lg:gap-7 lg:pt-7"
        autoplay
        renderItem={(brand) => (
          <div key={brand} className="grid h-[88px] place-items-center rounded-lg border border-[#dedede] bg-white lg:h-[150px]">
            <img className="max-h-[58px] max-w-[75%] object-contain lg:max-h-[86px]" src={brand} alt="Brand" />
          </div>
        )}
      />
    </section>
  );
}

function ProductSection(props: { section: ProductSectionData; cart: Record<string, CartItem>; wishlist: Record<string, Product>; showLoadMore?: boolean; onLoadMore?: () => void; onAction?: () => void; onAdd: (product: Product) => void; onQuantity: (product: Product, quantity: number) => void; onDetails: (product: Product) => void; onBuy: (product: Product) => void; onWishlist: (product: Product) => void }) {
  const { section, showLoadMore, onLoadMore, onAction } = props;
  return (
    <section id={section.title === "Just For You" ? "products" : undefined} className="pt-8 lg:pt-14">
      <SectionHeader title={section.title} action={section.action} onAction={onAction} />
      <ProductGrid {...props} products={section.products} />
      {showLoadMore ? <button type="button" onClick={onLoadMore} className="mx-auto mt-8 block rounded-full border-2 border-brand-orange px-10 py-4 text-lg font-semibold text-brand-orange">LOAD MORE</button> : null}
    </section>
  );
}

function ProductGrid(props: { products: Product[]; cart: Record<string, CartItem>; wishlist: Record<string, Product>; onAdd: (product: Product) => void; onQuantity: (product: Product, quantity: number) => void; onDetails: (product: Product) => void; onBuy: (product: Product) => void; onWishlist: (product: Product) => void }) {
  return (
    <SlidingRail
      items={props.products}
      mobileItemsPerPage={2}
      desktopItemsPerPage={5}
      itemClassName="w-[47%] min-w-[47%] lg:w-[18.8%] lg:min-w-[18.8%]"
      trackClassName="gap-4 pt-6 lg:gap-7"
      autoplay
      renderItem={(product) => <ProductCard key={product.id} product={product} quantity={props.cart[product.id]?.quantity ?? 0} wished={Boolean(props.wishlist[product.id])} onAdd={props.onAdd} onQuantity={props.onQuantity} onDetails={props.onDetails} onBuy={props.onBuy} onWishlist={props.onWishlist} />}
    />
  );
}

function ProductCard({ product, quantity, wished, onAdd, onQuantity, onDetails, onBuy, onWishlist }: { product: Product; quantity: number; wished: boolean; onAdd: (product: Product) => void; onQuantity: (product: Product, quantity: number) => void; onDetails: (product: Product) => void; onBuy: (product: Product) => void; onWishlist: (product: Product) => void }) {
  const disabled = product.stock === "out";
  return (
    <article className="relative overflow-hidden rounded-[5px] border border-[#d7d7d7] bg-white">
      {product.badge ? <Badge label={product.badge} tone={product.badgeTone} /> : null}
      <button type="button" aria-label="Toggle wishlist" onClick={() => onWishlist(product)} className={`absolute left-3 top-3 z-[1] grid h-9 w-9 place-items-center rounded-full bg-white shadow-soft ${wished ? "text-brand-orange" : "text-[#777]"}`}>
        <Heart className={wished ? "h-5 w-5 fill-current" : "h-5 w-5"} />
      </button>
      <button type="button" onClick={() => onDetails(product)} className="grid h-[190px] w-full place-items-center p-3 lg:h-[270px] lg:p-6">
        <img className="max-h-full max-w-full object-contain" src={product.image} alt={product.title} />
      </button>
      <div className="px-3 pb-3 lg:px-5 lg:pb-5">
        <button type="button" onClick={() => onDetails(product)} className="block text-left">
          <h3 className="min-h-[52px] text-[17px] font-semibold leading-[1.16] text-brand-ink lg:min-h-[60px] lg:text-[24px]">{product.title}</h3>
        </button>
        <div className="mb-4 mt-3 flex flex-wrap items-center gap-2">
          <strong className="text-[20px] font-extrabold text-brand-orange lg:text-[24px]">{formatPrice(product.price)}</strong>
          {product.oldPrice ? <span className="text-base text-[#8b8b8b] line-through">{formatPrice(product.oldPrice)}</span> : null}
        </div>
        {disabled ? (
          <button type="button" disabled className="h-11 w-full rounded bg-[#9ca3af] text-base font-bold text-white">Stock Out</button>
        ) : quantity > 0 ? (
          <QuantityControl quantity={quantity} onMinus={() => onQuantity(product, quantity - 1)} onPlus={() => onQuantity(product, quantity + 1)} />
        ) : (
          <button type="button" onClick={() => onAdd(product)} className="flex h-11 w-full items-center justify-center gap-2 rounded border border-brand-orange text-base font-bold text-brand-orange lg:h-[58px] lg:text-lg">
            <ShoppingCart className="h-5 w-5" /> Add To Cart
          </button>
        )}
      </div>
    </article>
  );
}

function ComboSection({ onDetails, onAdd }: { onDetails: (product: Product) => void; onAdd: (product: Product) => void }) {
  return (
    <section className="mt-9 rounded-[18px] bg-[#fff2e7] px-4 py-6 lg:mt-16 lg:px-8 lg:py-9">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded bg-brand-orange text-white"><Gift className="h-5 w-5" /></span>
          <h2 className="text-xl font-extrabold leading-tight lg:text-[30px]">Exclusive Combo Deals</h2>
        </div>
        <button type="button" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex h-10 shrink-0 items-center gap-1 rounded bg-brand-orange px-3 text-sm font-semibold text-white">
          View All Combos <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <SlidingRail
        items={combos}
        mobileItemsPerPage={2}
        desktopItemsPerPage={4}
        itemClassName="w-[47%] min-w-[47%] lg:w-[23.1%] lg:min-w-[23.1%]"
        trackClassName="gap-5 lg:gap-7"
        autoplay
        renderItem={(combo) => <ComboCard key={combo.id} product={combo} onDetails={onDetails} onAdd={onAdd} />}
      />
    </section>
  );
}

function ComboCard({ product, onDetails, onAdd }: { product: Product; onDetails: (product: Product) => void; onAdd: (product: Product) => void }) {
  return (
    <article className="relative overflow-hidden rounded border border-[#d7d7d7] bg-white">
      <Badge label={product.badge ?? ""} tone="green" />
      <span className="absolute right-0 top-0 rounded-bl bg-brand-orange px-2 py-1 text-xs text-white">Combo Offer</span>
      <button type="button" onClick={() => onDetails(product)} className="grid h-[200px] w-full place-items-center p-3 pt-8 lg:h-[290px]">
        <img className="max-h-full max-w-full object-contain" src={product.image} alt={product.title} />
      </button>
      <div className="px-3 pb-3">
        <h3 className="min-h-[62px] text-base font-bold leading-tight">{product.title}</h3>
        <div className="mb-4 mt-3 flex flex-wrap items-center gap-2">
          <strong className="text-base font-extrabold text-brand-orange">{formatPrice(product.price)}</strong>
          <span className="text-sm text-[#8b8b8b] line-through">{product.oldPrice ? formatPrice(product.oldPrice) : ""}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onDetails(product)} className="h-11 rounded border border-brand-orange text-sm font-semibold text-brand-orange">Details</button>
          <button type="button" onClick={() => onAdd(product)} className="h-11 rounded bg-brand-orange text-sm font-semibold text-white">Add</button>
        </div>
      </div>
    </article>
  );
}

function SearchPanel({
  results,
  catalog,
  activeCategory,
  query,
  setQuery,
  setActiveCategory,
  onAdd,
  onDetails,
}: {
  results: Product[];
  catalog: Product[];
  activeCategory: string;
  query: string;
  setQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  onAdd: (product: Product) => void;
  onDetails: (product: Product) => void;
}) {
  return (
    <section id="products" className="pt-10 lg:pt-16">
      <SectionHeader title="Find Products" action={`${results.length} ITEMS`} />
      <div className="mt-5 grid gap-3 rounded-lg border border-[#dedede] bg-white p-4 lg:grid-cols-[280px_1fr] lg:gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#555]" htmlFor="search-products">Search</label>
          <input id="search-products" value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded border border-[#d4d4d4] px-4 outline-none focus:border-brand-orange" placeholder="Honey, mango, dates..." />
        </div>
        <div className="flex gap-2 overflow-x-auto lg:flex-wrap">
          {["All", ...Array.from(new Set(catalog.map((product) => product.category)))].map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`h-10 shrink-0 rounded px-4 text-sm font-semibold ${activeCategory === category ? "bg-brand-orange text-white" : "bg-[#f4f4f4] text-brand-ink"}`}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {results.slice(0, 10).map((product) => (
          <button key={product.id} type="button" onClick={() => onDetails(product)} className="rounded border border-[#dedede] bg-white p-3 text-left">
            <img className="mx-auto h-28 object-contain" src={product.image} alt={product.title} />
            <strong className="mt-2 block min-h-10 text-sm leading-tight">{product.title}</strong>
            <span className="text-brand-orange">{formatPrice(product.price)}</span>
            <span onClick={(event) => { event.stopPropagation(); onAdd(product); }} className="mt-2 grid h-9 place-items-center rounded bg-brand-orange text-sm font-semibold text-white">Add</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return <div className="pt-9 lg:pt-16"><img className="aspect-[1000/400] w-full rounded-[18px] object-cover lg:max-h-[330px]" src="https://backoffice.ghorerbazar.com/banner/WUMvR1778738930-1000x400.png" alt="Cooking essentials" /></div>;
}

function Testimonials() {
  return (
    <section className="pt-10 lg:pt-16">
      <div className="rounded-[18px] border border-[#d7d7d7] bg-white px-6 py-7 text-[#666] lg:px-12 lg:py-12">
        <p className="text-lg leading-9 lg:text-2xl">Thanks Ghorerbazar for free Honeyraj. Of course, I got it for being a regular customer.</p>
        <div className="mt-7 flex items-center gap-4">
          <img className="h-[62px] w-[62px] rounded-full object-cover" src="https://backoffice.ghorerbazar.com/testimonial/0Jti61758182944.png" alt="Sultana Yesmin" />
          <div><h3 className="text-lg font-semibold text-brand-ink">Sultana Yesmin</h3><p>Housewife</p></div>
        </div>
      </div>
      <SliderDots className="mt-7 justify-center" />
    </section>
  );
}

function Footer({ onModal, onCategory }: { onModal: (modal: ModalType) => void; onCategory: (category: string) => void }) {
  const footerGroups = [
    ["Information", "About us", "Contact us", "Company Information", "Ghorer Bazar Stories", "Terms & Conditions", "Privacy Policy", "Careers"],
    ["Shop By", "Oil & Ghee", "Honey", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Functional Foods"],
    ["Support", "Support Center", "How to Order", "Order Tracking", "Payment", "Shipping", "FAQ"],
    ["Consumer Policy", "Happy Return", "Refund Policy", "Exchange", "Cancellation", "Pre-Order", "Extra Discount"],
  ];
  return (
    <footer className="pt-10 text-[#686868] lg:pt-16">
      <img className="mb-5 w-[150px]" src="https://backoffice.ghorerbazar.com/company_logo/qJaKf1768887846.png" alt="Ghorer Bazar" />
      <p className="text-lg leading-8 lg:max-w-[820px] lg:text-xl">Ghorer Bazar is an e-commerce platform dedicated to providing safe and reliable food to every home.</p>
      <div className="mt-7 space-y-3 text-lg">
        <p className="flex items-center gap-3"><MapPin className="h-5 w-5" /> Rampura, Dhaka, Bangladesh</p>
        <p className="flex items-center gap-3"><Phone className="h-5 w-5" /> 09642922922</p>
        <p className="flex items-center gap-3"><Mail className="h-5 w-5" /> contact@ghorerbazar.com</p>
      </div>
      <div className="mt-8 flex gap-4 text-brand-orange">
        {[Facebook, Twitter, Instagram].map((Icon, index) => <button type="button" key={index} onClick={() => onModal("about")} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-soft"><Icon className="h-5 w-5" /></button>)}
      </div>
      <h2 className="mt-10 text-xl font-semibold text-brand-ink">Download App on Mobile :</h2>
      <div className="mt-5 flex gap-3">
        <img className="h-[38px]" src="https://ghorerbazar.com/assets/images/google-play.svg" alt="Google Play" />
        <img className="h-[38px]" src="https://ghorerbazar.com/assets/images/app-store.svg" alt="App Store" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-4 lg:gap-x-14">
        {footerGroups.map(([title, ...links]) => (
          <div key={title}>
            <h3 className="mb-4 text-xl font-semibold text-brand-ink">{title}</h3>
            <div className="space-y-3 text-lg">
              {links.map((link) => <button key={link} type="button" className="block text-left text-[#686868]" onClick={() => link.includes("Order") ? onModal("track") : onCategory(link.replace("Functional Foods", "Functional Food"))}>{link}</button>)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 border-t border-[#d5d5d5] pt-6 text-center">
        <img className="mx-auto max-w-full" src="https://backoffice.ghorerbazar.com/company_logo/faysy1756641916.png" alt="Payment methods" />
        <p className="mt-5 text-lg">Copyright © 2026 GhorerBazar</p>
      </div>
    </footer>
  );
}

function CartDrawer({ open, items, total, onClose, onQuantity, onCheckout }: { open: boolean; items: CartItem[]; total: number; onClose: () => void; onQuantity: (product: Product, quantity: number) => void; onCheckout: () => void }) {
  const unlock = Math.max(0, 3000 - total);
  return (
    <>
      {open ? <button type="button" aria-label="Close cart overlay" onClick={onClose} className="fixed inset-0 z-40 bg-black/50" /> : null}
      <aside className={`fixed bottom-0 right-0 top-0 z-[45] flex w-[min(92vw,420px)] flex-col bg-white transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button type="button" aria-label="Close cart" onClick={onClose}><X className="h-7 w-7" /></button>
        </div>
        <div className="border-b bg-[#fff2e7] px-4 py-3 text-sm">
          <strong>Get 500ml Mustard Oil</strong>
          <p>{unlock > 0 ? `Add ${formatPrice(unlock)} more to unlock!` : "Free gift unlocked!"}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-[#666]">
              <div><ShoppingBag className="mx-auto mb-4 h-16 w-16 text-brand-orange" /><p className="text-lg font-semibold">No items in your cart!</p></div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[72px_1fr] gap-3 rounded border border-[#dedede] p-3">
                  <img className="h-20 w-20 object-contain" src={item.image} alt={item.title} />
                  <div>
                    <h3 className="font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-brand-orange">{formatPrice(item.price)} x {item.quantity}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <QuantityControl quantity={item.quantity} onMinus={() => onQuantity(item, item.quantity - 1)} onPlus={() => onQuantity(item, item.quantity + 1)} compact />
                      <button type="button" aria-label="Remove item" onClick={() => onQuantity(item, 0)} className="text-[#777]"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex justify-between text-xl font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button type="button" onClick={onCheckout} disabled={items.length === 0} className="h-12 w-full rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">Checkout</button>
        </div>
      </aside>
    </>
  );
}

function AppModal({ modal, product, cartItems, wishlist, total, query, setQuery, results, onClose, onAdd, onDetails, onQuantity, onCheckout }: { modal: ModalType; product: Product | null; cartItems: CartItem[]; wishlist: Product[]; total: number; query: string; setQuery: (query: string) => void; results: Product[]; onClose: () => void; onAdd: (product: Product) => void; onDetails: (product: Product) => void; onQuantity: (product: Product, quantity: number) => void; onCheckout: () => void }) {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <section className="max-h-[88vh] w-full max-w-[620px] overflow-y-auto rounded-lg bg-white p-5 shadow-float">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">{modalTitle(modal, product)}</h2>
          <button type="button" aria-label="Close" onClick={onClose}><X className="h-7 w-7" /></button>
        </div>
        {modal === "signin" ? <SignInForm /> : null}
        {modal === "track" ? <TrackForm /> : null}
        {modal === "about" ? <AboutPanel /> : null}
        {modal === "checkout" ? <CheckoutPanel items={cartItems} total={total} onQuantity={onQuantity} /> : null}
        {modal === "wishlist" ? <ProductList products={wishlist} empty="Wishlist empty." onAdd={onAdd} onDetails={onDetails} /> : null}
        {modal === "search" ? (
          <div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="mb-4 h-12 w-full rounded border px-4 outline-none focus:border-brand-orange" placeholder="Search products..." />
            <ProductList products={results.slice(0, 8)} empty="No product found." onAdd={onAdd} onDetails={onDetails} />
          </div>
        ) : null}
        {modal === "details" && product ? <ProductDetails product={product} onAdd={onAdd} onCheckout={onCheckout} /> : null}
      </section>
    </div>
  );
}

function modalTitle(modal: ModalType, product: Product | null) {
  if (modal === "details") return product?.title ?? "Product Details";
  if (modal === "signin") return "Sign In";
  if (modal === "track") return "Track Order";
  if (modal === "wishlist") return "Wishlist";
  if (modal === "checkout") return "Checkout";
  if (modal === "search") return "Search Products";
  return "More";
}

function SignInForm() {
  return (
    <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
      <input className="h-12 w-full rounded border px-4 outline-none focus:border-brand-orange" placeholder="Phone or email" />
      <input className="h-12 w-full rounded border px-4 outline-none focus:border-brand-orange" type="password" placeholder="Password" />
      <button className="h-12 w-full rounded bg-brand-orange font-bold text-white">Sign In</button>
      <p className="text-sm text-[#666]">Demo frontend: submit করলে page reload হবে না। Backend/API দিলে real login বসানো যাবে।</p>
    </form>
  );
}

function TrackForm() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
    const data = await response.json();
    setResult(response.ok ? `Status: ${data.status}. Tracking: ${data.trackingCode}. Total: ${formatPrice(data.total)}` : data.message);
    setLoading(false);
  }

  return (
    <form className="space-y-3" onSubmit={track}>
      <input value={orderId} onChange={(event) => setOrderId(event.target.value)} required className="h-12 w-full rounded border px-4 outline-none focus:border-brand-orange" placeholder="Order ID" />
      <input value={phone} onChange={(event) => setPhone(event.target.value)} required className="h-12 w-full rounded border px-4 outline-none focus:border-brand-orange" placeholder="Phone number" />
      {result ? <p className="rounded bg-[#fff2e7] p-3 text-sm font-semibold">{result}</p> : null}
      <button disabled={loading} className="h-12 w-full rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">
        {loading ? "Checking..." : "Track Order"}
      </button>
    </form>
  );
}

function CheckoutPanel({ items, total, onQuantity }: { items: CartItem[]; total: number; onQuantity: (product: Product, quantity: number) => void }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(80);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bkash" | "nagad" | "card">("cash");

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      paymentMethod,
      deliveryCharge,
      items: items.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    setSubmitting(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      setStatus(error.message ?? "Order failed");
      setSubmitting(false);
      return;
    }

    const order = await response.json();
    setStatus(`Order placed. Order ID: ${order.id}. Tracking: ${order.trackingCode}`);
    event.currentTarget.reset();
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <ProductList products={items} empty="Cart empty." onAdd={(product) => onQuantity(product, 1)} onDetails={() => undefined} />
      <div className="rounded bg-[#f7f7f7] p-4">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
        <div className="mt-2 flex justify-between text-[#666]"><span>Delivery</span><span>{formatPrice(deliveryCharge)}</span></div>
        <div className="mt-2 flex justify-between text-xl font-bold"><span>Total</span><span>{formatPrice(total + deliveryCharge)}</span></div>
      </div>
      {status ? <p className="rounded bg-[#fff2e7] p-3 text-sm font-semibold">{status}</p> : null}
      <form className="grid gap-3" onSubmit={submitOrder}>
        <input name="customerName" required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Full name" />
        <input name="phone" required className="h-12 rounded border px-4 outline-none focus:border-brand-orange" placeholder="Phone number" />
        <label className="grid gap-1 text-sm font-semibold">
          Delivery Area
          <select
            value={deliveryCharge}
            onChange={(event) => setDeliveryCharge(Number(event.target.value))}
            className="h-12 rounded border px-4 font-normal outline-none focus:border-brand-orange"
          >
            <option value={80}>Inside Dhaka - ৳80</option>
            <option value={130}>Outside Dhaka - ৳130</option>
            <option value={0}>Store pickup - Free</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Payment Method
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as "cash" | "bkash" | "nagad" | "card")}
            className="h-12 rounded border px-4 font-normal outline-none focus:border-brand-orange"
          >
            <option value="cash">Cash on Delivery</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="card">Card</option>
          </select>
        </label>
        <textarea name="address" required className="min-h-24 rounded border px-4 py-3 outline-none focus:border-brand-orange" placeholder="Delivery address" />
        <button disabled={items.length === 0 || submitting} className="h-12 rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]">
          {submitting ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

function ProductDetails({ product, onAdd, onCheckout }: { product: Product; onAdd: (product: Product) => void; onCheckout: () => void }) {
  return (
    <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
      <img className="mx-auto max-h-[260px] object-contain" src={product.image} alt={product.title} />
      <div>
        <p className="text-sm font-semibold text-brand-orange">{product.category}</p>
        <p className="mt-3 text-3xl font-extrabold text-brand-orange">{formatPrice(product.price)}</p>
        {product.oldPrice ? <p className="text-[#777] line-through">{formatPrice(product.oldPrice)}</p> : null}
        <p className="mt-4 leading-7 text-[#666]">Safe and reliable food product from Ghorer Bazar. Add it to cart or buy now to continue checkout.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onAdd(product)} className="h-12 rounded border border-brand-orange font-bold text-brand-orange">Add To Cart</button>
          <button type="button" onClick={() => { onAdd(product); onCheckout(); }} className="h-12 rounded bg-brand-orange font-bold text-white">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

function ProductList({ products: list, empty, onAdd, onDetails }: { products: Product[]; empty: string; onAdd: (product: Product) => void; onDetails: (product: Product) => void }) {
  if (list.length === 0) return <p className="rounded bg-[#f7f7f7] p-4 text-center text-[#666]">{empty}</p>;
  return (
    <div className="space-y-3">
      {list.map((product) => (
        <div key={product.id} className="grid grid-cols-[70px_1fr_auto] items-center gap-3 rounded border p-3">
          <img className="h-16 w-16 object-contain" src={product.image} alt={product.title} />
          <button type="button" onClick={() => onDetails(product)} className="text-left">
            <strong className="block leading-tight">{product.title}</strong>
            <span className="text-brand-orange">{formatPrice(product.price)}</span>
          </button>
          <button type="button" onClick={() => onAdd(product)} className="h-9 rounded bg-brand-orange px-3 text-sm font-bold text-white">Add</button>
        </div>
      ))}
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="space-y-3 text-[#555]">
      <button type="button" className="flex min-h-11 w-full items-center gap-3 rounded bg-[#f6f6f6] px-3 text-left"><BadgeInfo className="h-5 w-5 text-brand-orange" /> About Us</button>
      <a href="https://api.whatsapp.com/send?phone=8809642922922" target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 rounded bg-[#f6f6f6] px-3"><MessageCircle className="h-5 w-5 text-brand-orange" /> WhatsApp</a>
      <a href="tel:09642922922" className="flex min-h-11 items-center gap-3 rounded bg-[#f6f6f6] px-3"><Phone className="h-5 w-5 text-brand-orange" /> Call Us</a>
      <p>Live site-এর মতো quick actions রাখা হয়েছে। Backend/API দিলে এগুলো real account/order data দেখাতে পারবে।</p>
    </div>
  );
}

function Drawer({ menuOpen, setMenuOpen, onModal, onCategory, wishlistCount }: { menuOpen: boolean; setMenuOpen: (value: boolean) => void; onModal: (modal: ModalType) => void; onCategory: (category: string) => void; wishlistCount: number }) {
  return (
    <>
      {!menuOpen ? null : <button type="button" aria-label="Close menu overlay" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
      <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className={`drawer-close-position fixed top-[25px] z-[46] h-[38px] w-[38px] text-white transition-opacity lg:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}><X className="h-[38px] w-[38px] stroke-[1.7]" /></button>
      <aside aria-hidden={!menuOpen} className={`phone-edge-left fixed bottom-0 top-0 z-[45] w-[min(74vw,326px)] overflow-y-auto bg-white px-[15px] pb-[90px] pt-[21px] transition-transform duration-300 max-[360px]:w-[78vw] lg:hidden ${menuOpen ? "visible translate-x-0" : "invisible -translate-x-[105%]"}`}>
        <button type="button" onClick={() => onModal("signin")} className="mb-[35px] grid w-full grid-cols-[58px_1fr] items-center gap-3.5 rounded-[9px] bg-brand-orange p-3 text-left text-white">
          <img className="h-[54px] w-[54px] rounded-full" src="https://ghorerbazar.com/assets/images/avatar.png" alt="" />
          <div><strong className="block text-xl font-medium leading-none">Hello there!</strong><span className="block text-xl font-medium leading-none">Signin</span></div>
        </button>
        <div className="rounded-md bg-[#f5f5f5] px-[15px] py-[18px]">
          {menuItems.map((label) => (
            <button key={label} type="button" onClick={() => onCategory(label)} className="flex min-h-[36px] w-full items-center justify-between border-b border-[#d9d9d9] text-left text-base leading-none text-[#31363d] last:border-b-0">
              {label}<ChevronRight className="h-5 w-5 text-[#777]" />
            </button>
          ))}
        </div>
        <section className="mt-[22px]">
          <h2 className="m-0 text-xl font-bold text-[#5d5d5d]">Quick Links</h2>
          <div className="my-3.5 h-0.5 w-10 bg-brand-orange" />
          <div className="rounded-md bg-[#f5f5f5] px-[15px] py-3.5">
            <button type="button" onClick={() => onModal("about")} className="flex min-h-[45px] w-full items-center gap-3.5 text-lg text-[#2f343a]"><BadgeInfo className="h-[27px] w-[27px] text-[#0b6571]" />About Us</button>
            <button type="button" onClick={() => onModal("wishlist")} className="flex min-h-[45px] w-full items-center gap-3.5 text-lg text-[#2f343a]"><Heart className="h-[27px] w-[27px] text-[#0b6571]" />Wishlists ({wishlistCount})</button>
          </div>
        </section>
      </aside>
    </>
  );
}

function FloatingCart({ cartCount, cartTotal, onClick }: { cartCount: number; cartTotal: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="phone-edge-right fixed top-[54%] z-20 w-14 -translate-y-1/2 overflow-hidden rounded-l-[5px] bg-white shadow-float lg:w-[70px]">
      <div className="grid h-[56px] place-items-center gap-0.5 bg-brand-orange px-1 py-2 text-[13px] leading-none text-white lg:text-sm">
        <ShoppingBag className="h-[21px] w-[21px] lg:h-5 lg:w-5" /><span>{cartCount} Items</span>
      </div>
      <strong className="block h-[29px] px-0.5 py-1.5 text-center text-base text-brand-orange lg:text-base">{formatPrice(cartTotal)}</strong>
    </button>
  );
}

function ChatButton() {
  return (
    <a href="https://api.whatsapp.com/send?phone=8809642922922" target="_blank" rel="noreferrer" aria-label="Chat" className="phone-edge-right fixed bottom-[86px] z-[22] mr-[19px] grid h-[61px] w-[61px] place-items-center rounded-[20px] bg-brand-orange text-white lg:bottom-12 lg:mr-[18px] lg:h-[56px] lg:w-[56px] lg:rounded-[16px]">
      <MessageCircle className="h-[34px] w-[34px] fill-white stroke-white lg:h-7 lg:w-7" />
    </a>
  );
}

function BottomNav({ cartCount, onMenuClick, onCart, onModal }: { cartCount: number; onMenuClick: () => void; onCart: () => void; onModal: (modal: ModalType) => void }) {
  return (
    <nav className="phone-edge-left phone-edge-right fixed bottom-0 z-30 grid h-[74px] grid-cols-5 items-center bg-brand-orange text-white lg:hidden">
      <BottomNavItem icon={<Home />} label="HOME" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      <BottomNavItem icon={<LayoutGrid />} label="MENU" onClick={onMenuClick} />
      <BottomNavItem icon={<ShoppingBag />} label="CART" count={cartCount} onClick={onCart} />
      <BottomNavItem icon={<Search />} label="SEARCH" onClick={() => onModal("search")} />
      <BottomNavItem icon={<UserRound />} label="ACCOUNT" onClick={() => onModal("signin")} />
    </nav>
  );
}

function BottomNavItem({ icon, label, count, onClick }: { icon: ReactNode; label: string; count?: number; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative grid justify-items-center gap-1 text-xs font-medium text-white no-underline">
      <span className="[&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-[1.8]">{icon}</span>
      {typeof count === "number" ? <b className="absolute -top-2.5 right-7 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[#283546] text-[13px]">{count}</b> : null}
      <span>{label}</span>
    </button>
  );
}

function Badge({ label, tone = "green" }: { label: string; tone?: Product["badgeTone"] }) {
  const color = tone === "red" ? "bg-[#ff3333]" : tone === "orange" ? "bg-brand-orange" : "bg-[#35c486]";
  return <span className={`absolute right-3 top-4 z-[1] rounded px-2 py-1 text-sm font-semibold text-white ${color}`}>{tone === "red" ? <Flame className="mr-1 inline h-4 w-4" /> : null}{label}</span>;
}

function SliderDots({
  className = "",
  count = 5,
  active = 0,
  onSelect,
}: {
  className?: string;
  count?: number;
  active?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className={`flex gap-3 ${className}`} aria-hidden={!onSelect}>
      {Array.from({ length: count }).map((_, index) => {
        const dotClass = `h-[9px] w-[9px] rounded-full border border-brand-orange ${
          active === index ? "bg-brand-orange" : "bg-transparent"
        }`;

        if (!onSelect) {
          return <span key={index} className={dotClass} />;
        }

        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onSelect(index)}
            className={dotClass}
          />
        );
      })}
    </div>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold leading-tight text-brand-ink lg:text-[30px]">{title}</h2>
        {action ? <button type="button" onClick={onAction} className="inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold tracking-[0.08em] text-brand-orange underline underline-offset-4 lg:text-xl">{action}<ArrowRight className="h-5 w-5" /></button> : null}
      </div>
      <div className="mt-3 border-b border-[#dedede]"><div className="h-1 w-10 rounded-full bg-brand-orange" /></div>
    </div>
  );
}

function QuantityControl({ quantity, compact = false, onMinus, onPlus }: { quantity: number; compact?: boolean; onMinus: () => void; onPlus: () => void }) {
  const size = compact ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className="flex items-center justify-center overflow-hidden rounded border border-brand-orange text-brand-orange">
      <button type="button" aria-label="Decrease quantity" onClick={onMinus} className={`${size} grid place-items-center`}><Minus className="h-4 w-4" /></button>
      <span className={`${compact ? "h-8 min-w-9" : "h-11 min-w-12"} grid place-items-center border-x border-brand-orange font-bold`}>{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={onPlus} className={`${size} grid place-items-center`}><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function IconButton({ label, children, onClick }: { label: string; children: ReactNode; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid place-items-center text-brand-ink">{children}</button>;
}

function Counter({ count }: { count: number }) {
  return <span className="absolute -right-2.5 -top-1 grid h-[23px] min-w-[23px] place-items-center rounded-full bg-brand-orange px-1 text-[13px] font-bold text-white">{count}</span>;
}
