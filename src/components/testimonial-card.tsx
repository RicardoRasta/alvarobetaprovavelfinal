import { useState } from "react";
import { Star } from "lucide-react";
import { normalizeImage, type Testimonial } from "@/data/trips";
import { ImageLightbox } from "@/components/image-lightbox";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <>
      <article className="card-surface p-5">
        <header className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{testimonial.name}</span>
          <span className="flex gap-0.5 text-accent" aria-label={String(testimonial.rating) + " estrelas"}>
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </span>
          {testimonial.trip_name && (
            <span className="text-xs text-muted-foreground">· {testimonial.trip_name}</span>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(testimonial.created_at).toLocaleDateString("pt-BR")}
          </span>
        </header>

        {testimonial.activity_date && (
          <p className="mt-2 text-xs font-semibold text-foreground/75">
            Data da atividade:{" "}
            {new Date(testimonial.activity_date + "T12:00:00").toLocaleDateString("pt-BR")}
          </p>
        )}

        <p className="content-copy mt-3 text-sm leading-relaxed text-muted-foreground">
          {testimonial.comment}
        </p>

        {testimonial.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {testimonial.photos.map((photo, index) => {
              const src = normalizeImage(photo);
              return (
                <button
                  key={photo + "-" + index}
                  type="button"
                  onClick={() => setSelectedPhoto(src)}
                  className="group relative overflow-hidden rounded-xl border border-border bg-muted text-left"
                  aria-label={"Abrir foto " + (index + 1) + " do depoimento"}
                >
                  <img
                    src={src}
                    alt={"Foto " + (index + 1) + " enviada por " + testimonial.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1 text-center text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Clique para ampliar
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </article>

      {selectedPhoto && (
        <ImageLightbox
          src={selectedPhoto}
          alt="Foto ampliada do depoimento"
          open={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
