import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/data/store";

type CatalogSearch = { categoria?: string; q?: string };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    categoria: typeof search.categoria === "string" ? search.categoria : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — Casa de Aventura" },
      {
        name: "description",
        content:
          "Pesquise e filtre equipamentos de camping, trilha e escalada por categoria, preço e disponibilidade.",
      },
      { property: "og:title", content: "Catálogo — Casa de Aventura" },
      {
        property: "og:description",
        content: "Todos os equipamentos outdoor da Casa de Aventura em um só lugar.",
      },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { categoria } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!categoria || p.categoryId === categoria) &&
        (!q ||
          `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q)),
    );
  }, [categoria, query]);

  const setCategoria = (id?: string) =>
    navigate({ search: (prev) => ({ ...prev, categoria: id }) });

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase md:text-4xl">Catálogo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} produto(s) encontrado(s)
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Pesquisar por nome, marca ou descrição..."
            className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={!categoria} onClick={() => setCategoria(undefined)} label="Todas" />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={categoria === c.id}
            onClick={() => setCategoria(c.id)}
            label={c.name}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="card-surface p-10 text-center text-muted-foreground">
          Nenhum produto encontrado para esta busca.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
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
