"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageCircle, Minus, Phone, Plus, ShoppingBag, ShoppingCart, Star } from "lucide-react";
import { addCartItem } from "@/lib/cart-storage";
import { StorefrontHeader } from "@/components/storefront-header";
import type { Product } from "@/lib/types";

const formatPrice = (price: number) => `৳${price.toLocaleString("en-US")}`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => response.json())
      .then((items: Product[]) => {
        setProducts(items);
        setProduct(items.find((item) => item.id === params.id) ?? null);
      });
  }, [params.id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const relatedImages = products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .map((item) => item.image)
      .filter((image, index, list) => image && list.indexOf(image) === index)
      .slice(0, 3);
    return [product.image, ...relatedImages].slice(0, 4);
  }, [product, products]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);
  }, [product, products]);

  if (!product) {
    return <main className="grid min-h-screen place-items-center bg-brand-paper text-brand-ink">Product loading...</main>;
  }

  const selectedImage = gallery[activeImage] ?? product.image;
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;
  const disabled = product.stock === "out";

  const addToCart = () => {
    addCartItem(product, quantity);
    setMessage(`${quantity} item added to cart.`);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-brand-ink">
      <StorefrontHeader />
      <section className="mx-auto max-w-[1760px] px-4 py-6 lg:px-8">
        <div className="mb-5 text-sm text-[#666]">
          <Link href="/" className="hover:text-brand-orange">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/collections/${slugify(product.category)}`} className="hover:text-brand-orange">Products</Link>
        </div>

        <div className="grid gap-8 rounded-[14px] bg-white p-5 shadow-soft lg:grid-cols-[48%_1fr] lg:p-9">
          <div className="grid gap-5 lg:grid-cols-[124px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:grid lg:content-start lg:overflow-visible">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative grid h-[96px] w-[96px] shrink-0 place-items-center rounded border bg-white p-2 lg:h-[120px] lg:w-[120px] ${activeImage === index ? "border-brand-orange" : "border-[#e5e5e5]"}`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img className="max-h-full max-w-full object-contain" src={image} alt={product.title} />
                  {activeImage === index ? <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-brand-orange text-white"><ShoppingBag className="h-4 w-4" /></span> : null}
                </button>
              ))}
            </div>

            <div className="order-1 relative grid min-h-[390px] place-items-center rounded border border-[#e5e5e5] bg-white p-5 lg:order-2 lg:min-h-[620px]">
              <button type="button" onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)} className="absolute left-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-brand-orange" aria-label="Previous image">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <img className="max-h-[340px] max-w-full object-contain lg:max-h-[540px]" src={selectedImage} alt={product.title} />
              <button type="button" onClick={() => setActiveImage((activeImage + 1) % gallery.length)} className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-brand-orange" aria-label="Next image">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="lg:pt-5">
            <h1 className="text-[30px] font-semibold leading-tight lg:text-[38px]">{product.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-[#e5e5e5] pb-7">
              <strong className="text-[34px] font-extrabold text-brand-orange lg:text-[42px]">{formatPrice(product.price)}</strong>
              {product.oldPrice ? <span className="text-[24px] text-[#9a9a9a] line-through lg:text-[30px]">{formatPrice(product.oldPrice)}</span> : null}
              {discount ? <span className="rounded bg-[#35c486] px-3 py-2 text-sm font-bold text-white">Save{discount}%</span> : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <span className="text-xl font-semibold">Quantity:</span>
              <div className="grid h-[64px] w-[210px] grid-cols-3 overflow-hidden rounded border border-[#dedede]">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid place-items-center bg-[#f7f7f7]" aria-label="Decrease quantity">
                  <Minus className="h-5 w-5" />
                </button>
                <span className="grid place-items-center text-2xl font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid place-items-center bg-[#f7f7f7]" aria-label="Increase quantity">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {message ? <p className="mt-5 rounded bg-[#fff2e7] p-3 font-semibold">{message}</p> : null}

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <button type="button" onClick={addToCart} disabled={disabled} className="inline-flex h-[66px] items-center justify-center gap-3 rounded bg-brand-orange text-xl font-bold text-white disabled:bg-[#9ca3af]">
                <ShoppingBag className="h-6 w-6" />
                ADD TO CART
              </button>
              <Link href="/checkout" onClick={addToCart} className={`grid h-[66px] place-items-center rounded bg-[#002c26] text-xl font-bold text-white ${disabled ? "pointer-events-none opacity-60" : ""}`}>
                BUY NOW
              </Link>
              <a href={`https://wa.me/8809642922922?text=${encodeURIComponent(`I want to order ${product.title}`)}`} className="inline-flex h-[66px] items-center justify-center gap-3 rounded bg-[#20b15a] text-xl font-bold text-white">
                <MessageCircle className="h-6 w-6" />
                Order On WhatsApp
              </a>
              <a href="tel:09642922922" className="inline-flex h-[66px] items-center justify-center gap-3 rounded bg-[#263f92] text-xl font-bold text-white">
                <Phone className="h-6 w-6" />
                Call For Order
              </a>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-[12px] bg-white p-4 shadow-soft lg:p-9">
          <div className="mb-7 flex flex-wrap gap-4">
            <button type="button" onClick={() => setActiveTab("description")} className={`h-14 rounded px-8 text-lg font-semibold ${activeTab === "description" ? "bg-[#f7f7f7] text-brand-ink" : "bg-white text-[#666]"}`}>Description</button>
            <button type="button" onClick={() => setActiveTab("reviews")} className={`h-14 rounded px-8 text-lg font-semibold ${activeTab === "reviews" ? "bg-[#f7f7f7] text-brand-ink" : "bg-white text-[#666]"}`}>Customer Reviews (0)</button>
          </div>
          {activeTab === "description" ? <ProductDescription product={product} /> : <ReviewBox />}
        </section>

        <section className="mt-10">
          <div className="mb-7 flex items-center justify-between border-b border-[#d7d7d7] pb-7">
            <h2 className="text-[30px] font-bold">Related Products</h2>
            <Link href={`/collections/${slugify(product.category)}`} className="text-xl font-semibold text-brand-orange">More Products →</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,219px)] lg:justify-between">
            {relatedProducts.map((item) => <RelatedProductCard key={item.id} product={item} />)}
          </div>
        </section>
      </section>
    </main>
  );
}

function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="max-w-none text-lg leading-8 text-[#111]">
      <h2 className="mb-5 text-[28px] font-bold text-brand-ink">Product Details</h2>
      <div className="mb-8 h-1 w-[90px] rounded-full bg-brand-orange" />
      <p className="mb-5 font-bold">{product.title}</p>
      <p className="mb-7">
        {product.title} is listed in our {product.category} collection. Order online from Griho Bazar and keep your grocery shopping simple, fresh and reliable.
      </p>
      <h3 className="mb-3 font-bold">Why Choose This Product?</h3>
      <ul className="ml-7 list-disc space-y-2">
        <li><strong>Quality Checked:</strong> Products are reviewed before listing.</li>
        <li><strong>Easy Ordering:</strong> Add to cart, buy now, WhatsApp order and phone order options are available.</li>
        <li><strong>Home Delivery:</strong> Delivery charge will be calculated during checkout.</li>
      </ul>
      <hr className="my-7" />
      <h3 className="mb-3 font-bold">Payment Information:</h3>
      <ul className="ml-7 list-disc space-y-2">
        <li><strong>Cash on Delivery:</strong> Available for regular orders.</li>
        <li><strong>Manual Payment:</strong> bKash/Nagad transaction ID can be verified by admin.</li>
      </ul>
    </div>
  );
}

function ReviewBox() {
  return (
    <div className="grid gap-8 lg:grid-cols-[430px_1fr]">
      <div>
        <div className="flex items-end gap-5">
          <strong className="text-[70px] leading-none text-[#002c26]">0.0</strong>
          <div className="pb-3 text-[#666]">
            <p>Average Rating</p>
            <div className="mt-2 flex text-[#d1d5db]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5" />)} <span className="ml-2">(0 Reviews)</span></div>
          </div>
        </div>
        <p className="mt-6 text-3xl font-bold">0.00% <span className="text-base font-normal text-[#666]">Recommended</span></p>
      </div>
      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <h2 className="text-[28px] font-bold">Submit Your Review</h2>
        <div className="h-1 w-[90px] rounded-full bg-brand-orange" />
        <p className="text-[#666]">Your email address will not be published. Required fields are marked *</p>
        <textarea className="min-h-[170px] rounded border p-4 outline-none focus:border-brand-orange" placeholder="Write Your Review Here..." />
        <select className="h-14 rounded border px-4 outline-none focus:border-brand-orange">
          <option>Select One</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
        </select>
        <button className="h-14 justify-self-start rounded bg-[#444] px-12 font-bold text-white">SUBMIT REVIEW</button>
      </form>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  return (
    <article className="relative flex min-h-[380px] flex-col rounded-[5px] border border-[#d7d7d7] bg-white p-3 lg:h-[352px] lg:min-h-[352px]">
      {product.badge ? <span className="absolute right-3 top-4 rounded bg-[#35c486] px-2 py-1 text-xs font-semibold text-white">{product.badge}</span> : null}
      <Link href={`/products/${product.id}`} className="block">
        <div className="group grid h-[210px] place-items-center overflow-hidden p-4 lg:h-[198px]">
          <img className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-focus-within:scale-110" src={product.image} alt={product.title} />
        </div>
        <h3 className="min-h-[48px] overflow-hidden text-[16px] font-normal leading-[1.35] text-[#020101] lg:min-h-[44px] lg:text-[16px]">{product.title}</h3>
      </Link>
      <div className="mt-2 flex items-center gap-2">
        <strong className="text-[19px] font-bold text-brand-orange">{formatPrice(product.price)}</strong>
        {product.oldPrice ? <span className="text-[15px] text-[#9a9a9a] line-through">{formatPrice(product.oldPrice)}</span> : null}
      </div>
      <button type="button" onClick={() => { addCartItem(product); setAdded(true); }} className="mt-auto inline-flex h-[45px] w-full items-center justify-center gap-2 rounded border border-brand-orange text-base font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white focus-visible:bg-brand-orange focus-visible:text-white focus-visible:outline-none">
        <ShoppingCart className="h-5 w-5" />
        {added ? "Added" : "Add To Cart"}
      </button>
    </article>
  );
}
