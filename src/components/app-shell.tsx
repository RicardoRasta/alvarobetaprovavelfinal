import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  Compass,
  Heart,
  Home,
  Images,
  Menu,
  MessageSquare,
  Mountain,
  Newspaper,
  Phone,
  User,
  X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { WhatsAppFab } from "./whatsapp-fab";
import { SiteFooter } from "./site-footer";
import { formatPhone, phoneHref } from "@/data/trips";
import { settingsQuery } from "@/lib/api";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/viagens", label: "Viagens", icon: Compass },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/blog", label: "Blog", icon: Newspaper },
  { to: "/comentarios", label: "Comentários", icon: MessageSquare },
  { to: "/quem-somos", label: "Quem somos", icon: Images },
  { to: "/favoritos", label: "Salvas", icon: Heart },
  { to: "/conta", label: "Minha conta", icon: User },
] as const;

/** Layout base: barra de navegação no topo + rodapé completo. */
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useQuery(settingsQuery);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Mountain className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-bold uppercase leading-none tracking-wide">
              A Casa de
              <br />
              Aventura
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={phoneHref(settings)}
              className="hidden h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">{formatPhone(settings)}</span>
            </a>
            <ThemeToggle />
            <Link
              to="/auth"
              search={{ next: "/conta" }}
              className="hidden h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Entrar</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border xl:hidden"
            >
              {mobileOpen ? <Menu className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background xl:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:grid-cols-2 md:px-6">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/auth"
                search={{ next: "/conta" }}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground sm:hidden"
              >
                <User className="h-4 w-4" /> Entrar
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _unused = X;
