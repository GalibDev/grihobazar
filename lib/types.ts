export type StockStatus = "in" | "out" | "preorder";

export type Product = {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  badgeTone?: "green" | "orange" | "red";
  stock?: StockStatus;
  featured?: boolean;
};

export type Category = {
  title: string;
  image: string;
  slug: string;
};

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  paymentMethod: "cash" | "bkash" | "nagad" | "card";
  paymentStatus: "unpaid" | "paid" | "failed";
  deliveryCharge: number;
  trackingCode: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
};

export type StoreData = {
  products: Product[];
  categories: Category[];
  orders: Order[];
};
