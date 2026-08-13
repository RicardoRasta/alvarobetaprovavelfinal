-- Revoga acesso público herdado por anon/authenticated
REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM public;
REVOKE EXECUTE ON FUNCTION public.enforce_first_admin_bootstrap() FROM public;

-- Garante que service_role e postgres mantêm acesso interno necessário
GRANT EXECUTE ON FUNCTION public.admin_exists() TO service_role;
GRANT EXECUTE ON FUNCTION public.enforce_first_admin_bootstrap() TO service_role;