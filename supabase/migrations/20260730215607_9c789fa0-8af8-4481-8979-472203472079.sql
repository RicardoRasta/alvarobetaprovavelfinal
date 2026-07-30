-- 1. has_role passa a ser SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- user_roles: leitura apenas das próprias funções (evita recursão)
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 2. admin_exists: sem execução por anon/authenticated
REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM PUBLIC, anon, authenticated;

-- 3. claim_first_admin substituído por política + trigger de validação
DROP FUNCTION IF EXISTS public.claim_first_admin();

CREATE OR REPLACE FUNCTION public.enforce_first_admin_bootstrap()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF NEW.user_id <> auth.uid() OR NEW.role <> 'admin' THEN
    RAISE EXCEPTION 'not allowed';
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'an administrator already exists';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_first_admin_bootstrap() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_first_admin_bootstrap ON public.user_roles;
CREATE TRIGGER enforce_first_admin_bootstrap
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_first_admin_bootstrap();

GRANT INSERT ON public.user_roles TO authenticated;
DROP POLICY IF EXISTS "bootstrap first admin" ON public.user_roles;
CREATE POLICY "bootstrap first admin" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'admin');

-- 4. trips: anon não pode mais chamar has_role
DROP POLICY IF EXISTS "trips public read" ON public.trips;
CREATE POLICY "trips anon read published" ON public.trips
  FOR SELECT TO anon USING (published);
CREATE POLICY "trips auth read" ON public.trips
  FOR SELECT TO authenticated USING (published OR public.has_role(auth.uid(), 'admin'));

-- 5. booking_requests: insert validado em vez de WITH CHECK (true)
DROP POLICY IF EXISTS "anyone can request booking" ON public.booking_requests;
CREATE POLICY "anyone can request booking" ON public.booking_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(customer_name)) BETWEEN 2 AND 80
    AND char_length(btrim(trip_name)) BETWEEN 2 AND 160
    AND (contact IS NULL OR char_length(contact) <= 120)
    AND people BETWEEN 1 AND 30
    AND status = 'novo'
    AND (departure_date IS NULL OR departure_date >= (CURRENT_DATE - 1))
    AND trip_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_id AND t.published)
  );