import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, Search, Radio, MessageCircle } from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { HeroCarousel } from "@/components/hero-carousel";
import { SectionHeading } from "@/components/section-heading";
import { upcomingMonths } from "@/components/departure-chips";
import { heroSlides, tripImage } from "@/data/trips";
import { activitiesQuery, dedupeTripsByName, isTripOngoing, settingsQuery, sortByNextDeparture, tagsQuery, testimonialsQuery, tripsQuery } from "@/lib/api";

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
        content:
          "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil. Agende sua saída pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: tags = [] } = useQuery(tagsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const { data: settings } = useQuery(settingsQuery);
  const { data: testimonials = [] } = useQuery(testimonialsQuery);
  const [homeTestimonials, setHomeTestimonials] = useState<typeof testimonials>([]);

  useEffect(() => {
    if (testimonials.length === 0) {
      setHomeTestimonials([]);
      return;
    }

    const shuffled = [...testimonials];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const count = Math.min(shuffled.length, 3 + Math.floor(Math.random() * 3));
    setHomeTestimonials(shuffled.slice(0, count));
  }, [testimonials]);

  const normalizeCategory = (value: string) =>
    value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const tagNames = new Map(tags.map((tag) => [tag.id, normalizeCategory(tag.name)]));
  const isCourse = (trip: (typeof trips)[number]) =>
    (trip.tags ?? []).some((value) => {
      const name = tagNames.get(value) ?? normalizeCategory(value);
      return name === "cursos" || name.startsWith("curso ");
    }) || normalizeCategory(trip.name).includes("curso ");
  const visible = dedupeTripsByName(trips.filter((t) => t.published));
  const visibleTrips = visible.filter((t) => !isCourse(t));
  const visibleCourses = visible.filter(isCourse);
  const featured = sortByNextDeparture(visibleTrips.filter((t) => t.featured)).slice(0, 6);
  const featuredCourses = sortByNextDeparture(visibleCourses).slice(0, 3);
  const heroTrips = featured.length > 0 ? featured.slice(0, 4) : sortByNextDeparture(visibleTrips).slice(0, 4);

  return (
    <div className="animate-fade-up">
      <section className="mx-auto max-w-[1400px] px-4 pt-2 md:px-8">
        <HeroCarousel
          images={heroSlides(settings)}
          trips={heroTrips}
          fallbackTitle={settings?.banner_title || "Viagens de aventura pelo Brasil"}
          fallbackDescription={
            settings?.banner_subtitle ||
            "Canoagem, escalada, trekking e expedições guiadas por todo o Brasil."
          }
        />
      </section>

      <section className="mx-auto mt-5 max-w-[1400px] px-4 md:px-8">
        <a
          href="https://wa.me/554733511661?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20viagens%20e%20cursos%20da%20Casa%20de%20Aventura."
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-center text-sm font-extrabold text-white shadow-lg transition hover:brightness-95 sm:text-base"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          Fale com a Casa de Aventura pelo WhatsApp
        </a>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-24 px-4 py-20 md:px-8">

        {visibleTrips.filter(isTripOngoing).length > 0 && (
          <section className="rounded-3xl border border-accent/30 bg-accent/10 p-5 md:p-8">
            <div className="flex items-center gap-2 text-accent">
              <Radio className="h-5 w-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">Acontecendo no momento</span>
            </div>
            <h2 className="mt-2 text-3xl leading-none md:text-5xl">Aventura em andamento</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Estas experiências estão acontecendo hoje. Acompanhe os roteiros em andamento da Casa de Aventura.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTrips.filter(isTripOngoing).map((t) => <TripCard key={t.id} trip={t} />)}
            </div>
          </section>
        )}

        {(settings?.stats?.length ?? 0) > 0 && (
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {settings!.stats.map((s) => (
              <div key={s.label} className="card-surface p-6">
                <p className="font-display text-4xl text-accent md:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </section>
        )}

        {featured.length > 0 && (
          <section>
            <SectionHeading title="Roteiros em destaque" linkTo="/viagens" linkLabel="Ver todos os roteiros" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t) => (
                <article key={t.id} className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
                  <Link to="/viagens/$tripId" params={{ tripId: t.slug }} className="block">
                    <div className="media-frame aspect-[4/3] overflow-hidden">
                      <img src={tripImage(t)} alt={t.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="space-y-3 p-4">
                      <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-accent md:text-2xl">{t.name}</h3>
                      <div className="flex flex-wrap gap-1.5 text-xs capitalize text-muted-foreground">
                        {upcomingMonths(t, 3).length > 0
                          ? upcomingMonths(t, 3).map((m) => <span key={m} className="chip">{m}</span>)
                          : <span className="chip">Datas sob consulta</span>}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {featuredCourses.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl leading-none md:text-4xl">Cursos</h2>
              <Link to="/viagens" search={{ tag: "cursos" }} className="text-sm font-semibold text-accent hover:underline">Ver todos os cursos <ArrowRight className="inline h-4 w-4" /></Link>
            </div>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((t) => <TripCard key={t.id} trip={t} />)}
            </div>
          </section>
        )}


        {activities.length > 0 && (
          <section>
            <SectionHeading title="Atividades" linkTo="/viagens" linkLabel="Ver tudo" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <Link
                  key={a.id}
                  to="/viagens"
                  search={{ atividade: a.id }}
                  className="card-surface hover-lift group flex items-start justify-between gap-4 p-6"
                >
                  <div>
                    <p className="font-display text-2xl leading-none">{a.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section>
            <SectionHeading title="Saídas confirmadas" linkTo="/viagens" linkLabel="Todos os roteiros" />
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 3).map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </section>
        )}

        {homeTestimonials.length > 0 && (
          <section>
            <SectionHeading title="Comentários" linkTo="/comentarios" linkLabel="Ver todos os comentários" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {homeTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
