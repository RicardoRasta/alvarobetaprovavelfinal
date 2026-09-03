import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, MessageCircle } from "lucide-react";
import { formatRange, whatsappLink } from "@/data/trips";
import { settingsQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário de saídas — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Calendário mensal com todas as saídas dos roteiros de aventura da Casa de Aventura. Clique no dia para ver os detalhes.",
      },
      { property: "og:title", content: "Calendário de saídas — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Veja todas as datas de saídas dos roteiros de aventura em um calendário mensal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Calendario,
});

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type Dep = { id: string; tripId: string; tripSlug: string; tripName: string; destination: string; state: string; date: string; return_date: string | null; spots: number; meeting_point: string | null };

function Calendario() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: settings } = useQuery(settingsQuery);
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);

  // Indexa todas as saídas dos roteiros publicados por data (yyyy-mm-dd).
  const byDate = useMemo(() => {
    const map = new Map<string, Dep[]>();
    for (const t of trips) {
      if (!t.published) continue;
      for (const d of t.departures ?? []) {
        const list = map.get(d.date) ?? [];
        list.push({
          id: d.id,
          tripId: t.id,
          tripSlug: t.slug,
          tripName: t.name,
          destination: t.destination,
          state: t.state,
          date: d.date,
          return_date: d.return_date ?? null,
          spots: d.spots,
          meeting_point: d.meeting_point ?? null,
        });
        map.set(d.date, list);
      }
    }
    return map;
  }, [trips]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  const todayISO = today.toISOString().slice(0, 10);

  const prev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const next = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));

  const selectedDeps = selected ? byDate.get(selected) ?? [] : [];

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="mb-6 flex items-center gap-3">
        <CalendarDays className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-4xl leading-[0.95] md:text-5xl">Calendário</h1>
          <p className="mt-1 text-sm text-muted-foreground">Todas as saídas dos roteiros em um só lugar.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase">
              {MONTHS[cursor.m]} {cursor.y}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prev}
                aria-label="Mês anterior"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próximo mês"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-2 text-xs font-semibold uppercase text-muted-foreground">
                {w}
              </div>
            ))}
            {cells.map((iso, i) => {
              if (!iso) return <div key={`b${i}`} />;
              const day = Number(iso.slice(8));
              const deps = byDate.get(iso);
              const has = deps && deps.length > 0;
              const isToday = iso === todayISO;
              const isSel = iso === selected;
              return (
                <button
                  type="button"
                  key={iso}
                  onClick={() => setSelected(isSel ? null : iso)}
                  className={`relative aspect-square rounded-xl border text-sm transition-colors ${
                    isSel
                      ? "border-accent bg-accent text-accent-foreground"
                      : has
                        ? "border-accent/40 bg-accent/10 text-foreground hover:border-accent"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  <span className={isToday && !isSel ? "font-bold text-accent" : ""}>{day}</span>
                  {has && (
                    <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <aside className="card-surface p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">
            {selected
              ? new Date(`${selected}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
              : "Selecione um dia"}
          </h2>
          {selectedDeps.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {selected ? "Nenhuma saída cadastrada para esta data." : "Clique em um dia marcado para ver os roteiros."}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {selectedDeps.map((d) => (
                <li key={d.id} className="rounded-xl border border-border bg-card p-3">
                  <Link
                    to="/viagens/$tripId"
                    params={{ tripId: d.tripSlug }}
                    className="font-semibold transition-colors hover:text-accent"
                  >
                    {d.tripName}
                  </Link>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {d.destination} · {d.state}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRange(d.date, d.return_date)} · {d.spots} vagas
                    {d.meeting_point ? ` · Saída: ${d.meeting_point}` : ""}
                  </p>
                  <a
                    href={whatsappLink(settings, {
                      tripName: d.tripName,
                      date: d.date,
                      returnDate: d.return_date,
                      destination: d.destination,
                      state: d.state,
                      slug: d.tripSlug,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-accent px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Agendar
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
