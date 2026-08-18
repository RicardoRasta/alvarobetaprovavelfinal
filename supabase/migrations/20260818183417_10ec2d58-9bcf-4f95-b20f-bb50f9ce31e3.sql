ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS tech_sheet jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS guide_text text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guide_image_url text,
  ADD COLUMN IF NOT EXISTS destination_text text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS prerequisites text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS characteristics text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS climate text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS food text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS not_included text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS checklist text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS equipment text[] NOT NULL DEFAULT '{}'::text[];