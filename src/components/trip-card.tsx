import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, MapPin, MessageCircle, Star } from "lucide-react";
import { formatForeign, formatPrice, formatRange, tripImage, whatsappLink, type Trip } from "@/data/trips";
import { PriceTag } from "@/components/price-tag";
import { upcomingMonths } from "@/components/departure-chips";
import { logWhatsAppClick, nextDeparture, settingsQuery } from "@/lib/api";

export function TripCard({ trip }: { trip: Trip }) {
  const next = nextDeparture(trip);
  const { data: settings } = useQuery(settingsQuery);
  const discount =
    trip.old_price != null && trip.old_price > 0
      ? Math.round((1 - trip.price / trip.old_price) * 100)
      : null;

  return (
    <article className="group flex min-w-0 flex-col">
      <Link
        to="/viagens/$tripId"
        params={{ tripId: trip.slug }}
        className="media-frame relative block aspect-[4/3] min-h-[280px] overflow-hidden sm:min-h-0"
      >
        <img
          src={tripImage(trip)}
          alt={`${trip.name} — ${trip.destination}, ${trip.state}`}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="gradient-hero absolute inset-0 opacity-95" />

        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2 sm:left-4 sm:right-4 sm:top-4">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {discount != null && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground sm:px-3 sm:text-xs">
                -{discount}%
              </span>
            )}
            <span className="chip-glass">{trip.days} dias</span>
          </div>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform group-hover:rotate-45 sm:h-9 sm:w-9">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <h3 className="mb-2 font-display text-[1.35rem] font-semibold leading-[1.08] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.6)] sm:text-2xl md:text-3xl">
            {trip.name}
          </h3>

          <div className="grid gap-1.5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.65)] sm:grid-cols-2">
            <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold sm:text-sm">
              <CalendarDays className="h-4 w-4 shrink-0 text-white" />
              <span className="truncate">
                {next ? formatRange(next.date, next.return_date) : "Datas sob consulta"}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold sm:text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-white" />
              <span className="truncate">
                {[trip.destination, trip.state].filter(Boolean).join(" · ") || "Local sob consulta"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 min-w-0 flex-col gap-2 px-1 pt-4">
        <Link
          to="/viagens/$tripId"
          params={{ tripId: trip.slug }}
          className="font-display text-xl leading-[1.05] transition-colors hover:text-accent sm:text-2xl"
        >
          {trip.name}
        </Link>
        <p className="content-copy line-clamp-2 text-sm leading-6 text-muted-foreground">{trip.description}</p>

        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold">{Number(trip.rating).toFixed(1)}</span>
          <span className="text-muted-foreground">· nível {trip.level}</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            {trip.price > 0 ? (
              <PriceTag value={trip.price} />
            ) : trip.price_usd != null && Number(trip.price_usd) > 0 ? (
              <span className="text-xl font-semibold">{formatForeign(Number(trip.price_usd), 1, "USD")}</span>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">Sob consulta</span>
            )}
            {trip.old_price != null && trip.price > 0 && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(trip.old_price)}</span>
            )}
            {(trip.price > 0 || (trip.price_usd != null && Number(trip.price_usd) > 0)) && (
              <span className="text-xs text-muted-foreground">por pessoa</span>
            )}
          </div>

          <div className="mt-4 grid gap-2 sm:flex">
            <a
              href={whatsappLink(settings, {
                tripName: trip.name,
                date: next?.date,
                returnDate: next?.return_date,
                destination: trip.destination,
                state: trip.state,
                days: trip.days,
                price: trip.price,
                priceUsd: trip.price_usd,
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
              className="btn-pill min-w-0 flex-1 !px-4 !py-2.5 !text-sm"
            >
              <MessageCircle className="h-4 w-4" /> Agendar no WhatsApp
            </a>
            <Link
              to="/viagens/$tripId"
              params={{ tripId: trip.slug }}
              className="btn-pill-outline min-w-0 !px-4 !py-2 !text-sm"
            >
              Ver roteiro
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
