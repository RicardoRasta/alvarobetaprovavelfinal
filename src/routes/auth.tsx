import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

type Search = { next?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Acesse sua conta da A Casa de Aventura para acompanhar reservas ou administrar o catálogo de viagens.",
      },
      { property: "og:title", content: "Entrar — A Casa de Aventura" },
      { property: "og:description", content: "Login e cadastro da agência A Casa de Aventura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const target = next && next.startsWith("/") ? next : "/conta";

  useEffect(() => {
    if (!loading && session) navigate({ to: target });
  }, [loading, session, navigate, target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}${target}` },
          });
    setBusy(false);
    if (result.error) return toast.error(result.error.message);
    if (mode === "cadastro" && !result.data.session) {
      toast.success("Conta criada! Confirme o e-mail para entrar.");
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate({ to: target });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error("Não foi possível entrar com o Google.");
    if (result.redirected) return;
    navigate({ to: target });
  };

  return (
    <div className="mx-auto flex max-w-md animate-fade-up flex-col px-4 py-12">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Mountain className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-center text-3xl font-bold uppercase">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Acesse para acompanhar reservas ou gerenciar a agência.
      </p>

      <div className="card-surface mt-8 space-y-4 p-6">
        <form className="space-y-3" onSubmit={submit}>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
              Senha
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={google}
          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
        >
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "cadastro" : "login")}
          className="w-full text-center text-sm text-muted-foreground hover:text-accent"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>

      <Link to="/" className="mt-6 text-center text-sm text-muted-foreground hover:text-accent">
        Voltar ao site
      </Link>
    </div>
  );
}
