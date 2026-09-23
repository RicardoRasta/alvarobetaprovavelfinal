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
    <div className="mx-auto max-w-[1200px] animate-fade-up px-4 py-12 md:px-8 md:py-16">
      <header className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Mountain className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-4xl leading-[0.95] md:text-6xl">{aboutTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">A história por trás das suas aventuras.</p>
        </div>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="card-surface p-6 md:p-8">
          <RichText text={aboutText} />
          <div className="mt-6 flex items-center gap-2 text-sm">
            <a href={phoneHref(settings)} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 hover:border-accent hover:text-accent">
              <Phone className="h-4 w-4" /> {formatPhone(settings)}
            </a>
          </div>
        </div>
        <div className="card-surface h-fit overflow-hidden md:sticky md:top-24">
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


      <section id="certificado-cadastur" className="mt-12 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div className="card-surface overflow-hidden p-3">
            <img
              src="/assets/certificado-cadastur-original.jpg?v=20260923"
              alt="Certificado Cadastur da A Casa de Aventura"
              className="w-full rounded-2xl object-contain"
              loading="lazy"
            />
          </div>
          <div className="card-surface p-6 md:p-8">
            <div className="flex items-center gap-3">
              <img
                src="/assets/casa-de-aventura-logo-redonda.svg"
                alt="A Casa de Aventura"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Credencial oficial</p>
                <h2 className="mt-1 text-2xl font-bold">Certificado Cadastur</h2>
              </div>
            </div>
            <div className="content-copy mt-6 space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Atividade:</strong> Prestador Especializado em Segmentos Turísticos</p>
              <p><strong className="text-foreground">Nome do prestador:</strong> ALVARO DIOGO BADO WALENDOWSKY</p>
              <p><strong className="text-foreground">Número do cadastro:</strong> 13.849.141/0001-25</p>
              <p><strong className="text-foreground">Validade:</strong> 01/09/2025 a 01/09/2027</p>
            </div>
          </div>
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
                    className="h-20 w-20 shrink-0 rounded-xl border border-border bg-card object-contain p-1"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
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

/** Renderiza o texto do "Quem somos" preservando parágrafos, títulos e negrito. */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="content-copy space-y-4">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 text-2xl font-bold uppercase md:text-3xl">
              {block.slice(3)}
            </h2>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {block.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}
