import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Mountain, Phone, Youtube } from "lucide-react";
import { formatPhone, phoneHref, whatsappLink } from "@/data/trips";
import { certificatesQuery, settingsQuery } from "@/lib/api";
import { normalizeImage } from "@/data/trips";

const links = [
  { to: "/viagens", label: "Roteiros" },
  { to: "/calendario", label: "Calendário" },
  { to: "/blog", label: "Blog" },
  { to: "/comentarios", label: "Comentários" },
  { to: "/quem-somos", label: "Quem somos" },
] as const;

/** Rodapé completo com contato, links, redes sociais e selos. */
export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: certificates = [] } = useQuery(certificatesQuery);
  const socials = [
    { url: settings?.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: settings?.facebook_url, Icon: Facebook, label: "Facebook" },
    { url: settings?.youtube_url, Icon: Youtube, label: "YouTube" },
  ].filter((s) => (s.url ?? "").trim());

  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Mountain className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold uppercase leading-none">
              A Casa de
              <br />
              Aventura
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {settings?.footer_text?.trim() ||
              "Agência de viagens de aventura: canoagem, escalada, trekking e expedições guiadas por todo o Brasil."}
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide">Navegue</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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
                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-accent">
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
          <h3 className="font-display text-sm font-bold uppercase tracking-wide">Certificações</h3>
          {certificates.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {certificates.slice(0, 6).map((c) =>
                c.image_url ? (
                  <img
                    key={c.id}
                    src={normalizeImage(c.image_url)}
                    alt={c.title}
                    title={c.title}
                    className="h-14 w-14 rounded-md border border-border bg-card object-contain p-1"
                  />
                ) : (
                  <span
                    key={c.id}
                    className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
                  >
                    {c.title}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Guias credenciados e operação com seguro aventura.
            </p>
          )}
          <Link to="/quem-somos" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            Conheça nossa história
          </Link>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground md:px-6">
        © {new Date().getFullYear()} A Casa de Aventura — Todos os direitos reservados.
      </div>
    </footer>
  );
}
