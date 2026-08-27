-- trips: video + tags
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '';
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- departures: meeting point
ALTER TABLE public.departures ADD COLUMN IF NOT EXISTS meeting_point text NOT NULL DEFAULT '';

-- site settings: phone, hero slides, footer, about
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '4733511661';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_images text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_email text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS instagram_url text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS facebook_url text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS youtube_url text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_text text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_title text NOT NULL DEFAULT 'Quem somos';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_text text NOT NULL DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS about_image_url text;

UPDATE public.site_settings SET phone = '4733511661', whatsapp_number = '554733511661' WHERE id = 1;

-- tags
CREATE TABLE IF NOT EXISTS public.tags (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags public read" ON public.tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tags admin write" ON public.tags FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates public read" ON public.certificates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "certificates admin write" ON public.certificates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trip_name text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  comment text NOT NULL,
  photos text[] NOT NULL DEFAULT '{}',
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read approved" ON public.testimonials FOR SELECT TO anon, authenticated USING (approved);
CREATE POLICY "testimonials admin read" ON public.testimonials FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "testimonials public insert" ON public.testimonials FOR INSERT TO anon, authenticated
  WITH CHECK (
    approved = false
    AND char_length(btrim(name)) BETWEEN 2 AND 80
    AND char_length(btrim(comment)) BETWEEN 5 AND 2000
    AND rating BETWEEN 1 AND 5
    AND char_length(trip_name) <= 160
    AND coalesce(array_length(photos, 1), 0) <= 6
  );
CREATE POLICY "testimonials admin update" ON public.testimonials FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "testimonials admin delete" ON public.testimonials FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text,
  images text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog public read published" ON public.blog_posts FOR SELECT TO anon USING (published);
CREATE POLICY "blog auth read" ON public.blog_posts FOR SELECT TO authenticated USING (published OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "blog admin write" ON public.blog_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- enrollment links
CREATE TABLE IF NOT EXISTS public.enrollment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  trip_name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.enrollment_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollment_links TO authenticated;
GRANT ALL ON public.enrollment_links TO service_role;
ALTER TABLE public.enrollment_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollment links public read active" ON public.enrollment_links FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "enrollment links admin write" ON public.enrollment_links FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- enrollments (fichas de inscrição)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES public.enrollment_links(id) ON DELETE SET NULL,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  trip_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  cpf text NOT NULL DEFAULT '',
  birth_date date,
  passport text NOT NULL DEFAULT '',
  profession text NOT NULL DEFAULT '',
  zip_code text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  street text NOT NULL DEFAULT '',
  number text NOT NULL DEFAULT '',
  height text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  shirt_size text NOT NULL DEFAULT '',
  shoe_size text NOT NULL DEFAULT '',
  blood_type text NOT NULL DEFAULT '',
  heart_condition boolean NOT NULL DEFAULT false,
  heart_condition_detail text NOT NULL DEFAULT '',
  allergy boolean NOT NULL DEFAULT false,
  allergy_detail text NOT NULL DEFAULT '',
  food_restriction text NOT NULL DEFAULT '',
  health_plan text NOT NULL DEFAULT '',
  health_notes text NOT NULL DEFAULT '',
  vaccine_rabies boolean NOT NULL DEFAULT false,
  vaccine_yellow_fever boolean NOT NULL DEFAULT false,
  vaccine_covid boolean NOT NULL DEFAULT false,
  emergency_contact text NOT NULL DEFAULT '',
  outdoor_practitioner text NOT NULL DEFAULT '',
  routine_activity text NOT NULL DEFAULT '',
  previous_events text NOT NULL DEFAULT '',
  expectations text NOT NULL DEFAULT '',
  how_found_us text NOT NULL DEFAULT '',
  risk_terms_accepted boolean NOT NULL DEFAULT false,
  payment_method text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enrollments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments admin read" ON public.enrollments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "enrollments admin delete" ON public.enrollments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "enrollments public insert with link" ON public.enrollments FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(full_name)) BETWEEN 2 AND 120
    AND risk_terms_accepted = true
    AND EXISTS (SELECT 1 FROM public.enrollment_links l WHERE l.id = enrollments.link_id AND l.active)
  );