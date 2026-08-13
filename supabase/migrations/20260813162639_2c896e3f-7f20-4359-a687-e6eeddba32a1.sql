ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS fx_usd numeric NOT NULL DEFAULT 5.40,
  ADD COLUMN IF NOT EXISTS fx_eur numeric NOT NULL DEFAULT 5.90,
  ADD COLUMN IF NOT EXISTS fx_updated_at timestamptz;