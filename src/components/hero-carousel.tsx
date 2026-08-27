import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Carrossel do topo da home: até 8 imagens trocando automaticamente a cada 10s. */
export function HeroCarousel({ images }: { images: string[] }) {
  const slides = images.slice(0, 8);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 10000);
    return () => clearInterval(id);
  }, [slides.length]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <div className="absolute inset-0">
      {slides.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={i === 0 ? "Aventureiros em uma montanha brasileira ao amanhecer" : ""}
          width={1920}
          height={1080}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-opacity hover:bg-background md:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima imagem"
            className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-opacity hover:bg-background md:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir para a imagem ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-background/70 hover:bg-background"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
