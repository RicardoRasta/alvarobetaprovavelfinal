ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS price_usd numeric NULL,
  ADD COLUMN IF NOT EXISTS investment_text text NULL,
  ADD COLUMN IF NOT EXISTS cancellation_policy text NULL;
