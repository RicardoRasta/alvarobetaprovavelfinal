import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Compass, ShieldCheck, Users } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { TripCard } from "@/components/trip-card";
import { activities, formatDate, quickStats, trips } from "@/data/trips";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Casa de Aventura — Viagens de aventura pelo Brasil" },
      {
        name: "description",
        content:
          "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil. Agende sua próxima saída.",
      },
      { property: "og:title", content: "A Casa de Aventura — Viagens de aventura pelo Brasil" },
      {
        property: "og:description",
        content: "Roteiros guiados de canoagem, escalada e trekking com saídas confirmadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = trips.filter((t) => t.featured);
  const nextDepartures = trips
    .flatMap((t) => t.departures.map((d) => ({ trip: t, ...d })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="animate-fade-up">
      {/* Banner principal */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Aventureiros caminhando em uma montanha brasileira ao amanhecer"
          width={1920}
          height={1080}
          className="h-[380px] w-full object-cover md:h-[460px]"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-xl text-primary-foreground">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              Saídas confirmadas 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
              Viagens de aventura pelo Brasil
            </h1>
            <p className="mt-4 max-w-md text-sm opacity-90 md:text-base">
              Canoagem, escalada, trekking e expedições guiadas. Escolha o destino, a data e agende
              sua vaga em poucos cliques.
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
        {/* Estatísticas rápidas */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {quickStats.map((s) => (
            <div key={s.label} className="card-surface p-4 md:p-5">
              <p className="font-display text-2xl font-bold text-accent md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Atividades */}
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

        {/* Roteiros em destaque */}
        <section>
          <h2 className="mb-5 text-2xl font-bold uppercase md:text-3xl">Roteiros em destaque</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        </section>

        {/* Próximas saídas */}
        <section className="card-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold uppercase">
              <CalendarDays className="h-5 w-5 text-accent" /> Próximas saídas
            </h2>
            <p className="text-sm text-muted-foreground">Reserve enquanto houver vagas</p>
          </div>
          <ul className="divide-y divide-border">
            {nextDepartures.map((d) => (
              <li
                key={`${d.trip.id}-${d.date}`}
                className="flex flex-wrap items-center gap-3 px-5 py-4"
              >
                <span className="w-32 text-sm font-semibold">{formatDate(d.date)}</span>
                <Link
                  to="/viagens/$tripId"
                  params={{ tripId: d.trip.id }}
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

        {/* Diferenciais */}
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
