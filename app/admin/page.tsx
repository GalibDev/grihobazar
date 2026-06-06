"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Boxes,
  CheckCircle2,
  ClipboardList,
  Edit3,
  LogOut,
  LayoutDashboard,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { Category, Order, Product, StockStatus } from "@/lib/types";

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

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [draft, setDraft] = useState<Product>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const stockOut = products.filter((product) => product.stock === "out").length;

  const categoryNames = useMemo(() => {
    const names = categories.map((category) => category.title);
    return names.length ? names : ["Honey", "Oil & Ghee", "Dates", "Spices", "Mango", "Organic"];
  }, [categories]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [productResponse, categoryResponse, orderResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
      fetch("/api/orders"),
    ]);

    setProducts(await productResponse.json());
    setCategories(await categoryResponse.json());
    setOrders(await orderResponse.json());
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

  async function uploadImage(file: File | null) {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();

    if (response.ok) {
      setDraft((current) => ({ ...current, image: result.url }));
      setMessage("Image upload হয়েছে।");
    } else {
      setMessage(result.message ?? "Upload failed");
    }

    setUploading(false);
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
              <label className="grid gap-1 text-sm font-semibold">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
                  className="rounded border px-3 py-2 text-sm font-normal"
                />
                {uploading ? <span className="text-xs text-[#777]">Uploading...</span> : <span className="text-xs text-[#777]">Upload করার পর image preview দেখালে Save চাপতে হবে।</span>}
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
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-xl font-bold">Products</h2>
              <span className="text-sm text-[#666]">{stockOut} stock out</span>
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
                    {products.map((product) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border bg-white">
          <div className="border-b px-5 py-4">
            <h2 className="text-xl font-bold">Orders</h2>
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
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#777]">
                      No orders yet. Place an order from the storefront checkout.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
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

function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
