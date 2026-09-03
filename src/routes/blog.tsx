import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Newspaper } from "lucide-react";
import { blogQuery } from "@/lib/api";
import { formatDate, normalizeImage } from "@/data/trips";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Histórias de expedições, dicas de aventura e relatos de viagens pela Brasil com a Casa de Aventura.",
      },
      { property: "og:title", content: "Blog — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Histórias e dicas de viagens de aventura pelo Brasil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { data: posts = [], isLoading } = useQuery(blogQuery);
  const published = posts.filter((p) => p.published);

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="flex items-center gap-3">
        <Newspaper className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-4xl leading-[0.95] md:text-5xl">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Histórias e dicas das nossas expedições.</p>
        </div>
      </header>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carregando posts...</p>
      ) : published.length === 0 ? (
        <p className="mt-8 card-surface p-10 text-center text-sm text-muted-foreground">
          Nenhum post publicado ainda. Volte em breve!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="card-surface hover-lift group flex flex-col overflow-hidden"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                {p.cover_url ? (
                  <img
                    src={normalizeImage(p.cover_url)}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : p.images.length > 0 ? (
                  <img
                    src={normalizeImage(p.images[0])}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Newspaper className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(p.published_at)}
                </span>
                <h2 className="font-semibold leading-snug transition-colors group-hover:text-accent">
                  {p.title}
                </h2>
                {p.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
