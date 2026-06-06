create table if not exists public.products (
  id text primary key,
  title text not null,
  category text not null,
  image text not null,
  price integer not null,
  old_price integer,
  badge text,
  badge_tone text,
  stock text default 'in',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  slug text primary key,
  title text not null,
  image text not null,
  created_at timestamptz default now()
);

create table if not exists public.banners (
  id text primary key,
  title text not null,
  image text not null,
  mobile_image text,
  category text not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  status text not null default 'pending',
  payment_method text not null default 'cash',
  payment_status text not null default 'unpaid',
  payment_transaction_id text,
  delivery_charge integer not null default 0,
  tracking_code text not null,
  items jsonb not null,
  total integer not null,
  created_at timestamptz default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null
);

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.banners enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public read products" on public.products;
drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read banners" on public.banners;
drop policy if exists "public read settings" on public.settings;

create policy "public read products" on public.products for select using (true);
create policy "public read categories" on public.categories for select using (true);
create policy "public read banners" on public.banners for select using (true);
create policy "public read settings" on public.settings for select using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
