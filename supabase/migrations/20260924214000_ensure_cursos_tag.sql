insert into public.tags (id, name, sort_order)
select gen_random_uuid(), 'Cursos', coalesce(max(sort_order) + 1, 0)
from public.tags
where not exists (
  select 1
  from public.tags
  where lower(trim(name)) = 'cursos'
);
