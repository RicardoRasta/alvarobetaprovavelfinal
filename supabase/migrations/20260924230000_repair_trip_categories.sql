-- Repara a classificação dos roteiros entre Viagens e Cursos.
-- Também cobre registros antigos que não receberam a tag "Cursos".

DO $$
DECLARE
  v_cursos uuid;
  v_viagens uuid;
  v_curso_aca uuid;
BEGIN
  INSERT INTO public.tags (id, name, sort_order)
  SELECT gen_random_uuid(), x.name, COALESCE((SELECT MAX(sort_order) + 1 FROM public.tags), 0)
  FROM (VALUES ('Cursos'), ('Viagens'), ('Curso ACA')) AS x(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tags t
    WHERE lower(trim(t.name)) = lower(trim(x.name))
  );

  SELECT id INTO v_cursos
  FROM public.tags
  WHERE lower(trim(name)) = 'cursos'
  LIMIT 1;

  SELECT id INTO v_viagens
  FROM public.tags
  WHERE lower(trim(name)) = 'viagens'
  LIMIT 1;

  SELECT id INTO v_curso_aca
  FROM public.tags
  WHERE lower(trim(name)) = 'curso aca'
  LIMIT 1;

  UPDATE public.trips t
  SET tags = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(COALESCE(t.tags, '{}'::uuid[])) AS x
      JOIN public.tags tg ON tg.id = x
      WHERE lower(trim(tg.name)) <> 'cursos'
        AND lower(trim(tg.name)) <> 'viagens'
        AND lower(trim(tg.name)) NOT LIKE 'curso %'
    )
    || CASE
      WHEN EXISTS (
        SELECT 1
        FROM unnest(COALESCE(t.tags, '{}'::uuid[])) AS x
        JOIN public.tags tg ON tg.id = x
        WHERE lower(trim(tg.name)) = 'cursos'
           OR lower(trim(tg.name)) LIKE 'curso %'
      )
      OR lower(trim(t.name)) LIKE '%curso %'
      THEN ARRAY[v_cursos]
      ELSE ARRAY[v_viagens]
    END
    || CASE
      WHEN EXISTS (
        SELECT 1
        FROM unnest(COALESCE(t.tags, '{}'::uuid[])) AS x
        JOIN public.tags tg ON tg.id = x
        WHERE lower(trim(tg.name)) = 'curso aca'
      )
      THEN ARRAY[v_curso_aca]
      ELSE '{}'::uuid[]
    END
  ),
  updated_at = now()
  WHERE true;
END $$;
