-- Remove execução pública/autenticada de funções security definer não usadas diretamente
REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_first_admin_bootstrap() FROM anon, authenticated;