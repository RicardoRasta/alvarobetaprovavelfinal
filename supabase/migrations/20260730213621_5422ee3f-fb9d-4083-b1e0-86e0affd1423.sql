-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ACTIVITIES
CREATE TABLE public.activities (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities public read" ON public.activities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "activities admin write" ON public.activities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TRIPS
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  destination text NOT NULL,
  state text NOT NULL,
  activity_id text REFERENCES public.activities(id) ON DELETE SET NULL,
  price numeric NOT NULL DEFAULT 0,
  old_price numeric,
  days int NOT NULL DEFAULT 1,
  level text NOT NULL DEFAULT 'Iniciante',
  image_url text,
  description text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  includes text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 5,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trips TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trips public read" ON public.trips FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "trips admin write" ON public.trips FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DEPARTURES
CREATE TABLE public.departures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  date date NOT NULL,
  spots int NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departures TO authenticated;
GRANT ALL ON public.departures TO service_role;
ALTER TABLE public.departures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "departures public read" ON public.departures FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "departures admin write" ON public.departures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  banner_badge text NOT NULL DEFAULT '',
  banner_title text NOT NULL DEFAULT '',
  banner_subtitle text NOT NULL DEFAULT '',
  banner_image_url text,
  whatsapp_number text NOT NULL DEFAULT '',
  whatsapp_greeting text NOT NULL DEFAULT 'Olá! Tenho interesse na viagem',
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKING REQUESTS
CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  trip_name text NOT NULL,
  customer_name text NOT NULL,
  contact text NOT NULL DEFAULT '',
  departure_date date,
  people int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.booking_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request booking" ON public.booking_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin reads bookings" ON public.booking_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin updates bookings" ON public.booking_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes bookings" ON public.booking_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SEED
INSERT INTO public.site_settings (id, banner_badge, banner_title, banner_subtitle, whatsapp_number, whatsapp_greeting, stats) VALUES
(1, 'Saídas confirmadas 2026', 'Viagens de aventura pelo Brasil',
 'Canoagem, escalada, trekking e expedições guiadas. Escolha o destino, a data e agende sua vaga.',
 '5511999999999', 'Olá! Tenho interesse na viagem',
 '[{"label":"Roteiros pelo Brasil","value":"42"},{"label":"Aventureiros guiados","value":"9.300"},{"label":"Avaliação média","value":"4.9/5"},{"label":"Estados atendidos","value":"17"}]'::jsonb);

INSERT INTO public.activities (id, name, description, sort_order) VALUES
('canoagem','Canoagem','Rios calmos, mar e travessias de caiaque',1),
('escalada','Escalada','Montanhas e paredes com guias certificados',2),
('trekking','Trekking','Travessias e trilhas de longa distância',3),
('rafting','Rafting','Descidas de corredeiras em grupo',4),
('expedicao','Expedições','Roteiros longos por biomas brasileiros',5);

INSERT INTO public.trips (slug,name,destination,state,activity_id,price,old_price,days,level,description,highlights,includes,rating,featured) VALUES
('canoagem-bonito','Canoagem nas Águas Claras de Bonito','Bonito','MS','canoagem',1890,2290,3,'Iniciante','Três dias remando pelos rios de água cristalina de Bonito, com flutuação entre cardumes, trilhas curtas até cachoeiras e noites em pousada de charme.','{"Rio da Prata","Flutuação com cardumes","Cachoeira Boca da Onça"}','{"Guia credenciado","Equipamento de remo","Hospedagem 2 noites","Café e almoços"}',4.9,true),
('escalada-pedra-azul','Escalada na Pedra Azul','Domingos Martins','ES','escalada',1450,NULL,2,'Intermediário','Fim de semana de escalada em granito com vias de diferentes graus, técnica de segurança, rapel guiado e vista para o vale ao amanhecer.','{"Vias esportivas","Rapel de 40 m","Nascer do sol no mirante"}','{"Equipamento completo","Guia de montanha","Hospedagem 1 noite","Seguro aventura"}',4.8,true),
('trekking-chapada','Travessia do Vale do Pati','Chapada Diamantina','BA','trekking',2790,3150,5,'Avançado','A travessia mais famosa do Brasil: cinco dias caminhando entre morros, cachoeiras e casas de nativos no Vale do Pati.','{"Morro do Castelo","Cachoeirão","Pernoite em casa de nativos"}','{"Guia local","Pensão completa","Transfer Lençóis"}',5,true),
('rafting-jacare-pepira','Rafting no Rio Jacaré-Pepira','Brotas','SP','rafting',690,NULL,2,'Iniciante','Descida de corredeiras classe III em botes de seis pessoas, com briefing de segurança, tirolesa e cachoeirismo no segundo dia.','{"Corredeiras classe III","Tirolesa sobre o rio","Cachoeirismo"}','{"Condutor por bote","Colete e capacete","Almoço nos dois dias"}',4.7,false),
('lencois-maranhenses','Expedição Lençóis Maranhenses','Barreirinhas','MA','expedicao',3390,NULL,6,'Intermediário','Seis dias atravessando dunas e lagoas de água doce entre Barreirinhas e Atins, com travessia de barco pelo Rio Preguiças.','{"Lagoa Azul e Lagoa Bonita","Travessia até Atins","Rio Preguiças de barco"}','{"Guia da expedição","Hospedagem 5 noites","Transfers 4x4","Café da manhã"}',4.9,true),
('amazonia-rio-negro','Expedição Amazônia — Rio Negro','Manaus','AM','expedicao',4290,NULL,7,'Intermediário','Uma semana navegando o Rio Negro em barco regional, com trilhas na floresta, focagem de jacarés e visita a comunidades ribeirinhas.','{"Encontro das Águas","Trilha noturna na floresta","Comunidade ribeirinha"}','{"Barco regional","Guia biólogo","Pensão completa","Rede e mosquiteiro"}',4.8,false);

INSERT INTO public.departures (trip_id, date, spots)
SELECT t.id, d.date::date, d.spots FROM public.trips t
JOIN (VALUES
 ('canoagem-bonito','2026-08-14',6),('canoagem-bonito','2026-09-11',10),('canoagem-bonito','2026-10-09',12),
 ('escalada-pedra-azul','2026-08-22',4),('escalada-pedra-azul','2026-09-19',8),
 ('trekking-chapada','2026-09-05',3),('trekking-chapada','2026-10-17',9),('trekking-chapada','2026-11-07',12),
 ('rafting-jacare-pepira','2026-08-08',14),('rafting-jacare-pepira','2026-08-29',16),('rafting-jacare-pepira','2026-09-26',16),
 ('lencois-maranhenses','2026-09-12',8),('lencois-maranhenses','2026-10-24',10),
 ('amazonia-rio-negro','2026-10-03',6),('amazonia-rio-negro','2026-11-14',12)
) AS d(slug, date, spots) ON d.slug = t.slug;