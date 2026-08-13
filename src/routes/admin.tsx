import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CalendarCheck, LayoutDashboard, LogOut, MessageCircle, Settings, ShieldAlert, MapPinned, Tags } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — A Casa de Aventura" },
      {
        name: "description",
        content: "Gerencie roteiros, saídas, banner da home, WhatsApp e pedidos de reserva.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo — A Casa de Aventura" },
      { property: "og:description", content: "Gestão completa da agência em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/viagens", label: "Viagens", icon: MapPinned, exact: false },
  { to: "/admin/atividades", label: "Atividades", icon: Tags, exact: false },
  { to: "/admin/reservas", label: "Reservas", icon: CalendarCheck, exact: false },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle, exact: false },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", search: { next: "/admin" } });
  }, [loading, session, navigate]);

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Verificando acesso...</div>;
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg animate-fade-up px-4 py-16 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-bold uppercase">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta conta ({session.user.email}) ainda não tem permissão de administrador.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          O acesso de administrador é concedido apenas pela equipe responsável pelo site.
        </p>

        <button
          type="button"
          onClick={() => signOut()}
          className="mt-6 block w-full text-sm text-muted-foreground hover:text-accent"
        >
          Sair da conta
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold uppercase md:text-4xl">Administração</h1>
          <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.exact }}
            activeProps={{ className: "border-accent bg-accent text-accent-foreground" }}
            inactiveProps={{
              className: "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent",
            }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
