import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, MessageCircle, Star } from "lucide-react";
import { formatPrice, formatRange, tripImage, whatsappLink, type Trip } from "@/data/trips";
import { logWhatsAppClick, nextDeparture, settingsQuery } from "@/lib/api";

export function TripCard({ trip }: { trip: Trip }) {
  const next = nextDeparture(trip);
  const { data: settings } = useQuery(settingsQuery);
  const discount =
    trip.old_price != null && trip.old_price > 0
      ? Math.round((1 - trip.price / trip.old_price) * 100)
      : null;


  return (
    <article className="card-surface hover-lift group flex flex-col overflow-hidden">
      <Link
        to="/viagens/$tripId"
        params={{ tripId: trip.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={tripImage(trip)}
          alt={`${trip.name} — ${trip.destination}, ${trip.state}`}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount != null && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            -{discount}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">
          {trip.days} dias
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {trip.destination} · {trip.state}
        </span>
        <Link
          to="/viagens/$tripId"
          params={{ tripId: trip.slug }}
          className="font-semibold leading-snug transition-colors hover:text-accent"
        >
          {trip.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{trip.description}</p>

        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold">{Number(trip.rating).toFixed(1)}</span>
          <span className="text-muted-foreground">· nível {trip.level}</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{formatPrice(trip.price)}</span>
            {trip.old_price != null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(trip.old_price)}
              </span>
            )}
            <span className="text-xs text-muted-foreground">por pessoa</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {next ? `Próxima saída: ${formatRange(next.date, next.return_date)}` : "Datas sob consulta"}
          </p>
          <Link
            to="/viagens/$tripId"
            params={{ tripId: trip.slug }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <CalendarDays className="h-4 w-4" /> Agendar
          </Link>
          <a
            href={whatsappLink(settings, {
              tripName: trip.name,
              date: next?.date,
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              logWhatsAppClick({
                tripId: trip.id,
                tripName: trip.name,
                source: "card",
                departureDate: next?.date,
              })
            }
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >

            <MessageCircle className="h-4 w-4" /> Agendar no WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

