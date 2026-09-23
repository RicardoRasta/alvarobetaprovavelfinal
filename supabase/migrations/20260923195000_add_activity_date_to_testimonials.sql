-- Add the activity date without changing or deleting existing testimonials.
-- NULL is intentional for legacy testimonials that do not have this information.
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS activity_date DATE NULL;
