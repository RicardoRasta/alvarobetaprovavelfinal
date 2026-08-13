import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Compass, ShieldCheck, Users } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { bannerImage, formatRange } from "@/data/trips";
import { activitiesQuery, settingsQuery, sortByNextDeparture, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Casa de Aventura — Viagens de aventura pelo Brasil" },
      {
        name: "description",
        content:
          "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil. Agende sua saída pelo WhatsApp.",
      },
      { property: "og:title", content: "A Casa de Aventura — Viagens de aventura pelo Brasil" },
      {
        property: "og:description",
        content: "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil. Agende sua saída pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const { data: settings } = useQuery(settingsQuery);

  const visible = trips.filter((t) => t.published);
  const featured = sortByNextDeparture(visible.filter((t) => t.featured)).slice(0, 4);
  const today = new Date().toISOString().slice(0, 10);
  const nextDepartures = visible
    .flatMap((t) => (t.departures ?? []).map((d) => ({ trip: t, ...d })))
    .filter((d) => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="animate-fade-up">
      <section className="relative overflow-hidden">
        <img
          src={bannerImage(settings)}
          alt="Aventureiros em uma montanha brasileira ao amanhecer"
          width={1920}
          height={1080}
          className="h-[380px] w-full object-cover md:h-[460px]"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">
              <Compass className="h-4 w-4" /> Casa de Aventura
            </span>
            {settings?.banner_badge && (
              <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                {settings.banner_badge}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
              {settings?.banner_title || "Viagens de aventura pelo Brasil"}
            </h1>
            <p className="mt-4 max-w-md text-sm opacity-90 md:text-base">
              {settings?.banner_subtitle ||
                "Canoagem, escalada, trekking e expedições guiadas por todo o Brasil."}
            </p>
            <Link
              to="/viagens"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:translate-x-1"
            >
              Ver roteiros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 md:px-6 md:py-14">
        {(settings?.stats?.length ?? 0) > 0 && (
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {settings!.stats.map((s) => (
              <div key={s.label} className="card-surface p-4 md:p-5">
                <p className="font-display text-2xl font-bold text-accent md:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </section>
        )}

        <section>
          <header className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase md:text-3xl">Atividades</h2>
            <Link to="/viagens" className="text-sm font-medium text-accent hover:underline">
              Ver tudo
            </Link>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {activities.map((a) => (
              <Link
                key={a.id}
                to="/viagens"
                search={{ atividade: a.id }}
                className="card-surface hover-lift p-4"
              >
                <p className="font-semibold">{a.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section>
            <h2 className="mb-5 text-2xl font-bold uppercase md:text-3xl">Roteiros em destaque</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </section>
        )}

        {nextDepartures.length > 0 && (
          <section className="card-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold uppercase">
                <CalendarDays className="h-5 w-5 text-accent" /> Próximas saídas
              </h2>
              <p className="text-sm text-muted-foreground">Reserve enquanto houver vagas</p>
            </div>
            <ul className="divide-y divide-border">
              {nextDepartures.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <span className="w-56 text-sm font-semibold">{formatRange(d.date, d.return_date)}</span>
                  <Link
                    to="/viagens/$tripId"
                    params={{ tripId: d.trip.slug }}
                    className="min-w-0 flex-1 truncate font-medium hover:text-accent"
                  >
                    {d.trip.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {d.trip.destination} · {d.trip.state}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {d.spots} vagas
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Compass, title: "Guias credenciados", text: "Condutores locais em todos os roteiros." },
            { icon: ShieldCheck, title: "Seguro aventura incluso", text: "Cobertura durante toda a viagem." },
            { icon: Users, title: "Grupos pequenos", text: "No máximo 16 pessoas por saída." },
          ].map((b) => (
            <div key={b.title} className="card-surface flex items-start gap-3 p-5">
              <b.icon className="h-6 w-6 shrink-0 text-accent" />
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
