create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text,
  dealership_name text,
  created_at timestamptz default now()
);

create table if not exists public.customers (
  id uuid primary key,
  full_name text not null,
  phone text,
  email text,
  source text,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.opportunities (
  id uuid primary key,
  customer_id uuid references public.customers(id) on delete cascade,
  unit_interest text,
  stage text,
  score integer,
  estimated_value numeric,
  next_action text,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key,
  stock_number text unique not null,
  year integer,
  make text,
  model text,
  price numeric,
  days_in_stock integer,
  online_views integer,
  recommendation text,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key,
  title text not null,
  due_at timestamptz,
  priority text,
  completed boolean default false,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.activity (
  id uuid primary key,
  action text not null,
  details text,
  user_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.opportunities enable row level security;
alter table public.inventory enable row level security;
alter table public.tasks enable row level security;
alter table public.activity enable row level security;

create policy "profiles are viewable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "profiles are manageable by authenticated users"
on public.profiles
for all
to authenticated
using (true)
with check (true);

create policy "customers are viewable by authenticated users"
on public.customers
for select
to authenticated
using (true);

create policy "customers are manageable by authenticated users"
on public.customers
for all
to authenticated
using (true)
with check (true);

create policy "opportunities are viewable by authenticated users"
on public.opportunities
for select
to authenticated
using (true);

create policy "opportunities are manageable by authenticated users"
on public.opportunities
for all
to authenticated
using (true)
with check (true);

create policy "inventory is viewable by authenticated users"
on public.inventory
for select
to authenticated
using (true);

create policy "inventory is manageable by authenticated users"
on public.inventory
for all
to authenticated
using (true)
with check (true);

create policy "tasks are viewable by authenticated users"
on public.tasks
for select
to authenticated
using (true);

create policy "tasks are manageable by authenticated users"
on public.tasks
for all
to authenticated
using (true)
with check (true);

create policy "activity is viewable by authenticated users"
on public.activity
for select
to authenticated
using (true);

create policy "activity is manageable by authenticated users"
on public.activity
for all
to authenticated
using (true)
with check (true);
