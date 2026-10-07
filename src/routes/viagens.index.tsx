import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { dedupeTripsByName, sortByNextDeparture, tagsQuery, tripsQuery } from "@/lib/api";

type CatalogSearch = {
  atividade?: string;
  q?: string;
  tag?: string;
  categoria?: string;
};

export const Route = createFileRoute("/viagens/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    atividade: typeof search.atividade === "string" ? search.atividade : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    tag: typeof search.tag === "string" ? search.tag : undefined,
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
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
  const { atividade, tag, categoria } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const { data: trips = [], isLoading } = useQuery(tripsQuery);
  const { data: tags = [] } = useQuery(tagsQuery);

  const normalizeTagName = (value: string) =>
    value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const selectedTag = tags.find(
    (t) => t.id === tag || normalizeTagName(t.name) === normalizeTagName(tag ?? ""),
  );
  const tagNameById = useMemo(() => new Map(tags.map((t) => [t.id, t.name])), [tags]);
  const normalizeTagValue = (value: string) =>
    normalizeTagName(tagNameById.get(value) ?? value);
  const isCourseLikeTag = (value: string) => {
    const normalized = normalizeTagValue(value);
    return normalized === "cursos" || normalized.startsWith("curso");
  };
  const isCoursesPage =
    normalizeTagName(tag ?? "") === "cursos" ||
    normalizeTagName(categoria ?? "") === "cursos" ||
    isCourseLikeTag(selectedTag?.name ?? "");
  const isCourseTrip = (trip: (typeof trips)[number]) =>
    (trip.tags ?? []).some((value) => isCourseLikeTag(value)) ||
    normalizeTagName(trip.name).includes("curso ");
  const getCatalogCategory = (trip: (typeof trips)[number]) => {
    const name = normalizeTagName(trip.name);
    if (name.includes("canoagem") || name.includes("canoeagem")) return "canoagem";
    if (
      name.includes("montanhismo") ||
      name.includes("montanha") ||
      name.includes("trekking") ||
      name.includes("hiking") ||
      name.includes("escalada")
    ) return "montanhismo";
    return "outros";
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByNextDeparture(
      trips.filter((t) => {
        const isCorrectCatalog =
          t.published && (isCoursesPage ? isCourseTrip(t) : !isCourseTrip(t));
        const categoryMatches =
          !categoria || categoria === "todos" || getCatalogCategory(t) === categoria;
        const activityMatches = !atividade || t.activity_id === atividade;
        const queryMatches =
          !q || `${t.name} ${t.destination} ${t.state} ${t.description}`.toLowerCase().includes(q);
        return isCorrectCatalog && categoryMatches && activityMatches && queryMatches;
      }),
    );
  }, [atividade, categoria, query, trips, isCoursesPage]);

  const patch = (next: Partial<CatalogSearch>) =>
    navigate({ search: (prev: CatalogSearch) => ({ ...prev, ...next }) });

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-up px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10">
        <h1 className="text-5xl leading-[0.95] md:text-7xl">
          {isCoursesPage ? (
            <>Nossos<br /><span className="text-accent">cursos</span></>
          ) : (
            <>Nossas<br /><span className="text-accent">viagens</span></>
          )}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {isLoading
            ? "Carregando..."
            : `${filtered.length} ${isCoursesPage ? "curso(s)" : "roteiro(s)"} disponíveis`}
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

      </div>

      <div className="mb-10 flex flex-wrap gap-2" aria-label={isCoursesPage ? "Filtrar cursos" : "Filtrar viagens"}>
        {[
          { value: "todos", label: isCoursesPage ? "Todos os cursos" : "Todas as viagens" },
          { value: "montanhismo", label: "Montanhismo" },
          { value: "canoagem", label: "Canoagem" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              if (item.value === "todos") {
                setQuery("");
                patch({ categoria: "todos", atividade: undefined });
              } else {
                patch({ categoria: item.value });
              }
            }}
            aria-pressed={(categoria ?? "todos") === item.value}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              (categoria ?? "todos") === item.value
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!isLoading && filtered.length === 0 ? (
        <p className="card-surface p-12 text-center text-muted-foreground">
          Nenhum {isCoursesPage ? "curso" : "roteiro"} encontrado para esta busca.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => <TripCard key={trip.id} trip={trip} />)}
        </div>
      )}
    </div>
  );
}
