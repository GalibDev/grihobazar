"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClipboardEvent, DragEvent, ReactNode } from "react";
import {
  Boxes,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  LogOut,
  LayoutDashboard,
  Loader2,
  Plus,
  Printer,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Banner, Category, Order, Product, StockStatus, StoreSettings } from "@/lib/types";

const emptyProduct: Product = {
  id: "",
  title: "",
  category: "Honey",
  image: "",
  price: 0,
  oldPrice: undefined,
  badge: "",
  badgeTone: "green",
  stock: "in",
  featured: false,
};

const emptyCategory: Category = {
  title: "",
  slug: "",
  image: "",
};

const emptyBanner: Banner = {
  id: "",
  title: "",
  image: "",
  mobileImage: "",
  category: "Honey",
  active: true,
};

const defaultSettings: StoreSettings = {
  insideDhakaDelivery: 80,
  outsideDhakaDelivery: 130,
  pickupDelivery: 0,
  bkashNumber: "",
  nagadNumber: "",
  whatsappNumber: "",
};

const requiredCategoryNames = [
  "Honey",
  "Dates",
  "Spices",
  "Nuts & Seeds",
  "Mango",
  "Flours & Lentils",
  "Oil & Ghee",
  "Beverage",
  "Organic",
  "Exclusive Combo Deals",
  "Cooking Essentials",
  "Organic Certified",
  "Just For You",
  "Our Brands",
];

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [orders, setOrders] = useState<Order[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);
  const [categoryDraft, setCategoryDraft] = useState<Category>(emptyCategory);
  const [bannerDraft, setBannerDraft] = useState<Banner>(emptyBanner);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productQuery, setProductQuery] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("All");
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggingImage, setDraggingImage] = useState(false);
  const [message, setMessage] = useState("");

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const stockOut = products.filter((product) => product.stock === "out").length;
  const lowStockProducts = products.filter((product) => product.stock === "out" || product.stock === "preorder");
  const filteredProducts = products.filter((product) => {
    const matchesCategory = matchesAdminCategory(product, selectedProductCategory);
    const matchesQuery = `${product.title} ${product.category} ${product.stock ?? ""}`.toLowerCase().includes(productQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customerName} ${order.phone} ${order.status}`.toLowerCase().includes(orderQuery.toLowerCase()),
  );

  const categoryNames = useMemo(() => {
    return Array.from(new Set([...categories.map((category) => category.title), ...products.map((product) => product.category), ...requiredCategoryNames]));
  }, [categories, products]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [productResponse, categoryResponse, orderResponse, bannerResponse, settingsResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
      fetch("/api/orders"),
      fetch("/api/banners"),
      fetch("/api/settings"),
    ]);

    setProducts(await productResponse.json());
    setCategories(await categoryResponse.json());
    setOrders(await orderResponse.json());
    setBanners(await bannerResponse.json());
    setSettings(await settingsResponse.json());
    setLoading(false);
  }

  function startEdit(product: Product) {
    setDraft({ ...product });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setDraft({ ...emptyProduct, category: categoryNames[0] ?? "Honey" });
    setEditingId(null);
  }

  async function saveProduct() {
    if (!draft.title.trim() || !draft.image.trim() || draft.price <= 0) {
      setMessage("Product title, image and price লাগবে।");
      return;
    }

    setSaving(true);
    const payload = {
      ...draft,
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : undefined,
      price: Number(draft.price),
      badge: draft.badge?.trim() || undefined,
    };

    const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message ?? "Save failed");
      setSaving(false);
      return;
    }

    setMessage(editingId ? "Product update হয়েছে।" : "নতুন product add হয়েছে।");
    resetForm();
    await loadData();
    setSaving(false);
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setMessage("Product delete হয়েছে।");
    await loadData();
  }

  async function uploadImage(file: File | null, source: "upload" | "paste" | "drop" = "upload") {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Only image file upload korte parben.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();

    if (response.ok) {
      setDraft((current) => ({ ...current, image: result.url }));
      if (source === "paste") {
        setMessage("Pasted image upload hoyeche.");
        setUploading(false);
        return;
      }
      if (source === "drop") {
        setMessage("Dropped image upload hoyeche.");
        setUploading(false);
        return;
      }
      setMessage("Image upload হয়েছে।");
    } else {
      setMessage(result.message ?? "Upload failed");
    }

    setUploading(false);
  }

  function handleImagePaste(event: ClipboardEvent<HTMLLabelElement>) {
    const items = Array.from(event.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (imageItem) {
      event.preventDefault();
      void uploadImage(imageItem.getAsFile(), "paste");
      return;
    }

    const pastedText = event.clipboardData.getData("text").trim();
    if (/^https?:\/\/.+\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(pastedText)) {
      event.preventDefault();
      setDraft((current) => ({ ...current, image: pastedText }));
      setMessage("Pasted image URL ready. Save chapun.");
    }
  }

  function handleImageDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDraggingImage(true);
  }

  function handleImageDragLeave(event: DragEvent<HTMLLabelElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDraggingImage(false);
    }
  }

  function handleImageDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDraggingImage(false);
    const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("image/"));

    if (!file) {
      setMessage("Drag kore sudhu image file drop korun.");
      return;
    }

    void uploadImage(file, "drop");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function updateOrderStatus(id: string, status: Order["status"]) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadData();
  }

  async function updateOrderPayment(order: Order, paymentStatus: Order["paymentStatus"]) {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    setMessage(`Payment marked ${paymentStatus}.`);
    await loadData();
  }

  async function saveCategory() {
    if (!categoryDraft.title || !categoryDraft.image) {
      setMessage("Category title and image are required.");
      return;
    }

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryDraft),
    });
    const result = await response.json();
    setMessage(response.ok ? "Category added." : result.message ?? "Category save failed.");

    if (response.ok) {
      setCategoryDraft(emptyCategory);
      await loadData();
    }
  }

  async function deleteCategory(slug: string) {
    await fetch(`/api/categories/${slug}`, { method: "DELETE" });
    setMessage("Category deleted.");
    await loadData();
  }

  async function saveBanner() {
    if (!bannerDraft.title || !bannerDraft.image || !bannerDraft.category) {
      setMessage("Banner title, image and category are required.");
      return;
    }

    const response = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bannerDraft),
    });
    const result = await response.json();
    setMessage(response.ok ? "Banner added." : result.message ?? "Banner save failed.");

    if (response.ok) {
      setBannerDraft({ ...emptyBanner, category: categoryNames[0] ?? "Honey" });
      await loadData();
    }
  }

  async function toggleBanner(banner: Banner) {
    await fetch(`/api/banners/${banner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !banner.active }),
    });
    await loadData();
  }

  async function deleteBanner(id: string) {
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    setMessage("Banner deleted.");
    await loadData();
  }

  async function saveSettings() {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setMessage(response.ok ? "Settings updated." : "Settings update failed.");
    await loadData();
  }

  function printSelectedOrder() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-brand-ink">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded bg-brand-orange text-white">
              <LayoutDashboard className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold">Ghorer Bazar Admin</h1>
              <p className="text-sm text-[#666]">Products, inventory and orders</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded border border-brand-orange px-4 py-2 font-semibold text-brand-orange">Storefront</a>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded bg-brand-orange px-4 py-2 font-semibold text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard icon={<Boxes />} label="Products" value={products.length.toString()} />
          <StatCard icon={<ClipboardList />} label="Orders" value={orders.length.toString()} />
          <StatCard icon={<Loader2 />} label="Pending" value={pendingOrders.toString()} />
          <StatCard icon={<CheckCircle2 />} label="Sales" value={formatPrice(totalSales)} />
        </section>

        {lowStockProducts.length ? (
          <section className="rounded-lg border border-[#fed7aa] bg-[#fff7ed] p-4">
            <h2 className="mb-2 font-bold text-[#9a3412]">Low stock / attention</h2>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((product) => (
                <button key={product.id} type="button" onClick={() => startEdit(product)} className="rounded border border-[#fdba74] bg-white px-3 py-2 text-sm font-semibold">
                  {product.title} - {product.stock}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {message ? (
          <div className="flex items-center justify-between rounded border border-[#ffd5b2] bg-[#fff2e7] px-4 py-3 text-sm font-semibold text-brand-ink">
            {message}
            <button type="button" onClick={() => setMessage("")} aria-label="Close message">
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[390px_1fr]">
          <div className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              {editingId ? <Edit3 className="h-5 w-5 text-brand-orange" /> : <Plus className="h-5 w-5 text-brand-orange" />}
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid gap-3">
              <AdminInput label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
              <label className="grid gap-1 text-sm font-semibold">
                Category
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  className="h-11 rounded border px-3 font-normal outline-none focus:border-brand-orange"
                >
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <AdminInput label="Image URL" value={draft.image} onChange={(value) => setDraft({ ...draft, image: value })} />
              {draft.image ? (
                <div className="rounded border bg-[#f7f7f7] p-3">
                  <img className="mx-auto h-32 max-w-full object-contain" src={draft.image} alt="Product preview" />
                  <p className="mt-2 text-xs text-[#666]">Image ready. Product list-এ আনতে নিচের Save button চাপুন।</p>
                </div>
              ) : null}
              <label
                onPaste={handleImagePaste}
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                tabIndex={0}
                className={`grid gap-2 rounded border border-dashed p-3 text-sm font-semibold outline-none focus:border-brand-orange focus:bg-[#fff8f1] ${
                  draggingImage ? "border-brand-orange bg-[#fff8f1]" : "border-[#d1d5db]"
                }`}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
                  className="rounded border px-3 py-2 text-sm font-normal"
                />
                {uploading ? <span className="text-xs text-[#777]">Uploading...</span> : <span className="text-xs text-[#777]">Upload করার পর image preview দেখালে Save চাপতে হবে।</span>}
                <span className="text-xs text-[#777]">Image drag kore ekhane drop korun, ba ei box-e click kore Ctrl+V paste korun.</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Price" type="number" value={String(draft.price || "")} onChange={(value) => setDraft({ ...draft, price: Number(value) })} />
                <AdminInput label="Old Price" type="number" value={String(draft.oldPrice || "")} onChange={(value) => setDraft({ ...draft, oldPrice: Number(value) || undefined })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Badge" value={draft.badge ?? ""} onChange={(value) => setDraft({ ...draft, badge: value })} />
                <label className="grid gap-1 text-sm font-semibold">
                  Stock
                  <select
                    value={draft.stock ?? "in"}
                    onChange={(event) => setDraft({ ...draft, stock: event.target.value as StockStatus })}
                    className="h-11 rounded border px-3 font-normal outline-none focus:border-brand-orange"
                  >
                    <option value="in">In stock</option>
                    <option value="out">Stock out</option>
                    <option value="preorder">Preorder</option>
                  </select>
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  checked={Boolean(draft.featured)}
                  onChange={(event) => setDraft({ ...draft, featured: event.target.checked })}
                  type="checkbox"
                  className="h-4 w-4 accent-brand-orange"
                />
                Featured product
              </label>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded bg-brand-orange font-bold text-white disabled:bg-[#9ca3af]"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving" : "Save"}
                </button>
                <button type="button" onClick={resetForm} className="h-11 rounded border font-bold text-[#555]">
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white">
            <div className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-xl font-bold">Products</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-[#666]">
                  Category
                  <select
                    value={selectedProductCategory}
                    onChange={(event) => setSelectedProductCategory(event.target.value)}
                    className="h-10 min-w-[190px] rounded border px-3 text-sm font-normal normal-case tracking-normal text-brand-ink outline-none focus:border-brand-orange"
                  >
                    <option value="All">All categories</option>
                    {categoryNames.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
                  <input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} className="h-10 rounded border pl-9 pr-3 outline-none focus:border-brand-orange" placeholder="Search products" />
                </label>
                <span className="text-sm text-[#666]">{filteredProducts.length} shown / {products.length} total</span>
                <span className="text-sm text-[#666]">{stockOut} stock out</span>
              </div>
            </div>
            {loading ? (
              <div className="grid min-h-64 place-items-center text-[#777]">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="bg-[#f7f7f7]">
                    <tr>
                      <Th>Product</Th>
                      <Th>Category</Th>
                      <Th>Price</Th>
                      <Th>Stock</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#777]">
                          No products found for this category/search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img className="h-14 w-14 rounded border object-contain" src={product.image} alt={product.title} />
                              <div>
                                <strong className="block">{product.title}</strong>
                                <span className="text-xs text-[#777]">{product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3 font-bold text-brand-orange">{formatPrice(product.price)}</td>
                          <td className="px-4 py-3">{product.stock ?? "in"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button type="button" onClick={() => startEdit(product)} className="rounded border px-3 py-2 font-semibold">
                                Edit
                              </button>
                              <button type="button" onClick={() => deleteProduct(product.id)} className="rounded bg-[#ef4444] px-3 py-2 font-semibold text-white">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border bg-white">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-xl font-bold">Orders</h2>
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
              <input value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} className="h-10 rounded border pl-9 pr-3 outline-none focus:border-brand-orange" placeholder="Search orders" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#f7f7f7]">
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#777]">
                      No orders yet. Place an order from the storefront checkout.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="px-4 py-3">
                        <strong>{order.id}</strong>
                        <span className="block text-xs text-[#777]">{new Date(order.createdAt).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <strong>{order.customerName}</strong>
                        <span className="block text-xs text-[#777]">{order.phone}</span>
                      </td>
                      <td className="px-4 py-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                      <td className="px-4 py-3">
                        <strong className="block text-brand-orange">{formatPrice(order.total)}</strong>
                        <span className="text-xs text-[#777]">Delivery {formatPrice(order.deliveryCharge ?? 0)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <strong className="block uppercase">{order.paymentMethod ?? "cash"}</strong>
                        <span className="text-xs text-[#777]">{order.paymentStatus ?? "unpaid"}</span>
                        {order.paymentTransactionId ? <span className="block text-xs text-[#777]">TXN {order.paymentTransactionId}</span> : null}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value as Order["status"])}
                          className="h-10 rounded border px-3 outline-none focus:border-brand-orange"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setSelectedOrder(order)} className="grid h-9 w-9 place-items-center rounded border" aria-label="View order">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => updateOrderPayment(order, order.paymentStatus === "paid" ? "unpaid" : "paid")} className="rounded border px-3 py-2 text-xs font-bold">
                            {order.paymentStatus === "paid" ? "Unpaid" : "Paid"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 text-xl font-bold">Categories</h2>
            <div className="grid gap-3">
              <AdminInput label="Title" value={categoryDraft.title} onChange={(value) => setCategoryDraft({ ...categoryDraft, title: value })} />
              <AdminInput label="Slug" value={categoryDraft.slug} onChange={(value) => setCategoryDraft({ ...categoryDraft, slug: value })} />
              <AdminInput label="Image URL" value={categoryDraft.image} onChange={(value) => setCategoryDraft({ ...categoryDraft, image: value })} />
              <button type="button" onClick={saveCategory} className="h-11 rounded bg-brand-orange font-bold text-white">Add Category</button>
            </div>
            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center justify-between rounded border p-2 text-sm">
                  <span>{category.title}</span>
                  <button type="button" onClick={() => deleteCategory(category.slug)} className="text-[#ef4444]"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 text-xl font-bold">Banners / Slider</h2>
            <div className="grid gap-3">
              <AdminInput label="Title" value={bannerDraft.title} onChange={(value) => setBannerDraft({ ...bannerDraft, title: value })} />
              <AdminInput label="Image URL" value={bannerDraft.image} onChange={(value) => setBannerDraft({ ...bannerDraft, image: value })} />
              <AdminInput label="Mobile Image URL" value={bannerDraft.mobileImage ?? ""} onChange={(value) => setBannerDraft({ ...bannerDraft, mobileImage: value })} />
              <label className="grid gap-1 text-sm font-semibold">
                Category
                <select value={bannerDraft.category} onChange={(event) => setBannerDraft({ ...bannerDraft, category: event.target.value })} className="h-11 rounded border px-3 font-normal outline-none focus:border-brand-orange">
                  {categoryNames.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <button type="button" onClick={saveBanner} className="h-11 rounded bg-brand-orange font-bold text-white">Add Banner</button>
            </div>
            <div className="mt-4 space-y-2">
              {banners.map((banner) => (
                <div key={banner.id} className="rounded border p-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <strong>{banner.title}</strong>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => toggleBanner(banner)} className="rounded border px-2 py-1 text-xs">{banner.active ? "Active" : "Hidden"}</button>
                      <button type="button" onClick={() => deleteBanner(banner.id)} className="text-[#ef4444]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <span className="text-xs text-[#777]">{banner.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 text-xl font-bold">Delivery & Payment Settings</h2>
            <div className="grid gap-3">
              <AdminInput label="Inside Dhaka Delivery" type="number" value={String(settings.insideDhakaDelivery)} onChange={(value) => setSettings({ ...settings, insideDhakaDelivery: Number(value) })} />
              <AdminInput label="Outside Dhaka Delivery" type="number" value={String(settings.outsideDhakaDelivery)} onChange={(value) => setSettings({ ...settings, outsideDhakaDelivery: Number(value) })} />
              <AdminInput label="Pickup Delivery" type="number" value={String(settings.pickupDelivery)} onChange={(value) => setSettings({ ...settings, pickupDelivery: Number(value) })} />
              <AdminInput label="bKash Number" value={settings.bkashNumber} onChange={(value) => setSettings({ ...settings, bkashNumber: value })} />
              <AdminInput label="Nagad Number" value={settings.nagadNumber} onChange={(value) => setSettings({ ...settings, nagadNumber: value })} />
              <AdminInput label="WhatsApp Number" value={settings.whatsappNumber} onChange={(value) => setSettings({ ...settings, whatsappNumber: value })} />
              <button type="button" onClick={saveSettings} className="h-11 rounded bg-brand-orange font-bold text-white">Save Settings</button>
            </div>
          </div>
        </section>
      </div>

      {selectedOrder ? (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrint={printSelectedOrder}
          onPaid={(status) => updateOrderPayment(selectedOrder, status)}
        />
      ) : null}
    </main>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onPrint,
  onPaid,
}: {
  order: Order;
  onClose: () => void;
  onPrint: () => void;
  onPaid: (status: Order["paymentStatus"]) => void;
}) {
  const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Ghorer Bazar order ${order.id}: status ${order.status}, total ${formatPrice(order.total)}, tracking ${order.trackingCode}.`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <section className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-lg bg-white p-6 shadow-float print:max-h-none print:shadow-none">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h2 className="text-2xl font-extrabold">Order Details</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X className="h-6 w-6" /></button>
        </div>

        <div className="rounded border p-5" id="invoice">
          <div className="mb-5 flex items-start justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-2xl font-extrabold">Ghorer Bazar</h3>
              <p className="text-sm text-[#666]">Rampura, Dhaka, Bangladesh</p>
            </div>
            <div className="text-right">
              <strong className="block">{order.id}</strong>
              <span className="text-sm text-[#666]">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-bold">Customer</h4>
              <p>{order.customerName}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              {order.note ? <p className="text-sm text-[#666]">Note: {order.note}</p> : null}
            </div>
            <div>
              <h4 className="font-bold">Order</h4>
              <p>Status: {order.status}</p>
              <p>Tracking: {order.trackingCode}</p>
              <p>Payment: {order.paymentMethod} / {order.paymentStatus}</p>
              {order.paymentTransactionId ? <p>Transaction: {order.paymentTransactionId}</p> : null}
            </div>
          </div>

          <table className="mt-5 w-full text-left text-sm">
            <thead className="bg-[#f7f7f7]">
              <tr>
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Price</Th>
                <Th>Total</Th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-t">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ml-auto mt-5 max-w-[280px] space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(itemTotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatPrice(order.deliveryCharge)}</span></div>
            <div className="flex justify-between border-t pt-2 text-xl font-extrabold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 print:hidden sm:grid-cols-4">
          <button type="button" onClick={onPrint} className="inline-flex h-11 items-center justify-center gap-2 rounded border font-bold"><Printer className="h-4 w-4" /> Print</button>
          <button type="button" onClick={() => navigator.clipboard.writeText(message)} className="h-11 rounded border font-bold">Copy SMS</button>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="grid h-11 place-items-center rounded border font-bold">WhatsApp</a>
          <button type="button" onClick={() => onPaid(order.paymentStatus === "paid" ? "unpaid" : "paid")} className="h-11 rounded bg-brand-orange font-bold text-white">
            Mark {order.paymentStatus === "paid" ? "Unpaid" : "Paid"}
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded bg-[#fff2e7] text-brand-orange [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <p className="text-sm text-[#666]">{label}</p>
      <strong className="text-2xl">{value}</strong>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded border px-3 font-normal outline-none focus:border-brand-orange"
      />
    </label>
  );
}

function matchesAdminCategory(product: Product, selectedCategory: string) {
  if (selectedCategory === "All") return true;
  if (product.category === selectedCategory) return true;

  if (selectedCategory === "Cooking Essentials") {
    return ["Spices", "Flours & Lentils", "Oil & Ghee", "Rice"].includes(product.category);
  }

  if (selectedCategory === "Organic Certified") {
    return product.category === "Organic" || product.category === "Organic Certified" || /organic/i.test(product.title);
  }

  if (selectedCategory === "Just For You") {
    return product.category !== "Our Brands";
  }

  if (selectedCategory === "Exclusive Combo Deals") {
    return product.category === "Combos";
  }

  return false;
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
