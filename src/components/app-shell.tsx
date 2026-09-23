import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Phone, User, X, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { WhatsAppFab } from "./whatsapp-fab";
import { SiteFooter } from "./site-footer";
import { formatPhone, phoneHref, whatsappLink } from "@/data/trips";
import { settingsQuery } from "@/lib/api";

const nav = [
  { to: "/", label: "Início" },
  { to: "/viagens", label: "Viagens" },
  { to: "/calendario", label: "Calendário" },
  { to: "/blog", label: "Blog" },
  { to: "/comentarios", label: "Comentários" },
  { to: "/quem-somos", label: "Quem somos" },
  { to: "/favoritos", label: "Salvas" },
  { to: "/conta", label: "Minha conta" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-4 md:px-8">
          <Link to="/" className="flex min-w-0 shrink-0 items-center">
            <img
              src="/assets/casa-de-aventura-logo-horizontal-transparente.svg"
              alt="A Casa de Aventura Outdoors"
              className="h-10 w-auto max-w-[190px] object-contain sm:h-11 sm:max-w-[240px] md:h-12 md:max-w-none"
            />
          </Link>

          <nav className="mx-auto hidden items-center gap-1 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors ${
                  isActive(item.to) ? "font-bold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.to) && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a href={phoneHref(settings)} className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-foreground transition-colors hover:text-accent md:inline-flex">
              <Phone className="h-4 w-4 text-accent" />
              <span className="hidden whitespace-nowrap 2xl:inline">{formatPhone(settings)}</span>
            </a>
            <ThemeToggle />
            <a
              href={whatsappLink(settings, { tripName: "Contato geral", general: true })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill hidden whitespace-nowrap !px-5 !py-2.5 !text-sm sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4" /> Fale com a gente
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden border-border transition-all duration-300 xl:hidden ${mobileOpen ? "max-h-[650px] border-t" : "max-h-0"}`}>
          <nav className="mx-auto grid max-w-[1400px] gap-1 px-3 py-3 sm:grid-cols-2 sm:px-4 md:px-8">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive(item.to) ? "bg-secondary font-bold text-foreground" : "font-medium text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/auth" search={{ next: "/conta" }} className="btn-pill-outline mt-2 sm:col-span-2">
              <User className="h-4 w-4" /> Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="min-w-0 flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
