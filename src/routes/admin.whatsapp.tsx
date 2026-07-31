import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { whatsappClicksQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/whatsapp")({
  head: () => ({
    meta: [
      { title: "Cliques no WhatsApp — A Casa de Aventura" },
      {
        name: "description",
        content: "Acompanhe os leads: quem clicou em Agendar no WhatsApp e quais viagens geraram interesse.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Cliques no WhatsApp — A Casa de Aventura" },
      { property: "og:description", content: "Relatório de leads gerados pelo botão de WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminWhatsApp,
});

const sourceLabel: Record<string, string> = {
  card: "Card de viagem",
  trip_page: "Página da viagem",
  fab: "Botão flutuante",
};

const dt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function AdminWhatsApp() {
  const { data: clicks = [], isLoading } = useQuery(whatsappClicksQuery);

  const ranking = Object.entries(
    clicks.reduce<Record<string, number>>((acc, c) => {
      acc[c.trip_name] = (acc[c.trip_name] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = clicks.filter((c) => c.created_at.slice(0, 10) === today).length;

  if (isLoading) {
    return <div className="p-10 text-center text-muted-foreground">Carregando cliques...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card-surface p-4">
          <p className="text-xs uppercase text-muted-foreground">Total de cliques</p>
          <p className="mt-1 text-3xl font-bold">{clicks.length}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs uppercase text-muted-foreground">Hoje</p>
          <p className="mt-1 text-3xl font-bold">{todayCount}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs uppercase text-muted-foreground">Viagem mais clicada</p>
          <p className="mt-1 truncate text-lg font-semibold">{ranking[0]?.[0] ?? "—"}</p>
        </div>
      </div>

      {ranking.length > 0 && (
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
            <MessageCircle className="h-5 w-5 text-accent" /> Cliques por viagem
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {ranking.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between gap-3 border-b border-border pb-2">
                <span className="truncate">{name}</span>
                <span className="font-semibold text-accent">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card-surface overflow-x-auto p-5">
        <h2 className="text-lg font-bold uppercase">Histórico de cliques</h2>
        {clicks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nenhum clique registrado ainda.</p>
        ) : (
          <table className="mt-3 w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Quando</th>
                <th className="py-2">Viagem</th>
                <th className="py-2">Origem</th>
                <th className="py-2">Saída</th>
              </tr>
            </thead>
            <tbody>
              {clicks.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="py-2 text-muted-foreground">{dt(c.created_at)}</td>
                  <td className="py-2 font-medium">{c.trip_name}</td>
                  <td className="py-2 text-muted-foreground">{sourceLabel[c.source] ?? c.source}</td>
                  <td className="py-2 text-muted-foreground">
                    {c.departure_date ? c.departure_date.split("-").reverse().join("/") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
