CREATE TABLE public.whatsapp_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  trip_name TEXT NOT NULL,
  source TEXT NOT NULL,
  departure_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.whatsapp_clicks TO anon;
GRANT SELECT, INSERT, DELETE ON public.whatsapp_clicks TO authenticated;
GRANT ALL ON public.whatsapp_clicks TO service_role;

ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a whatsapp click"
ON public.whatsapp_clicks FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(trip_name) BETWEEN 1 AND 160
  AND source IN ('card', 'trip_page', 'fab')
);

CREATE POLICY "Admins can read whatsapp clicks"
ON public.whatsapp_clicks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete whatsapp clicks"
ON public.whatsapp_clicks FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_whatsapp_clicks_created_at ON public.whatsapp_clicks (created_at DESC);