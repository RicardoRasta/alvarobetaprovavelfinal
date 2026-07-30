import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Mountain,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { activities, formatDate, formatPrice, trips, type Trip } from "@/data/trips";

export const Route = createFileRoute("/viagens/$tripId")({
  loader: ({ params }) => {
    const trip = trips.find((t) => t.id === params.tripId);
    if (!trip) throw notFound();
    return { trip };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Viagem não encontrada — A Casa de Aventura" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { trip } = loaderData;
    return {
      meta: [
        { title: `${trip.name} — A Casa de Aventura` },
        { name: "description", content: trip.description.slice(0, 155) },
        { property: "og:title", content: `${trip.name} — A Casa de Aventura` },
        { property: "og:description", content: trip.description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TripDetail,
});

function TripDetail() {
  const { trip } = Route.useLoaderData() as { trip: Trip };
  const activity = activities.find((a) => a.id === trip.activityId);
  const [departure, setDeparture] = useState(trip.departures[0]?.date ?? "");
  const [people, setPeople] = useState(1);
  const [booked, setBooked] = useState(false);

  const selected = trip.departures.find((d) => d.date === departure);
  const total = trip.price * people;

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <Link
        to="/viagens"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar às viagens
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card-surface overflow-hidden">
            <img
              src={trip.image}
              alt={`${trip.name} em ${trip.destination}, ${trip.state}`}
              width={1024}
              height={768}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <section className="card-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
              <Mountain className="h-5 w-5 text-accent" /> Destaques do roteiro
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
              <ShieldCheck className="h-5 w-5 text-accent" /> O que está incluso
            </h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {trip.includes.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {i}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {trip.destination} · {trip.state} · {activity?.name}
          </span>
          <h1 className="mt-2 text-3xl font-bold uppercase md:text-4xl">{trip.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{trip.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">· 86 avaliações</span>
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {trip.days} dias
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              Nível {trip.level}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-muted-foreground">{trip.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(trip.price)}</span>
            {trip.oldPrice != null && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(trip.oldPrice)}
              </span>
            )}
            <span className="text-sm text-muted-foreground">por pessoa</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            em até 10x sem juros · 5% de desconto no PIX
          </p>

          <form
            className="card-surface mt-6 space-y-4 p-5"
            onSubmit={(e) => {
              e.preventDefault();
              setBooked(true);
            }}
          >
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
              <CalendarDays className="h-5 w-5 text-accent" /> Agendar esta viagem
            </h2>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Data de saída
              </span>
              <select
                value={departure}
                onChange={(e) => {
                  setDeparture(e.target.value);
                  setBooked(false);
                }}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {trip.departures.map((d) => (
                  <option key={d.date} value={d.date}>
                    {formatDate(d.date)} — {d.spots} vagas
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Número de aventureiros
              </span>
              <input
                type="number"
                min={1}
                max={selected?.spots ?? 10}
                value={people}
                onChange={(e) => {
                  setPeople(Math.max(1, Number(e.target.value) || 1));
                  setBooked(false);
                }}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" /> {people} pessoa(s)
              </span>
              <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                <CalendarDays className="h-5 w-5" /> Solicitar reserva
              </button>
              <button
                type="button"
                aria-label="Salvar viagem nos favoritos"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border transition-colors hover:border-accent hover:text-accent"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {booked && (
              <p className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                Reserva solicitada para {formatDate(departure)} — nossa equipe entra em contato para
                confirmar em até 24h.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
