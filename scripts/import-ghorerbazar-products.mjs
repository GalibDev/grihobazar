import { createClient } from "@supabase/supabase-js";

const SOURCE_URL = "https://ghorerbazar.com/";
const PLACEHOLDER_IMAGE = "/placeholders/product.svg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const decodeHtml = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const makeId = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const parsePrice = (value = "") => Number(value.replace(/[^0-9]/g, ""));

function categoryFor(section, title) {
  if (/mango/i.test(section)) return "Mango";
  if (/honey/i.test(section)) return "Honey";
  if (/dates/i.test(section)) return "Dates";
  if (/organic|certified/i.test(section)) return "Organic";
  if (/oil|ghee/i.test(title)) return "Oil & Ghee";
  if (/flour|gura|atta|lentil|dal/i.test(title)) return "Flours & Lentils";
  if (/cooking|spices/i.test(section)) return "Spices";
  if (/nut|seed|almond|cashew|chia/i.test(title)) return "Nuts & Seeds";
  return "Organic";
}

function badgeToneFor(badge) {
  if (!badge) return null;
  if (/pre\s*order|new/i.test(badge)) return "orange";
  return "green";
}

function parseProducts(html) {
  const headings = [...html.matchAll(/<h3 class="title">([\s\S]*?)<\/h3>/g)].map((match) => ({
    section: decodeHtml(match[1].replace(/<[^>]+>/g, "")),
    index: match.index,
  }));

  const products = [];

  headings.forEach(({ section, index }, headingIndex) => {
    if (section === "Our Brands") return;

    const nextIndex = headings[headingIndex + 1]?.index ?? html.length;
    const chunk = html.slice(index, nextIndex);
    const blocks = chunk.split(/<div class="swiper-slide product-wrap">/).slice(1);

    blocks.forEach((block) => {
      const titleMatch = block.match(/<h4 class="product-name">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const priceMatch = block.match(/class="new-price"[^>]*>([^<]+)/);

      if (!titleMatch || !priceMatch) return;

      const title = decodeHtml(titleMatch[1].replace(/<[^>]+>/g, ""));
      const oldPriceMatch = block.match(/class="old-price"[^>]*>([^<]+)/);
      const badgeMatch = block.match(/<span class="(?:save-label|product-label[^" ]*)"[^>]*>\s*([\s\S]*?)\s*<\/span>/);
      const badge = badgeMatch ? decodeHtml(badgeMatch[1].replace(/<[^>]+>/g, "")) : undefined;

      products.push({
        id: makeId(title),
        title,
        category: categoryFor(section, title),
        image: PLACEHOLDER_IMAGE,
        price: parsePrice(priceMatch[1]),
        old_price: oldPriceMatch ? parsePrice(oldPriceMatch[1]) : null,
        badge: badge || null,
        badge_tone: badgeToneFor(badge),
        stock: /pre\s*order/i.test(badge ?? "") ? "preorder" : "in",
        featured: false,
      });
    });
  });

  const seen = new Set();
  return products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

const html = await fetch(SOURCE_URL).then((response) => {
  if (!response.ok) throw new Error(`Failed to fetch source catalog: ${response.status}`);
  return response.text();
});

const sourceProducts = parseProducts(html);
const { data: currentProducts, error: currentError } = await supabase.from("products").select("id,title");
if (currentError) throw currentError;

const currentIds = new Set((currentProducts ?? []).map((product) => product.id));
const currentTitles = new Set((currentProducts ?? []).map((product) => makeId(product.title)));
const missingProducts = sourceProducts.filter((product) => !currentIds.has(product.id) && !currentTitles.has(product.id));

if (!missingProducts.length) {
  console.log("No missing products to import.");
  process.exit(0);
}

const { error: insertError } = await supabase.from("products").upsert(missingProducts);
if (insertError) throw insertError;

console.log(`Imported ${missingProducts.length} missing products.`);
