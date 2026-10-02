-- Normalize imported comma-separated tags while preserving IDs already referenced by trips.
update public.tags set name = 'Cursos' where id = '8391859a-cd4b-4ea8-9582-c6e5f366c694';
update public.tags set name = 'Saídas confirmadas' where id = '50f66182-0654-4e4e-ba6d-8c602094e2e2';
update public.tags set name = 'Aventura' where id = 'ec400fea-b8c6-4d06-a087-b3124b332711';

with wanted(name, sort_order) as (
 values
 ('Canoagem',10),('Canoagem oceânica',11),('Turismo',12),('Passeio',13),('Expedições',14),
 ('Brasil',15),('Guiada',16),('Guia brasileiro',17),('Instrutor',18),('Educador ao ar livre',19),
 ('Litoral',20),('Santa Catarina',21),('Catarinense',22),('Praias',23),('Ilhas',24),
 ('Porto Belo',25),('Bombinhas',26),('Governador Celso Ramos',27),('Florianópolis',28),
 ('Palhoça',29),('Caiaque',30),('Remo',31),('Montanhismo',32),('Trekking',33),
 ('Hiking',34),('Escalada',35),('Rafting',36),('Camping',37),('Travessia',38),
 ('Aconcágua',39),('Nível 1',41),('Nível 2',42),('Nível 3',43)
)
insert into public.tags(id,name,sort_order)
select gen_random_uuid(), w.name, w.sort_order
from wanted w
where not exists (select 1 from public.tags t where lower(t.name)=lower(w.name));

-- Remove an unused imported keyword blob; no trip references this tag.
delete from public.tags
where id = '80a446e2-513e-4c8d-93e7-af6b8db76874'
  and not exists (select 1 from public.trips where public.tags.id = any(trips.tags));

-- Repair category/activity assignments on existing records without changing trip IDs.
do $$
declare cursos_id uuid; viagens_id uuid; canoagem_id uuid; montanhismo_id uuid; trekking_id uuid; hiking_id uuid;
begin
  select id into cursos_id from public.tags where lower(name)='cursos' limit 1;
  select id into viagens_id from public.tags where lower(name)='viagens' limit 1;
  select id into canoagem_id from public.tags where lower(name)='canoagem' limit 1;
  select id into montanhismo_id from public.tags where lower(name)='montanhismo' limit 1;
  select id into trekking_id from public.tags where lower(name)='trekking' limit 1;
  select id into hiking_id from public.tags where lower(name)='hiking' limit 1;
  update public.trips tr set tags = array_append(array_remove(tr.tags, viagens_id), cursos_id)
    where tr.name ilike 'curso %' and cursos_id is not null and not (cursos_id = any(tr.tags));
  update public.trips tr set tags = array_remove(tr.tags, viagens_id)
    where tr.name ilike 'curso %' and viagens_id is not null;
  update public.trips set tags = array_append(tags, canoagem_id)
    where name ilike '%canoagem%' and canoagem_id is not null and not (canoagem_id = any(tags));
  update public.trips set tags = array_append(tags, montanhismo_id)
    where name ilike '%montanhismo%' and montanhismo_id is not null and not (montanhismo_id = any(tags));
  update public.trips set tags = array_append(tags, trekking_id)
    where name ilike '%trekking%' and trekking_id is not null and not (trekking_id = any(tags));
  update public.trips set tags = array_append(tags, hiking_id)
    where name ilike '%hiking%' and hiking_id is not null and not (hiking_id = any(tags));
end $$;
