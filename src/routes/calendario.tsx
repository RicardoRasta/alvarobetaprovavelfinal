import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CalendarDays, ChevronLeft, ChevronRight, MapPin, MessageCircle,
  ArrowRight, Clock3, Compass, CalendarCheck2, ListFilter, RotateCcw,
} from "lucide-react";
import { formatRange, tripImage, whatsappLink } from "@/data/trips";
import { settingsQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Agenda de saídas — A Casa de Aventura" },
      {
        name: "description",
        content: "Explore as próximas viagens e cursos da Casa de Aventura por data, destino e disponibilidade.",
      },
      { property: "og:title", content: "Agenda de saídas — A Casa de Aventura" },
      { property: "og:description", content: "Encontre sua próxima aventura no calendário da Casa de Aventura." },
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

type Dep = {
  id: string;
  tripId: string;
  tripSlug: string;
  tripName: string;
  destination: string;
  state: string;
  date: string;
  return_date: string | null;
  spots: number;
  meeting_point: string | null;
  image: string;
};

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function Calendario() {
  const { data: trips = [], isLoading, isError } = useQuery(tripsQuery);
  const { data: settings } = useQuery(settingsQuery);
  const today = new Date();
  const todayISO = isoDate(today);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<string>(todayISO);

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
          image: tripImage(t),
        });
        map.set(d.date, list);
      }
    }
    for (const list of map.values()) list.sort((a, b) => a.tripName.localeCompare(b.tripName, "pt-BR"));
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
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const next = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  const goToday = () => {
    setCursor({ y: today.getFullYear(), m: today.getMonth() });
    setSelected(todayISO);
  };

  const selectedDeps = selected ? byDate.get(selected) ?? [] : [];
  const monthEvents = useMemo(() => {
    const prefix = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-`;
    return [...byDate.entries()]
      .filter(([date, deps]) => date.startsWith(prefix) && deps.length > 0)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [byDate, cursor]);
  const monthDepartureCount = monthEvents.reduce((sum, [, deps]) => sum + deps.length, 0);
  const upcoming = [...byDate.entries()]
    .filter(([date, deps]) => date >= todayISO && deps.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 3);
  const selectedLabel = selected
    ? new Date(`${selected}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : "Escolha uma data";

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-6 md:px-6 md:py-10">
      <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-[#244936] px-5 py-7 text-white shadow-xl sm:px-8 sm:py-9 lg:px-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-28 right-36 h-56 w-56 rounded-full bg-[#C6A36A]/15 blur-2xl" />
        <div className="relative z-10 grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#E8D7B7]">
              <Compass className="h-4 w-4" /> Sua próxima experiência começa aqui
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Agenda de aventuras</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Descubra as próximas saídas, explore os destinos e escolha a data da experiência que combina com você.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:min-w-[270px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <CalendarCheck2 className="mb-3 h-5 w-5 text-[#E8D7B7]" />
              <div className="text-2xl font-extrabold tabular-nums">{monthDepartureCount}</div>
              <div className="mt-1 text-xs text-white/65">saídas neste mês</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <MapPin className="mb-3 h-5 w-5 text-[#E8D7B7]" />
              <div className="text-2xl font-extrabold tabular-nums">{upcoming.length}</div>
              <div className="mt-1 text-xs text-white/65">próximas datas</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <section className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">{MONTHS[cursor.m]} {cursor.y}</h2>
                <p className="text-xs text-muted-foreground">{monthEvents.length} dia(s) com programação</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={goToday} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-bold transition hover:border-accent hover:text-accent">
                <RotateCcw className="h-3.5 w-3.5" /> Hoje
              </button>
              <button type="button" onClick={prev} aria-label="Mês anterior" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border transition hover:border-accent hover:text-accent">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={next} aria-label="Próximo mês" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border transition hover:border-accent hover:text-accent">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-5">
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground sm:text-xs">{w}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {cells.map((iso, i) => {
                if (!iso) return <div key={`blank-${cursor.y}-${cursor.m}-${i}`} className="aspect-square" />;
                const day = Number(iso.slice(8));
                const deps = byDate.get(iso) ?? [];
                const has = deps.length > 0;
                const isToday = iso === todayISO;
                const isSel = iso === selected;
                return (
                  <button
                    type="button"
                    key={iso}
                    onClick={() => setSelected(iso)}
                    aria-pressed={isSel}
                    aria-label={`${day} de ${MONTHS[cursor.m]}, ${has ? `${deps.length} saída(s)` : "sem saídas"}`}
                    className={`group relative flex aspect-square min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border text-sm transition-all duration-200 sm:rounded-2xl ${isSel
                      ? "border-accent bg-accent text-accent-foreground shadow-lg ring-2 ring-accent/25"
                      : has
                        ? "border-accent/30 bg-accent/[0.06] font-bold text-foreground hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                        : "border-transparent bg-muted/45 text-muted-foreground hover:border-border hover:bg-muted"}`}
                  >
                    <span className={`text-sm sm:text-base ${isToday && !isSel ? "flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 font-extrabold text-accent" : "font-semibold"}`}>{day}</span>
                    {has && (
                      <span className={`mt-1 flex items-center gap-1 text-[9px] font-extrabold sm:text-[10px] ${isSel ? "text-accent-foreground/90" : "text-accent"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isSel ? "bg-current" : "bg-accent"}`} />
                        <span className="hidden sm:inline">{deps.length} {deps.length === 1 ? "saída" : "saídas"}</span>
                        <span className="sm:hidden">{deps.length}</span>
                      </span>
                    )}
                    {isToday && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSel ? "bg-accent-foreground" : "bg-accent"}`} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> Dia com saída</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border border-border bg-muted" /> Sem programação</span>
              <span className="inline-flex items-center gap-2"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">•</span> Hoje</span>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2 text-accent"><ListFilter className="h-4 w-4" /><span className="text-xs font-extrabold uppercase tracking-[0.16em]">Programação</span></div>
              <h2 className="mt-2 text-lg font-extrabold capitalize">{selectedLabel}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{selectedDeps.length ? `${selectedDeps.length} experiência(s) nesta data` : "Escolha outro dia para explorar as saídas."}</p>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-4">
                {[1, 2].map((n) => <div key={n} className="h-28 animate-pulse rounded-2xl bg-muted" />)}
              </div>
            ) : isError ? (
              <div className="p-5 text-sm text-muted-foreground">Não foi possível carregar a agenda agora. Atualize a página para tentar novamente.</div>
            ) : selectedDeps.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><CalendarDays className="h-6 w-6" /></div>
                <h3 className="mt-4 font-bold">Dia livre para planejar</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  Não há saídas cadastradas para esta data. Selecione um dia marcado no calendário para ver os detalhes.
                </p>
              </div>
            ) : (
              <ul className="space-y-3 p-3 sm:p-4">
                {selectedDeps.map((d) => (
                  <li key={d.id} className="overflow-hidden rounded-2xl border border-border bg-background transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <Link to="/viagens/$tripId" params={{ tripId: d.tripSlug }} className="group block">
                      <div className="relative h-32 overflow-hidden bg-muted">
                        <img src={d.image} alt={d.tripName} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                        <span className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-extrabold leading-snug text-white">{d.tripName}</span>
                      </div>
                      <div className="space-y-2 p-3">
                        <p className="flex items-start gap-2 text-xs text-muted-foreground"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /><span>{d.destination}{d.state ? ` · ${d.state}` : ""}</span></p>
                        <p className="flex items-start gap-2 text-xs text-muted-foreground"><Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /><span>{formatRange(d.date, d.return_date)}{typeof d.spots === "number" ? ` · ${d.spots} vagas` : ""}</span></p>
                        {d.meeting_point && <p className="text-xs leading-5 text-muted-foreground">Ponto de saída: {d.meeting_point}</p>}
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent">Ver roteiro <ArrowRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </Link>
                    <div className="px-3 pb-3">
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
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#237A4B] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#1B633C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237A4B] focus-visible:ring-offset-2"
                      >
                        <MessageCircle className="h-4 w-4" /> Consultar esta saída no WhatsApp
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-border bg-muted/35 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">Inspire-se</p>
                <h3 className="mt-1 font-extrabold">Próximas datas</h3>
              </div>
              <CalendarDays className="h-5 w-5 text-accent" />
            </div>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">As próximas datas serão exibidas aqui assim que forem cadastradas.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {upcoming.map(([date, deps]) => (
                  <li key={date}>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(`${date}T12:00:00`);
                        setCursor({ y: d.getFullYear(), m: d.getMonth() });
                        setSelected(date);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-card p-3 text-left transition hover:border-accent/50 hover:shadow-sm"
                    >
                      <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <span className="text-[9px] font-extrabold uppercase">{new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
                        <span className="text-lg font-extrabold leading-none">{date.slice(8, 10)}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-foreground">{deps[0].tripName}</span>
                        <span className="mt-1 block truncate text-[11px] text-muted-foreground">{deps.length > 1 ? `+ ${deps.length - 1} saída(s) nesta data` : deps[0].destination}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
