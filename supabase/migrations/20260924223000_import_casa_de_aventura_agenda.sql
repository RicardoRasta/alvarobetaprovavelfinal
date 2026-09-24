-- Importação idempotente da agenda pública da Casa de Aventura.
-- Fonte: https://www.casadeaventura.com.br/agenda/
-- A regra é preservar registros existentes e acrescentar somente o que estiver faltando.

DO $$
DECLARE
  v_tag_cursos public.tags.id%TYPE;
  v_tag_viagens public.tags.id%TYPE;
  v_trip_id public.trips.id%TYPE;
  v_existing_tags public.trips.tags%TYPE;
  v_name text;
  v_date date;
  v_return_date date;
  v_course boolean;
  v_course_aca boolean;
  v_price numeric;
  v_days integer;
  v_spots integer;
  v_meeting text;
  v_destination text;
  v_state text;
  v_slug text;
  v_description text;
  v_status_tags text[];
  v_tag_ids uuid[];
  r record;
BEGIN
  -- Categorias utilizadas pela separação Viagens / Cursos.
  INSERT INTO public.tags (id, name, sort_order)
  SELECT gen_random_uuid(), x.name, COALESCE((SELECT MAX(sort_order) + 1 FROM public.tags), 0)
  FROM (VALUES
    ('Cursos'), ('Viagens'), ('Confirmado'), ('Inscrições abertas'),
    ('Grupo privado'), ('Curso ACA'), ('Vagas limitadas')
  ) AS x(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tags t WHERE lower(trim(t.name)) = lower(trim(x.name))
  );

  SELECT id INTO v_tag_cursos FROM public.tags WHERE lower(trim(name)) = 'cursos' LIMIT 1;
  SELECT id INTO v_tag_viagens FROM public.tags WHERE lower(trim(name)) = 'viagens' LIMIT 1;

  FOR r IN
    SELECT *
    FROM (VALUES
      (
        '4-a-6-setembro-2026-camping-hiking-experience-soldados-sebold-alfredo-wagner-sc',
        '4 a 6 SETEMBRO 2026 – CAMPING & HIKING EXPERIENCE Soldados Sebold – Alfredo Wagner/SC – GRUPO PRIVADO',
        'Soldados Sebold – Alfredo Wagner',
        'SC',
        'Camping & Hiking Experience',
        1150::numeric,
        3,
        '2026-09-04'::date,
        '2026-09-06'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Grupo privado']::text[],
        'Experiência de Camping & Hiking em Soldados Sebold, Alfredo Wagner/SC, listada na agenda da Casa de Aventura.'
      ),
      (
        '13-a-19-setembro-2026-canoagem-travessia-do-lagamar-cananeia-sp-ilha-do-mel-pr',
        '13 a 19 SETEMBRO 2026 – CANOAGEM Travessia do Lagamar – Cananéia(SP) – Ilha do Mel(PR) – 110km – 7 Dias – CONFIRMADO – Vagas Disponíveis',
        'Travessia do Lagamar – Cananéia(SP) – Ilha do Mel(PR)',
        'SP/PR',
        'Canoagem',
        3750::numeric,
        7,
        '2026-09-13'::date,
        '2026-09-19'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Confirmado']::text[],
        'Travessia de canoagem do Lagamar, entre Cananéia (SP) e Ilha do Mel (PR), 110 km e 7 dias, conforme agenda pública da Casa de Aventura.'
      ),
      (
        '9-a-17-outubro-2026-hiking-travessia-da-maior-praia-do-mundo-rio-grande-ao-chui-rs',
        '9 a 17 OUTUBRO 2026 – HIKING Travessia da Maior Praia do Mundo – Rio Grande ao Chuí (RS) – 230km – 8 Dias de Caminhada – INSCRIÇÕES ABERTAS',
        'Travessia da Maior Praia do Mundo – Rio Grande ao Chuí',
        'RS',
        'Hiking',
        5250::numeric,
        9,
        '2026-10-09'::date,
        '2026-10-17'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Inscrições abertas']::text[],
        'Travessia em caminhada de Rio Grande ao Chuí (RS), 230 km e 8 dias de caminhada, conforme agenda pública.'
      ),
      (
        '10-a-12-outubro-2026-trekking-travessia-serra-do-tabuleiro-sao-bonifacio-sto-amaro',
        '10 a 12 OUTUBRO 2026 – TREKKING Travessia Serra do Tabuleiro – De São Bonifácio a Sto. Amaro da Imperatriz/SC – CONFIRMADO – Vagas Disponíveis',
        'Travessia Serra do Tabuleiro – São Bonifácio → Sto. Amaro da Imperatriz',
        'SC',
        'Trekking',
        850::numeric,
        3,
        '2026-10-10'::date,
        '2026-10-12'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Confirmado']::text[],
        'Trekking da Serra do Tabuleiro entre São Bonifácio e Santo Amaro da Imperatriz/SC, conforme agenda pública da Casa de Aventura.'
      ),
      (
        '31-outubro-1-novembro-2026-curso-combo-aguas-abertas-zona-surf-aca-n4',
        '31 OUT e 1º NOV – CURSO COMBO Águas Abertas & Zona de Surf – ACA N4 – Palmas – Gov. Celso Ramos/SC – CONFIRMADO = 03 VAGAS Disponíveis',
        'Palmas – Governador Celso Ramos',
        'SC',
        'Curso ACA',
        1100::numeric,
        2,
        '2026-10-31'::date,
        '2026-11-01'::date,
        3,
        'Brusque/SC',
        true,
        true,
        ARRAY['Confirmado', 'Vagas limitadas']::text[],
        'Curso Combo Águas Abertas & Zona de Surf – ACA N4, em Palmas, Governador Celso Ramos/SC.'
      ),
      (
        '7-a-15-novembro-2026-canoagem-volta-a-ilha-grande-angra-dos-reis',
        '07 a 15 NOVEMBRO 2026 – CANOAGEM Volta a Ilha Grande – Angra dos Reis/RJ – 07 Dias – CONFIRMADO – 02 Vagas Disponíveis',
        'Volta a Ilha Grande – Angra dos Reis',
        'RJ',
        'Canoagem',
        4950::numeric,
        9,
        '2026-11-07'::date,
        '2026-11-15'::date,
        2,
        'Brusque/SC',
        false,
        false,
        ARRAY['Confirmado', 'Vagas limitadas']::text[],
        'Expedição de canoagem em volta da Ilha Grande, Angra dos Reis/RJ, conforme agenda pública.'
      ),
      (
        '5-e-6-dezembro-2026-curso-iniciacao-canoagem-aca-niveis-1-a-3-porto-belo',
        '5 e 6 DEZEMBRO 2026 – CURSO Iniciação a Canoagem ACA Nível 1 a 3 – Porto Belo/SC – CONFIRMADO – 03 Vagas Disponíveis',
        'Porto Belo',
        'SC',
        'Curso ACA',
        950::numeric,
        2,
        '2026-12-05'::date,
        '2026-12-06'::date,
        3,
        'Brusque/SC',
        true,
        true,
        ARRAY['Confirmado', 'Vagas limitadas']::text[],
        'Curso de iniciação à canoagem ACA, níveis 1 a 3, em Porto Belo/SC.'
      ),
      (
        '18-a-20-dezembro-2026-curso-formacao-guias-canoagem-aca-florianopolis',
        '18 a 20 DEZEMBRO 2026 – CURSO Formação de Guias de Canoagem (ACA Kayak Touring Trip Leader L3) – Florianópolis/SC – 5 VAGAS',
        'Florianópolis',
        'SC',
        'Curso ACA',
        2450::numeric,
        3,
        '2026-12-18'::date,
        '2026-12-20'::date,
        5,
        'Brusque/SC',
        true,
        true,
        ARRAY['Vagas limitadas']::text[],
        'Curso de Formação de Guias de Canoagem (ACA Kayak Touring Trip Leader L3), em Florianópolis/SC.'
      ),
      (
        '13-a-30-janeiro-2027-trekking-aconcagua-rota-normal-horcones',
        '13 a 30 JANEIRO 2027 – TREKKING Cº Aconcágua 6.962m – Rota Normal via Horcones – Cordilheira dos Andes – Mendoza/ARG – INSCRIÇÕES ABERTAS',
        'Cerro Aconcágua – Rota Normal via Horcones – Mendoza',
        'ARG',
        'Trekking',
        0::numeric,
        18,
        '2027-01-13'::date,
        '2027-01-30'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Inscrições abertas']::text[],
        'Trekking ao Cerro Aconcágua, 6.962 m, pela Rota Normal via Horcones, Cordilheira dos Andes, Mendoza/Argentina.'
      ),
      (
        '30-e-31-janeiro-2027-curso-iniciacao-canoagem-aca-niveis-1-a-3-porto-belo',
        '30 e 31 JANEIRO 2027 – CURSO Iniciação a Canoagem ACA Nível 1 a 3 – Porto Belo/SC – 05 VAGAS',
        'Porto Belo',
        'SC',
        'Curso ACA',
        950::numeric,
        2,
        '2027-01-30'::date,
        '2027-01-31'::date,
        5,
        'Brusque/SC',
        true,
        true,
        ARRAY['Vagas limitadas']::text[],
        'Curso de iniciação à canoagem ACA, níveis 1 a 3, em Porto Belo/SC.'
      ),
      (
        '4-a-8-fevereiro-2027-trekking-valle-das-lagrimas-san-rafael-argentina',
        '4 a 8 FEVEREIRO 2027 – TREKKING Valle das Lágrimas – “Avião dos Sobreviventes” – San Rafael – Argentina',
        'Valle das Lágrimas – San Rafael',
        'ARG',
        'Trekking',
        0::numeric,
        5,
        '2027-02-04'::date,
        '2027-02-08'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY[]::text[],
        'Trekking Valle das Lágrimas, conhecido como “Avião dos Sobreviventes”, em San Rafael, Argentina.'
      ),
      (
        '9-a-20-fevereiro-2027-trekking-cerro-plata-5962m-mendoza',
        '9 a 20 FEVEREIRO 2027 – TREKKING Cerro Plata 5.962m – MENDOZA – ARGENTINA',
        'Cerro Plata 5.962m – Mendoza',
        'ARG',
        'Trekking',
        0::numeric,
        12,
        '2027-02-09'::date,
        '2027-02-20'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY[]::text[],
        'Trekking ao Cerro Plata, 5.962 m, em Mendoza, Argentina.'
      ),
      (
        '21-a-27-marco-2027-canoagem-volta-a-ilha-de-santa-catarina-140km',
        '21 a 27 MARÇO 2027 – CANOAGEM Volta a Ilha de Santa Catarina 140km – Florianópolis/SC – 07 Dias',
        'Volta a Ilha de Santa Catarina 140km – Florianópolis',
        'SC',
        'Canoagem',
        3850::numeric,
        7,
        '2027-03-21'::date,
        '2027-03-27'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY[]::text[],
        'Expedição de canoagem Volta a Ilha de Santa Catarina, 140 km, em Florianópolis/SC, com 7 dias.'
      ),
      (
        '12-a-26-junho-2027-trekking-circuito-huayhuash-classico-huaraz-peru',
        '12 a 26 JUNHO 2027 – TREKKING Circuito Huayhuash Clássico – HUARAZ – PERU – CONFIRMADO – Inscrições Abertas',
        'Circuito Huayhuash Clássico – Huaraz',
        'PERU',
        'Trekking',
        0::numeric,
        15,
        '2027-06-12'::date,
        '2027-06-26'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Confirmado', 'Inscrições abertas']::text[],
        'Trekking Circuito Huayhuash Clássico, em Huaraz, Peru.'
      ),
      (
        '5-a-17-julho-2027-trek-montanhismo-parque-sajama-acotango-parinacota',
        '05 a 17 JULHO 2027 – TREKK & MONTANHISMO – PARQUE SAJAMA – VULCÕES ACOTANGO & PARINACOTA – LA PAZ – BOLÍVIA – CONFIRMADO – INSCRIÇÕES ABERTAS',
        'Parque Sajama – Vulcões Acotango & Parinacota – La Paz',
        'BOLÍVIA',
        'Trekking & Montanhismo',
        0::numeric,
        13,
        '2027-07-05'::date,
        '2027-07-17'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Confirmado', 'Inscrições abertas']::text[],
        'Trekking e montanhismo no Parque Sajama, incluindo os vulcões Acotango e Parinacota, em La Paz, Bolívia.'
      ),
      (
        '2-a-11-setembro-2027-trekking-monte-kilimanjaro-lemosho-arusha',
        '2 a 11 SET 2027 – TREKKING – Monte Kilimanjaro – Rota Lemosho – 10 DIAS – Arusha – Tanzânia – GRUPO MÍNIMO 6 PAX',
        'Monte Kilimanjaro – Rota Lemosho – Arusha',
        'TANZÂNIA',
        'Trekking',
        0::numeric,
        10,
        '2027-09-02'::date,
        '2027-09-11'::date,
        6,
        'Brusque/SC',
        false,
        false,
        ARRAY['Vagas limitadas']::text[],
        'Trekking no Monte Kilimanjaro pela Rota Lemosho, 10 dias, com grupo mínimo de 6 participantes.'
      ),
      (
        '12-a-29-janeiro-2028-trekking-aconcagua-rota-normal-horcones',
        '12 a 29 JANEIRO 2028 – TREKKING Cº Aconcágua 6.962m – Rota Normal via Horcones – Cordilheira dos Andes – Mendoza/ARG – INSCRIÇÕES ABERTAS',
        'Cerro Aconcágua – Rota Normal via Horcones – Mendoza',
        'ARG',
        'Trekking',
        0::numeric,
        18,
        '2028-01-12'::date,
        '2028-01-29'::date,
        10,
        'Brusque/SC',
        false,
        false,
        ARRAY['Inscrições abertas']::text[],
        'Trekking ao Cerro Aconcágua, 6.962 m, pela Rota Normal via Horcones, Cordilheira dos Andes, Mendoza/Argentina.'
      )
    ) AS a(
      slug,name,destination,state,activity_label,price,days,start_date,end_date,spots,meeting_point,
      is_course,is_course_aca,status_tags,description
    )
  LOOP
    v_slug := r.slug;
    v_name := r.name;
    v_destination := r.destination;
    v_state := r.state;
    v_price := r.price;
    v_days := r.days;
    v_date := r.start_date;
    v_return_date := r.end_date;
    v_spots := r.spots;
    v_meeting := r.meeting_point;
    v_course := r.is_course;
    v_course_aca := r.is_course_aca;
    v_status_tags := r.status_tags;
    v_description := r.description;

    SELECT id INTO v_trip_id
    FROM public.trips
    WHERE slug = v_slug OR lower(trim(name)) = lower(trim(v_name))
    ORDER BY created_at ASC
    LIMIT 1;

    IF v_trip_id IS NULL THEN
      INSERT INTO public.trips (
        slug,name,destination,state,activity_id,price,old_price,price_usd,investment_text,
        cancellation_policy,days,level,image_url,images,video_url,description,highlights,
        includes,rating,featured,published,tech_sheet,guide_text,guide_image_url,
        destination_text,prerequisites,characteristics,climate,food,itinerary,not_included,
        checklist,equipment,tags,created_at,updated_at
      )
      VALUES (
        v_slug,v_name,v_destination,v_state,NULL,v_price,NULL,NULL,NULL,NULL,v_days,'Iniciante',
        NULL,'{}','',v_description,'{}','{}',5,false,true,'[]'::jsonb,'',NULL,'',
        '{}','', '', '','[]'::jsonb,'{}','{}','{}',
        ARRAY[]::uuid[],now(),now()
      )
      RETURNING id INTO v_trip_id;
    ELSE
      UPDATE public.trips
      SET
        name = v_name,
        destination = v_destination,
        state = v_state,
        price = CASE WHEN v_price > 0 THEN v_price ELSE price END,
        days = v_days,
        description = v_description,
        published = true,
        updated_at = now()
      WHERE id = v_trip_id;
    END IF;

    -- Tags: mantém tags úteis já existentes, remove classificação oposta e
    -- acrescenta a classificação/status indicada pela agenda pública.
    SELECT tags INTO v_existing_tags FROM public.trips WHERE id = v_trip_id;

    SELECT COALESCE(array_agg(tid), '{}'::uuid[])
    INTO v_tag_ids
    FROM (
      SELECT DISTINCT x AS tid
      FROM unnest(COALESCE(v_existing_tags, '{}')) AS x
      LEFT JOIN public.tags tg ON tg.id = x
      WHERE lower(trim(COALESCE(tg.name, ''))) <> 'cursos'
        AND lower(trim(COALESCE(tg.name, ''))) <> 'viagens'
        AND lower(trim(COALESCE(tg.name, ''))) NOT LIKE 'curso %'
    ) kept;

    IF v_course THEN
      v_tag_ids := v_tag_ids || ARRAY[v_tag_cursos];
      IF v_course_aca THEN
        v_tag_ids := v_tag_ids || ARRAY[
          (SELECT id FROM public.tags WHERE lower(trim(name)) = 'curso aca' LIMIT 1)
        ];
      END IF;
    ELSE
      v_tag_ids := v_tag_ids || ARRAY[v_tag_viagens];
    END IF;

    SELECT COALESCE(v_tag_ids, '{}') ||
      COALESCE(ARRAY(
        SELECT tg.id
        FROM public.tags tg
        WHERE lower(trim(tg.name)) = ANY(
          SELECT lower(trim(x)) FROM unnest(v_status_tags) x
        )
      ), '{}')
    INTO v_tag_ids;

    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(v_tag_ids) x
      WHERE x IS NOT NULL
    )
    INTO v_tag_ids;

    UPDATE public.trips SET tags = v_tag_ids, updated_at = now() WHERE id = v_trip_id;

    -- Saída da agenda: nunca duplica uma saída que já esteja cadastrada para a mesma data.
    IF NOT EXISTS (
      SELECT 1 FROM public.departures d
      WHERE d.trip_id = v_trip_id AND d.date = v_date
    ) THEN
      INSERT INTO public.departures (id, trip_id, date, return_date, spots, meeting_point, created_at)
      VALUES (gen_random_uuid(), v_trip_id, v_date, v_return_date, v_spots, v_meeting, now());
    END IF;
  END LOOP;
END $$;
