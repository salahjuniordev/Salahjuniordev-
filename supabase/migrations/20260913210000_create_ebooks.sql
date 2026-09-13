-- Ebooks: admin-managed digital products shown on the landing page.
-- Files themselves live in Gumroad (secure hosting + delivery after payment);
-- this table is the catalog: cover art, copy, price and the buy link.
create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  price text default '',
  currency text default 'USD',
  cover_url text,
  buy_url text not null,
  badge text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ebooks enable row level security;

drop policy if exists "ebooks public read" on public.ebooks;
create policy "ebooks public read"
  on public.ebooks for select
  using (published = true);

drop policy if exists "ebooks admin write" on public.ebooks;
create policy "ebooks admin write"
  on public.ebooks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists ebooks_order_idx on public.ebooks (order_index);
