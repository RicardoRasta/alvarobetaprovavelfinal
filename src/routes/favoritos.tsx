import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/store";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Casa de Aventura" },
      { name: "description", content: "Os equipamentos outdoor que você salvou para comprar depois." },
      { property: "og:title", content: "Favoritos — Casa de Aventura" },
      { property: "og:description", content: "Sua lista de desejos na Casa de Aventura." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const saved = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold uppercase md:text-4xl">Favoritos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {saved.length} itens salvos na sua lista de desejos.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
