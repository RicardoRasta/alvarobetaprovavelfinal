import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { categories, formatPrice, products } from "@/data/store";

export const Route = createFileRoute("/catalogo/$productId")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produto não encontrado — Casa de Aventura" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Casa de Aventura` },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: `${product.name} — Casa de Aventura` },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const category = categories.find((c) => c.id === product.categoryId);
  const outOfStock = product.stock === 0;

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <Link
        to="/catalogo"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card-surface overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {category?.name} · {product.brand}
          </span>
          <h1 className="mt-2 text-3xl font-bold uppercase md:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· 128 avaliações</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice != null && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            em até 10x sem juros · 5% de desconto no PIX
          </p>

          <p
            className={`mt-4 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium ${
              outOfStock ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <Check className="h-4 w-4" />
            {outOfStock ? "Produto sem estoque" : `${product.stock} unidades disponíveis`}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={outOfStock}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              {outOfStock ? "Avise-me quando chegar" : "Comprar agora"}
            </button>
            <button
              type="button"
              aria-label="Adicionar aos favoritos"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border transition-colors hover:border-accent hover:text-accent"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="card-surface mt-6 flex items-start gap-3 p-4">
            <Truck className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm text-muted-foreground">
              Frete grátis para compras acima de R$ 399. Entrega estimada de 3 a 8 dias úteis.
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-bold uppercase">Descrição completa</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{product.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
