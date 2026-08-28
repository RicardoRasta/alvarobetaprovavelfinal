INSERT INTO public.user_roles (user_id, role)
VALUES ('4e11feb7-fbc9-4f52-8813-6e5cc5b915b5', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;