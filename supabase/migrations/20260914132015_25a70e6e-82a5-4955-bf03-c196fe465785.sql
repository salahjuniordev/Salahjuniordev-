
CREATE TABLE IF NOT EXISTS public.hero_images (
  id uuid primary key default gen_random_uuid(),
  device text not null default 'desktop' check (device in ('desktop','mobile')),
  image_url text not null,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.hero_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_images TO authenticated;
GRANT ALL ON public.hero_images TO service_role;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hero_images' AND policyname='Public reads active hero images') THEN
    CREATE POLICY "Public reads active hero images" ON public.hero_images FOR SELECT USING (active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hero_images' AND policyname='Authenticated manage hero images') THEN
    CREATE POLICY "Authenticated manage hero images" ON public.hero_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ebooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price text not null default '',
  currency text not null default 'USD',
  cover_url text,
  buy_url text not null,
  badge text,
  order_index integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.ebooks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebooks TO authenticated;
GRANT ALL ON public.ebooks TO service_role;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ebooks' AND policyname='Public reads published ebooks') THEN
    CREATE POLICY "Public reads published ebooks" ON public.ebooks FOR SELECT USING (published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ebooks' AND policyname='Authenticated manage ebooks') THEN
    CREATE POLICY "Authenticated manage ebooks" ON public.ebooks FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'landing',
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Anyone can subscribe') THEN
    CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Authenticated read subscribers') THEN
    CREATE POLICY "Authenticated read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='newsletter_subscribers' AND policyname='Authenticated delete subscribers') THEN
    CREATE POLICY "Authenticated delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS case_study text;

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS availability_text text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS availability_live boolean not null default false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS intro_video_url text;
