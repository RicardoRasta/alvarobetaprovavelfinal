import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { sortByNextDeparture, tagsQuery, tripsQuery } from "@/lib/api";

type CatalogSearch = { atividade?: string; q?: string; data?: string; tag?: string; categoria?: string };

export const Route = createFileRoute("/viagens/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    atividade: typeof search.atividade === "string" ? search.atividade : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    data: typeof search.data === "string" ? search.data : undefined,
    tag: typeof search.tag === "string" ? search.tag : undefined,\n    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
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
  const { atividade, data, tag, categoria } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const { data: trips = [], isLoading } = useQuery(tripsQuery);
  const { data: tags = [] } = useQuery(tagsQuery);

  const normalizeTagName = (value: string) =>
    value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const selectedTag = tags.find(
    (t) => t.id === tag || normalizeTagName(t.name) === normalizeTagName(tag ?? ""),
  );
  const tagNameById = useMemo(
    () => new Map(tags.map((t) => [t.id, t.name])),
    [tags],
  );
  const normalizeTagValue = (value: string) =>
    normalizeTagName(tagNameById.get(value) ?? value);
  const isCourseLikeTag = (value: string) => {
    const normalized = normalizeTagValue(value);
    return normalized === "cursos" || normalized.startsWith("curso ");
  };
  // A separação entre cursos e viagens é independente das tags cadastradas.
  // A categoria é identificada pelo nome do roteiro, evitando cruzamento entre catálogos.
  const isCoursesPage =
    normalizeTagName(tag ?? "") === "cursos" ||
    isCourseLikeTag(selectedTag?.name ?? "");
  const isCourseTrip = (trip: (typeof trips)[number]) =>
    normalizeTagName(trip.name).includes("curso ");
  const getCatalogCategory = (trip: (typeof trips)[number]) => {
    const name = normalizeTagName(trip.name);
    if (name.includes("canoagem") || name.includes("canoagem") || name.includes("canoeagem")) return "canoagem";
    if (name.includes("montanhismo") || name.includes("montanha") || name.includes("trekking") || name.includes("hiking") || name.includes("escalada")) return "montanhismo";
    return "outros";
  };  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByNextDeparture(
      trips.filter((t) => {
        const isCorrectCatalog = t.published && (isCoursesPage ? isCourseTrip(t) : !isCourseTrip(t));
        const categoryMatches = !categoria || categoria === "todos" || getCatalogCategory(t) === categoria;
        const activityMatches = !atividade || t.activity_id === atividade;
        const dateMatches = !data || (t.departures ?? []).some((d) => d.date >= data);
        const queryMatches = !q || `${t.name} ${t.destination} ${t.state} ${t.description}`.toLowerCase().includes(q);
        return isCorrectCatalog && categoryMatches && activityMatches && dateMatches && queryMatches;
      }),
    );
  }, [atividade, data, categoria, query, trips, isCoursesPage]);      <div className="mb-10 flex flex-wrap gap-2" aria-label={isCoursesPage ? "Filtrar cursos" : "Filtrar viagens"}>
        {[
          { value: "todos", label: "Todos" },
          { value: "montanhismo", label: "Montanhismo" },
          { value: "canoagem", label: "Canoagem" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => patch({ categoria: item.value })}
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
