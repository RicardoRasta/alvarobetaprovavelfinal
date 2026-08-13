-- Remove acesso público (anon/herdado) às funções security definer
REVOKE EXECUTE ON FUNCTION public.admin_exists() FROM public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public;

-- Mantém has_role executável por usuários autenticados (usado nas políticas de RLS)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;