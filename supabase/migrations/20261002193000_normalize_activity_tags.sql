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
