import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { blogQuery } from "@/lib/api";
import { formatDate, normalizeImage, videoEmbed } from "@/data/trips";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Blog — A Casa de Aventura` },
      { name: "description", content: "Artigo do blog da Casa de Aventura." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: posts = [], isLoading } = useQuery(blogQuery);
  const post = posts.find((p) => p.slug === slug && p.published);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold uppercase">Post não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Este post não existe ou foi removido.</p>
        <Link to="/blog" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
          Ver todos os posts
        </Link>
      </div>
    );
  }

  const cover = post.cover_url || post.images[0] || null;

  return (
    <article className="mx-auto max-w-3xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Voltar ao blog
      </Link>

      <header className="mt-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
        </span>
        <h1 className="mt-2 text-4xl leading-[0.98] md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>}
      </header>

      {cover && (
        <img
          src={normalizeImage(cover)}
          alt={post.title}
          className="mt-6 w-full rounded-lg border border-border object-cover"
        />
      )}

      {post.content && (
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground md:text-base">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className={line.trim() ? "" : "h-2"}>
              {line}
            </p>
          ))}
        </div>
      )}

      {post.images.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase text-accent">Galeria</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {post.images.map((img, i) => (
              <img
                key={i}
                src={normalizeImage(img)}
                alt={`Foto ${i + 1}`}
                loading="lazy"
                className="w-full rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {post.videos.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-bold uppercase text-accent">Vídeos</h2>
          {post.videos.map((v, i) => {
            const embed = videoEmbed(v);
            if (!embed) return null;
            return (
              <div key={i} className="overflow-hidden rounded-lg border border-border">
                {embed.type === "embed" ? (
                  <div className="aspect-video">
                    <iframe
                      src={embed.src}
                      title={`Vídeo ${i + 1}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video src={embed.src} controls className="w-full" />
                )}
              </div>
            );
          })}
        </section>
      )}
    </article>
  );
}
