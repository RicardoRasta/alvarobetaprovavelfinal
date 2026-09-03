import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, MessageCircle, Star } from "lucide-react";
import { formatPrice, formatRange, tripImage, whatsappLink, type Trip } from "@/data/trips";
import { PriceTag } from "@/components/price-tag";
import { DepartureChips, upcomingMonths } from "@/components/departure-chips";
import { logWhatsAppClick, nextDeparture, settingsQuery } from "@/lib/api";

export function TripCard({ trip }: { trip: Trip }) {
  const next = nextDeparture(trip);
  const { data: settings } = useQuery(settingsQuery);
  const discount =
    trip.old_price != null && trip.old_price > 0
      ? Math.round((1 - trip.price / trip.old_price) * 100)
      : null;

  return (
    <article className="group flex flex-col">
      <Link
        to="/viagens/$tripId"
        params={{ tripId: trip.slug }}
        className="media-frame relative block aspect-[4/3]"
      >
        <img
          src={tripImage(trip)}
          alt={`${trip.name} — ${trip.destination}, ${trip.state}`}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="gradient-hero absolute inset-0 opacity-80" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {discount != null && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                -{discount}%
              </span>
            )}
            <span className="chip-glass">{trip.days} dias</span>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <DepartureChips
            months={upcomingMonths(trip, 3)}
            places={[trip.destination, trip.state].filter(Boolean) as string[]}
            glass
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-1 pt-4">
        <Link
          to="/viagens/$tripId"
          params={{ tripId: trip.slug }}
          className="font-display text-2xl leading-[0.95] transition-colors hover:text-accent"
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
          <div className="flex flex-wrap items-baseline gap-2">
            <PriceTag value={trip.price} />
            {trip.old_price != null && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(trip.old_price)}
              </span>
            )}
            {trip.price > 0 && <span className="text-xs text-muted-foreground">por pessoa</span>}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {next
              ? `Próxima saída: ${formatRange(next.date, next.return_date)}`
              : "Datas sob consulta"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={whatsappLink(settings, {
                tripName: trip.name,
                date: next?.date,
                returnDate: next?.return_date,
                destination: trip.destination,
                state: trip.state,
                days: trip.days,
                price: trip.price,
                slug: trip.slug,
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
              className="btn-pill flex-1 !px-4 !py-2.5 !text-sm"
            >
              <MessageCircle className="h-4 w-4" /> Agendar no WhatsApp
            </a>
            <Link
              to="/viagens/$tripId"
              params={{ tripId: trip.slug }}
              className="btn-pill-outline !px-4 !py-2 !text-sm"
            >
              Ver roteiro
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
