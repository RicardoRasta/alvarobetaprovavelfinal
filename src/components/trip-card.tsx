import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { formatDate, formatPrice, type Trip } from "@/data/trips";

export function TripCard({ trip }: { trip: Trip }) {
  const next = trip.departures[0];
  const discount =
    trip.oldPrice != null ? Math.round((1 - trip.price / trip.oldPrice) * 100) : null;

  return (
    <article className="card-surface hover-lift group flex flex-col overflow-hidden">
      <Link
        to="/viagens/$tripId"
        params={{ tripId: trip.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={trip.image}
          alt={`${trip.name} — ${trip.destination}, ${trip.state}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            -{discount}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {trip.days} dias
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {trip.destination} · {trip.state}
        </span>
        <Link
          to="/viagens/$tripId"
          params={{ tripId: trip.id }}
          className="font-semibold leading-snug transition-colors hover:text-accent"
        >
          {trip.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {trip.rating.toFixed(1)}
          </span>
          <span>Nível {trip.level}</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{formatPrice(trip.price)}</span>
            {trip.oldPrice != null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(trip.oldPrice)}
              </span>
            )}
            <span className="text-xs text-muted-foreground">/ pessoa</span>
          </div>
          {next && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Próxima saída {formatDate(next.date)} · {next.spots} vagas
            </p>
          )}
          <Link
            to="/viagens/$tripId"
            params={{ tripId: trip.id }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" />
            Agendar viagem
          </Link>
        </div>
      </div>
    </article>
  );
}
