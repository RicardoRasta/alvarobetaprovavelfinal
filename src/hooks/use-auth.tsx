import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }
    setCheckingRole(true);

    // Em um banco novo, o primeiro usuário autenticado é promovido
    // automaticamente a administrador. Os próximos usuários não são.
    supabase.rpc("bootstrap_admin").then(({ data: bootstrapped }) => {
      if (!active) return;
      if (bootstrapped) {
        setIsAdmin(true);
        setCheckingRole(false);
        return;
      }

      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data }) => {
          if (!active) return;
          setIsAdmin(Boolean(data));
          setCheckingRole(false);
        });
    });

    return () => {
      active = false;
    };
  }, [userId]);

  return {
    session,
    user: (session?.user ?? null) as User | null,
    loading: loading || checkingRole,
    isAdmin,
    refreshRole: async () => {
      if (!userId) return;
      const { data } = await supabase.rpc("bootstrap_admin");
      if (data) {
        setIsAdmin(true);
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(role));
    },
    signOut: () => supabase.auth.signOut(),
  };
}
