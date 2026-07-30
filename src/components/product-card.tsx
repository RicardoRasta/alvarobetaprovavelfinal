import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { formatPrice, type Product } from "@/data/store";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;
  const discount =
    product.oldPrice != null
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null;

  return (
    <article className="card-surface hover-lift group flex flex-col overflow-hidden">
      <Link
        to="/catalogo/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
            Sem estoque
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </span>
        <Link
          to="/catalogo/$productId"
          params={{ productId: product.id }}
          className="font-semibold leading-snug transition-colors hover:text-accent"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice != null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {outOfStock ? "Indisponível no momento" : `${product.stock} em estoque`}
          </p>
          <button
            type="button"
            disabled={outOfStock}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? "Avise-me" : "Comprar"}
          </button>
        </div>
      </div>
    </article>
  );
}
