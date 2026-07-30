import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { activities, trips } from "@/data/trips";

type CatalogSearch = { atividade?: string; q?: string };

export const Route = createFileRoute("/viagens/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    atividade: typeof search.atividade === "string" ? search.atividade : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Viagens e roteiros — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Encontre roteiros de canoagem, escalada, trekking e rafting pelo Brasil e agende sua próxima aventura.",
      },
      { property: "og:title", content: "Viagens e roteiros — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Todas as expedições guiadas da Casa de Aventura em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Viagens,
});

function Viagens() {
  const { atividade } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trips.filter(
      (t) =>
        (!atividade || t.activityId === atividade) &&
        (!q ||
          `${t.name} ${t.destination} ${t.state} ${t.description}`.toLowerCase().includes(q)),
    );
  }, [atividade, query]);

  const setAtividade = (id?: string) =>
    navigate({ search: (prev: CatalogSearch) => ({ ...prev, atividade: id }) });

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase md:text-4xl">Viagens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} roteiro(s) com saídas confirmadas
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar por destino, estado ou atividade..."
            className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={!atividade} onClick={() => setAtividade(undefined)} label="Todas" />
        {activities.map((a) => (
          <FilterChip
            key={a.id}
            active={atividade === a.id}
            onClick={() => setAtividade(a.id)}
            label={a.name}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="card-surface p-10 text-center text-muted-foreground">
          Nenhuma viagem encontrada para esta busca.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
