-- 1. Remove self-service admin bootstrap
DROP POLICY IF EXISTS "bootstrap first admin" ON public.user_roles;
DROP TRIGGER IF EXISTS enforce_first_admin_bootstrap ON public.user_roles;
DROP FUNCTION IF EXISTS public.enforce_first_admin_bootstrap();
DROP FUNCTION IF EXISTS public.admin_exists();

-- 2. Lock down SECURITY DEFINER / helper function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;

-- 3. Booking request anti-spam guard
CREATE OR REPLACE FUNCTION public.limit_booking_requests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (
    SELECT count(*) FROM public.booking_requests b
    WHERE b.trip_id = NEW.trip_id
      AND lower(btrim(b.customer_name)) = lower(btrim(NEW.customer_name))
      AND b.created_at > now() - interval '10 minutes'
  ) >= 3 THEN
    RAISE EXCEPTION 'too many booking requests, please try again later';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.limit_booking_requests() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS limit_booking_requests ON public.booking_requests;
CREATE TRIGGER limit_booking_requests
BEFORE INSERT ON public.booking_requests
FOR EACH ROW EXECUTE FUNCTION public.limit_booking_requests();