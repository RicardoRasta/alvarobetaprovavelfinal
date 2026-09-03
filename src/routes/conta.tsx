import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, LayoutDashboard, LogOut, User } from "lucide-react";
import { formatDate } from "@/data/trips";
import { bookingsQuery } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — A Casa de Aventura" },
      {
        name: "description",
        content: "Acesse sua conta para ver seus pedidos de reserva e roteiros salvos.",
      },
      { property: "og:title", content: "Minha conta — A Casa de Aventura" },
      { property: "og:description", content: "Login e histórico de reservas da sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Conta,
});

function Conta() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const { data: bookings = [] } = useQuery({ ...bookingsQuery, enabled: Boolean(isAdmin) });

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md animate-fade-up px-4 py-16 text-center">
        <User className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-bold uppercase">Área do cliente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre na sua conta para acompanhar suas reservas de aventura.
        </p>
        <Link
          to="/auth"
          search={{ next: "/conta" }}
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold uppercase md:text-4xl">Minha conta</h1>

      <section className="card-surface mt-6 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
          <User className="h-5 w-5 text-accent" /> Perfil
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-muted-foreground">E-mail</dt>
            <dd className="font-medium">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Tipo de acesso</dt>
            <dd className="font-medium">{isAdmin ? "Administrador" : "Cliente"}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4" /> Painel administrativo
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </section>

      {isAdmin && (
        <section className="card-surface mt-6 overflow-hidden">
          <h2 className="flex items-center gap-2 border-b border-border px-6 py-4 text-lg font-bold uppercase">
            <CalendarDays className="h-5 w-5 text-accent" /> Últimos pedidos recebidos
          </h2>
          {bookings.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhum pedido registrado ainda.</p>
          ) : (
            <ul className="divide-y divide-border">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex flex-wrap justify-between gap-2 px-6 py-3 text-sm">
                  <span className="font-medium">{b.customer_name}</span>
                  <span className="text-muted-foreground">{b.trip_name}</span>
                  <span className="text-muted-foreground">
                    {b.departure_date ? formatDate(b.departure_date) : "sem data"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
