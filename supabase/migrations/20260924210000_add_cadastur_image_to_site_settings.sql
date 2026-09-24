alter table public.site_settings
  add column if not exists cadastur_image_url text;

comment on column public.site_settings.cadastur_image_url is
  'Imagem do certificado Cadastur exibida no site e gerenciada pelo admin.';
