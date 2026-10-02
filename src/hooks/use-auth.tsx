import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("[auth] Erro ao recuperar sessão:", error);
        setSession(data?.session ?? null);
      })
      .catch((error) => {
        if (active) console.error("[auth] Falha ao recuperar sessão:", error);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const userId = session?.user?.id;
  const email = session?.user?.email?.toLowerCase() ?? "";
  const appRole = session?.user?.app_metadata?.role;

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }
    setCheckingRole(true);
    const designatedAdmins = new Set(["alvaro.w12@gmail.com", "rrsdesigner2609@gmail.com"]);

    (async () => {
      try {
        const { data: bootstrapped, error: bootstrapError } = await supabase.rpc("bootstrap_admin");
        if (bootstrapError) console.warn("[auth] bootstrap_admin indisponível; consultando user_roles.", bootstrapError);
        if (!active) return;
        if (bootstrapped || designatedAdmins.has(email) || appRole === "admin") {
          setIsAdmin(true);
          return;
        }
        const { data, error } = await supabase.from("user_roles")
          .select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (error) console.error("[auth] Falha ao consultar user_roles:", error);
        if (active) setIsAdmin(Boolean(data) || appRole === "admin");
      } catch (error) {
        console.error("[auth] Falha ao verificar permissão administrativa:", error);
        if (active) setIsAdmin(designatedAdmins.has(email) || appRole === "admin");
      } finally {
        if (active) setCheckingRole(false);
      }
    })();
    return () => { active = false; };
  }, [userId, email, appRole]);

  return {
    session,
    user: (session?.user ?? null) as User | null,
    loading: loading || checkingRole,
    isAdmin,
    refreshRole: async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase.rpc("bootstrap_admin");
        if (error) throw error;
        if (data) { setIsAdmin(true); return; }
        const { data: role, error: roleError } = await supabase.from("user_roles")
          .select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (roleError) throw roleError;
        setIsAdmin(Boolean(role) || email === "alvaro.w12@gmail.com" || email === "rrsdesigner2609@gmail.com" || appRole === "admin");
      } catch (error) {
        console.error("[auth] Não foi possível atualizar a permissão:", error);
      }
    },
    signOut: () => supabase.auth.signOut(),
  };
}
