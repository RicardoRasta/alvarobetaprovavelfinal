alter table public.equipment_rentals
  add column if not exists weekly_price numeric not null default 0 check (weekly_price >= 0),
  add column if not exists monthly_price numeric not null default 0 check (monthly_price >= 0);

comment on column public.equipment_rentals.daily_price is 'Preço de locação por diária (1 dia).';
comment on column public.equipment_rentals.weekly_price is 'Preço de locação por semana (7 dias).';
comment on column public.equipment_rentals.monthly_price is 'Preço de locação por mês (30 dias).';
