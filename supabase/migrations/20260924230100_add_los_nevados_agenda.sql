-- Complementa a agenda pública da Casa de Aventura com a entrada
-- que ficou fora da primeira importação: Parque Nacional Los Nevados.

DO $$
DECLARE
  v_trip_id uuid;
  v_tag_viagens uuid;
BEGIN
  SELECT id INTO v_tag_viagens
  FROM public.tags
  WHERE lower(trim(name)) = 'viagens'
  LIMIT 1;

  IF v_tag_viagens IS NULL THEN
    INSERT INTO public.tags (id, name, sort_order)
    VALUES (gen_random_uuid(), 'Viagens', COALESCE((SELECT MAX(sort_order) + 1 FROM public.tags), 0))
    RETURNING id INTO v_tag_viagens;
  END IF;

  SELECT id INTO v_trip_id
  FROM public.trips
  WHERE slug = '19-a-28-agosto-2027-trekking-parque-nacional-los-nevados-pereira-colombia'
     OR lower(trim(name)) = lower(trim('19 a 28 AGOSTO 2027 – TREKKING Parque Nacional Los Nevados – PEREIRA – COLÔMBIA – 10 Dias'))
  LIMIT 1;

  IF v_trip_id IS NULL THEN
    INSERT INTO public.trips (
      slug, name, destination, state, activity_id, price, old_price, price_usd,
      investment_text, cancellation_policy, days, level, image_url, images,
      video_url, description, highlights, includes, rating, featured, published,
      tech_sheet, guide_text, guide_image_url, destination_text, prerequisites,
      characteristics, climate, food, itinerary, not_included, checklist,
      equipment, tags, created_at, updated_at
    )
    VALUES (
      '19-a-28-agosto-2027-trekking-parque-nacional-los-nevados-pereira-colombia',
      '19 a 28 AGOSTO 2027 – TREKKING Parque Nacional Los Nevados – PEREIRA – COLÔMBIA – 10 Dias',
      'Parque Nacional Los Nevados – Pereira',
      'COLÔMBIA',
      NULL,
      0,
      NULL,
      NULL,
      NULL,
      NULL,
      10,
      'Iniciante',
      NULL,
      '{}'::text[],
      '',
      'Trekking Parque Nacional Los Nevados – Pereira, Colômbia, 10 dias, conforme agenda pública da Casa de Aventura.',
      '{}',
      '{}',
      5,
      false,
      true,
      '[]'::jsonb,
      '',
      NULL,
      '',
      '{}',
      '',
      '',
      '',
      '[]'::jsonb,
      '{}',
      '{}',
      '{}',
      ARRAY[v_tag_viagens]::uuid[],
      now(),
      now()
    )
    RETURNING id INTO v_trip_id;
  ELSE
    UPDATE public.trips
    SET
      name = '19 a 28 AGOSTO 2027 – TREKKING Parque Nacional Los Nevados – PEREIRA – COLÔMBIA – 10 Dias',
      destination = 'Parque Nacional Los Nevados – Pereira',
      state = 'COLÔMBIA',
      days = 10,
      published = true,
      tags = ARRAY[v_tag_viagens]::uuid[],
      updated_at = now()
    WHERE id = v_trip_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.departures
    WHERE trip_id = v_trip_id AND date = '2027-08-19'::date
  ) THEN
    INSERT INTO public.departures (
      id, trip_id, date, return_date, spots, meeting_point, created_at
    )
    VALUES (
      gen_random_uuid(),
      v_trip_id,
      '2027-08-19'::date,
      '2027-08-28'::date,
      10,
      'Brusque/SC',
      now()
    );
  END IF;
END $$;
