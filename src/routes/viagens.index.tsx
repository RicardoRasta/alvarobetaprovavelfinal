import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { sortByNextDeparture, tagsQuery, tripsQuery } from "@/lib/api";

type CatalogSearch = { atividade?: string; q?: string; data?: string; tag?: string };

export const Route = createFileRoute("/viagens/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    atividade: typeof search.atividade === "string" ? search.atividade : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    data: typeof search.data === "string" ? search.data : undefined,
    tag: typeof search.tag === "string" ? search.tag : undefined,
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
  const { atividade, data, tag } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const { data: trips = [], isLoading } = useQuery(tripsQuery);
  const { data: tags = [] } = useQuery(tagsQuery);

  const selectedTag = tags.find(
    (t) => t.id === tag || t.name.trim().toLowerCase() === (tag ?? "").trim().toLowerCase(),
  );
  const cursosTag = tags.find((t) => t.name.trim().toLowerCase() === "cursos");
  const isCoursesPage =
    selectedTag?.name.trim().toLowerCase() === "cursos";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByNextDeparture(
      trips.filter(
        (t) =>
          t.published &&
          (isCoursesPage
            ? (cursosTag ? (t.tags ?? []).includes(cursosTag.id) : false)
            : (cursosTag ? !(t.tags ?? []).includes(cursosTag.id) : true)) &&
          (!atividade || t.activity_id === atividade) &&
          (!tag || (selectedTag ? (t.tags ?? []).includes(selectedTag.id) : false)) &&
          (!data || (t.departures ?? []).some((d) => d.date >= data)) &&
          (!q ||
            `${t.name} ${t.destination} ${t.state} ${t.description}`.toLowerCase().includes(q)),
      ),
    );
  }, [atividade, data, tag, query, trips, selectedTag, cursosTag, isCoursesPage]);

  const patch = (next: Partial<CatalogSearch>) =>
    navigate({ search: (prev: CatalogSearch) => ({ ...prev, ...next }) });

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10">
        <h1 className="text-5xl leading-[0.95] md:text-7xl">
          Nossa agenda
          <br />
          <span className="text-accent">completa</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {isLoading ? "Carregando roteiros..." : `${filtered.length} roteiro(s) disponíveis`}
        </p>
      </header>

      <div className="card-surface mb-6 flex flex-col gap-3 rounded-3xl p-3 md:flex-row md:items-center md:rounded-full md:p-2.5">
        <label className="flex flex-1 items-center gap-2 px-4 py-2">
          <Search className="h-5 w-5 shrink-0 text-accent" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar por destino, estado ou atividade..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <span className="hidden h-8 w-px bg-border md:block" />
        <label className="flex items-center gap-2 px-4 py-2">
          <CalendarDays className="h-5 w-5 shrink-0 text-accent" />
          <input
            type="date"
            value={data ?? ""}
            onChange={(e) => patch({ data: e.target.value || undefined })}
            aria-label="A partir da data"
            className="bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      {!isLoading && filtered.length === 0 ? (
        <p className="card-surface p-12 text-center text-muted-foreground">
          Nenhuma viagem encontrada para esta busca.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
}

