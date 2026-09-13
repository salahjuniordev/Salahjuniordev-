-- Hero portraits managed from the admin dashboard (no code changes needed)
create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  device text not null default 'both' check (device in ('desktop', 'mobile', 'both')),
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hero_images enable row level security;

drop policy if exists "hero_images public read" on public.hero_images;
create policy "hero_images public read"
  on public.hero_images for select
  using (published = true);

drop policy if exists "hero_images admin write" on public.hero_images;
create policy "hero_images admin write"
  on public.hero_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Sensible starting order
create index if not exists hero_images_order_idx on public.hero_images (order_index);
