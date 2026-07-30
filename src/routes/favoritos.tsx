import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TripCard } from "@/components/trip-card";
import { tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Viagens salvas — A Casa de Aventura" },
      {
        name: "description",
        content: "As viagens de aventura que você salvou para agendar depois.",
      },
      { property: "og:title", content: "Viagens salvas — A Casa de Aventura" },
      { property: "og:description", content: "Sua lista de desejos de aventuras pelo Brasil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const saved = trips.filter((t) => t.published).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold uppercase md:text-4xl">Viagens salvas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {saved.length} roteiros salvos na sua lista de desejos.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((t) => (
          <TripCard key={t.id} trip={t} />
        ))}
      </div>
    </div>
  );
}
