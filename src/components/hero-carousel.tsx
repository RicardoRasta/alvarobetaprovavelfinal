import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DepartureChips, upcomingMonths } from "@/components/departure-chips";
import { tripImage, type Trip } from "@/data/trips";

type Slide = {
  key: string;
  image: string;
  title?: string;
  description?: string;
  to?: string;
  slug?: string;
  months: string[];
  places: string[];
};

/**
 * Carrossel do topo da home: cartão grande arredondado com foto cheia,
 * botão "Explorar" e chips de saídas/locais. Troca automática a cada 10s.
 */
export function HeroCarousel({
  images,
  trips = [],
  fallbackTitle,
  fallbackDescription,
}: {
  images: string[];
  trips?: Trip[];
  fallbackTitle?: string;
  fallbackDescription?: string;
}) {
  const fromTrips: Slide[] = trips.slice(0, 8).map((t) => ({
    key: t.id,
    image: tripImage(t),
    title: t.name,
    description: t.description,
    to: "/viagens/$tripId",
    slug: t.slug,
    months: upcomingMonths(t),
    places: [t.destination, t.state].filter(Boolean) as string[],
  }));

  const fromImages: Slide[] = images.slice(0, 8).map((src, i) => ({
    key: `img-${i}`,
    image: src,
    title: i === 0 ? fallbackTitle : undefined,
    description: i === 0 ? fallbackDescription : undefined,
    to: "/viagens",
    months: [],
    places: [],
  }));

  const slides = fromTrips.length > 0 ? fromTrips : fromImages;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 10000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);
  if (slides.length === 0) return null;

  return (
    <div>
      <div className="media-frame relative h-[440px] md:h-[620px]">
        {slides.map((s, i) => (
          <div
            key={s.key}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={s.image}
              alt={s.title || "Aventura guiada pela Casa de Aventura"}
              width={1920}
              height={1080}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
            <div className="gradient-hero absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 text-primary-foreground md:p-10">
              {s.title && (
                <div className="max-w-2xl">
                  <h2 className="text-3xl leading-[0.95] text-primary-foreground md:text-5xl">
                    {s.title}
                  </h2>
                  {s.description && (
                    <p className="mt-3 line-clamp-2 max-w-xl text-sm text-primary-foreground/85 md:text-base">
                      {s.description}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
                {s.slug ? (
                  <Link to="/viagens/$tripId" params={{ tripId: s.slug }} className="btn-pill">
                    Explorar
                  </Link>
                ) : (
                  <Link to="/viagens" className="btn-pill">
                    Explorar
                  </Link>
                )}
                <DepartureChips months={s.months} places={s.places} glass />
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <div className="absolute bottom-6 right-4 z-20 flex gap-2 md:right-8">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground/40 text-primary-foreground backdrop-blur transition-colors hover:bg-foreground/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground/40 text-primary-foreground backdrop-blur transition-colors hover:bg-foreground/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-5 flex justify-center gap-2.5">
          {slides.map((s, i) => (
            <button
              type="button"
              key={s.key}
              onClick={() => setIndex(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-2.5 bg-accent" : "w-2.5 bg-border hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
