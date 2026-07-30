import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Tag, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { ProductCard } from "@/components/product-card";
import { categories, products, quickStats } from "@/data/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casa de Aventura — Equipamentos para trilha e camping" },
      {
        name: "description",
        content:
          "Barracas, mochilas cargueiras, botas de trekking e vestuário técnico com envio para todo o Brasil.",
      },
      { property: "og:title", content: "Casa de Aventura — Equipamentos outdoor" },
      {
        property: "og:description",
        content: "A loja completa para quem vive de trilha, camping e escalada.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.filter((p) => p.featured);
  const promos = products.filter((p) => p.oldPrice != null);

  return (
    <div className="animate-fade-up">
      {/* Banner principal */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Aventureiro no alto de uma montanha ao amanhecer"
          width={1920}
          height={1080}
          className="h-[380px] w-full object-cover md:h-[460px]"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-xl text-primary-foreground">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              Nova coleção de inverno
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
              Equipe-se para a próxima aventura
            </h1>
            <p className="mt-4 max-w-md text-sm opacity-90 md:text-base">
              Barracas, mochilas, calçados e vestuário técnico testados em campo por quem entende
              de montanha.
            </p>
            <Link
              to="/catalogo"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:translate-x-1"
            >
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 md:px-6 md:py-14">
        {/* Estatísticas rápidas */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {quickStats.map((s) => (
            <div key={s.label} className="card-surface p-4 md:p-5">
              <p className="font-display text-2xl font-bold text-accent md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Categorias */}
        <section>
          <header className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase md:text-3xl">Categorias</h2>
            <Link to="/catalogo" className="text-sm font-medium text-accent hover:underline">
              Ver tudo
            </Link>
          </header>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/catalogo"
                search={{ categoria: c.id }}
                className="card-surface hover-lift p-4"
              >
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Produtos em destaque */}
        <section>
          <h2 className="mb-5 text-2xl font-bold uppercase md:text-3xl">Produtos em destaque</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Promoções */}
        <section className="card-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold uppercase">
              <Tag className="h-5 w-5 text-accent" /> Promoções da semana
            </h2>
            <p className="text-sm text-muted-foreground">Ofertas válidas enquanto durar o estoque</p>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Benefícios */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: "Frete grátis acima de R$ 399", text: "Para todo o Brasil." },
            { icon: ShieldCheck, title: "Compra segura", text: "Pagamento criptografado." },
            { icon: Tag, title: "Garantia estendida", text: "12 meses em todos os itens." },
          ].map((b) => (
            <div key={b.title} className="card-surface flex items-start gap-3 p-5">
              <b.icon className="h-6 w-6 shrink-0 text-accent" />
              <div>
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
