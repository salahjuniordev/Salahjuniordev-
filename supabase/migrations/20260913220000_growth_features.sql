-- ── Growth feature set: newsletter, case studies, availability, intro video ──

-- 1) Newsletter subscribers (public signup, admin view)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'landing',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter public insert" on public.newsletter_subscribers;
create policy "newsletter public insert"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "newsletter admin read" on public.newsletter_subscribers;
create policy "newsletter admin read"
  on public.newsletter_subscribers for select
  using (auth.role() = 'authenticated');

drop policy if exists "newsletter admin delete" on public.newsletter_subscribers;
create policy "newsletter admin delete"
  on public.newsletter_subscribers for delete
  using (auth.role() = 'authenticated');

-- 2) Case-study content for project detail pages
alter table public.projects add column if not exists case_study text;

-- 3) Site settings: availability badge + intro video
alter table public.site_settings
  add column if not exists availability_text text,
  add column if not exists availability_live boolean default false,
  add column if not exists intro_video_url text;

-- Allow anonymous reads of the new columns (table uses column-level grants for anon)
GRANT SELECT (availability_text, availability_live, intro_video_url)
  ON public.site_settings TO anon, authenticated;
