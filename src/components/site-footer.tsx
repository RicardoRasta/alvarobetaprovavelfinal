import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { formatPhone, normalizeImage, phoneHref, whatsappLink } from "@/data/trips";
import { certificatesQuery, settingsQuery } from "@/lib/api";

const links = [
  { to: "/viagens", label: "Roteiros" },
  { to: "/calendario", label: "Calendário" },
  { to: "/blog", label: "Blog" },
  { to: "/comentarios", label: "Comentários" },
  { to: "/quem-somos", label: "Quem somos" },
] as const;

/** Rodapé escuro com contato, links, redes sociais e selos. */
export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: certificates = [] } = useQuery(certificatesQuery);
  const socials = [
    { url: settings?.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: settings?.facebook_url, Icon: Facebook, label: "Facebook" },
    { url: settings?.youtube_url, Icon: Youtube, label: "YouTube" },
  ].filter((s) => (s.url ?? "").trim());

  return (
    <footer className="mt-20 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-8 border-b border-sidebar-border pb-12 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-4xl leading-[0.95] md:text-6xl">
            Vamos marcar a sua
            <br />
            <span className="text-accent">próxima aventura?</span>
          </h2>
          <a
            href={whatsappLink(settings, { tripName: "Contato geral", general: true })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill shrink-0"
          >
            <MessageCircle className="h-5 w-5" /> Agendar no WhatsApp
          </a>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center">
              <img
                src="/assets/casa-de-aventura-logo-horizontal.svg"
                alt="A Casa de Aventura Outdoors"
                className="h-14 w-auto max-w-[260px] object-contain"
              />
            </div>
            <p className="mt-5 text-sm text-sidebar-foreground/70">
              {settings?.footer_text?.trim() ||
                "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil."}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sidebar-border text-sidebar-foreground/80 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-sidebar-foreground/60">Navegue</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center gap-1 text-sidebar-foreground/85 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-sidebar-foreground/60">Contato</h3>
            <ul className="mt-5 space-y-3 text-sm text-sidebar-foreground/85">
              <li>
                <a href={phoneHref(settings)} className="flex items-center gap-2 hover:text-accent">
                  <Phone className="h-4 w-4 text-accent" /> {formatPhone(settings)}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(settings, { tripName: "Contato geral", general: true })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
                </a>
              </li>
              {settings?.contact_email?.trim() && (
                <li>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="flex items-center gap-2 hover:text-accent"
                  >
                    <Mail className="h-4 w-4 text-accent" /> {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.address?.trim() && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {settings.address}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-sidebar-foreground/60">Certificações</h3>
            {certificates.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {certificates.slice(0, 6).map((c) =>
                  c.image_url ? (
                    <img
                      key={c.id}
                      src={normalizeImage(c.image_url)}
                      alt={c.title}
                      title={c.title}
                      className="h-14 w-14 rounded-xl bg-card object-contain p-1.5"
                    />
                  ) : (
                    <span
                      key={c.id}
                      className="rounded-full border border-sidebar-border px-3 py-1 text-xs text-sidebar-foreground/80"
                    >
                      {c.title}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-5 text-sm text-sidebar-foreground/70">
                Guias credenciados e operação com seguro aventura.
              </p>
            )}
            <Link
              to="/quem-somos"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Conheça nossa história <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/60">
          © {new Date().getFullYear()} A Casa de Aventura — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
