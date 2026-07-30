import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Compass,
  Home,
  Heart,
  LayoutDashboard,
  Menu,
  Mountain,
  PanelLeftClose,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: Compass },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/conta", label: "Minha conta", icon: User },
  { to: "/admin", label: "Administração", icon: LayoutDashboard },
] as const;

/** Layout base: menu lateral recolhível + cabeçalho fixo. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-3">
      <Link
        to="/"
        onClick={() => setMobileOpen(false)}
        className="mb-4 flex items-center gap-2 px-2 py-2"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Mountain className="h-5 w-5" />
        </span>
        {!collapsed && (
          <span className="font-display text-lg font-bold uppercase leading-none tracking-wide text-sidebar-foreground">
            Casa de
            <br />
            Aventura
          </span>
        )}
      </Link>

      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          title={item.label}
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.to)
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          }`}
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="mt-auto hidden items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground lg:flex"
      >
        <PanelLeftClose
          className={`h-4.5 w-4.5 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
        />
        {!collapsed && <span>Recolher menu</span>}
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:block ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {sidebar}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <label className="relative hidden max-w-md flex-1 items-center sm:flex">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar equipamentos..."
              className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/conta"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
            <button
              type="button"
              aria-label="Carrinho"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                2
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p className="font-display text-base font-bold uppercase text-foreground">
            Casa de Aventura
          </p>
          <p className="mt-1">Equipamentos para trilha, camping e escalada. © 2026</p>
        </footer>
      </div>
    </div>
  );
}
