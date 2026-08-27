import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Mountain, Phone, Users } from "lucide-react";
import { certificatesQuery, settingsQuery } from "@/lib/api";
import { formatPhone, normalizeImage, phoneHref } from "@/data/trips";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem somos — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Conheça a história da A Casa de Aventura, nossa equipe de guias e as certificações que garantem segurança nas expedições.",
      },
      { property: "og:title", content: "Quem somos — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Agência de viagens de aventura com guias credenciados e seguro aventura incluso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuemSomos,
});

function QuemSomos() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: certificates = [] } = useQuery(certificatesQuery);

  const aboutTitle = settings?.about_title?.trim() || "Quem somos";
  const aboutText =
    settings?.about_text?.trim() ||
    "A Casa de Aventura é uma agência especializada em turismo de aventura pelo Brasil. Há mais de uma década levamos aventureiros a destinos incríveis com segurança, guias credenciados e respeito ao meio ambiente. Canoagem, escalada, trekking e expedições fazem parte do nosso dia a dia.";

  return (
    <div className="mx-auto max-w-5xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Mountain className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-bold uppercase md:text-4xl">{aboutTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">A história por trás das suas aventuras.</p>
        </div>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card-surface p-6">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{aboutText}</p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            <a href={phoneHref(settings)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 hover:border-accent hover:text-accent">
              <Phone className="h-4 w-4" /> {formatPhone(settings)}
            </a>
          </div>
        </div>
        <div className="card-surface overflow-hidden">
          {settings?.about_image_url ? (
            <img
              src={normalizeImage(settings.about_image_url)}
              alt="Equipe A Casa de Aventura"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-secondary text-muted-foreground">
              <Users className="h-10 w-10" />
            </div>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-bold uppercase">
          <Award className="h-6 w-6 text-accent" /> Certificações
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selos e credenciais que garantem segurança e qualidade nas nossas expedições.
        </p>
        {certificates.length === 0 ? (
          <p className="mt-6 card-surface p-8 text-center text-sm text-muted-foreground">
            Nenhuma certificação cadastrada ainda.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c) => (
              <article key={c.id} className="card-surface flex gap-4 p-4">
                {c.image_url ? (
                  <img
                    src={normalizeImage(c.image_url)}
                    alt={c.title}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-md border border-border bg-card object-contain p-1"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold">{c.title}</h3>
                  {c.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
