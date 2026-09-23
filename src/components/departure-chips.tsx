import { CalendarDays, Footprints } from "lucide-react";
import type { Departure, Trip } from "@/data/trips";

/** "outubro 2026" a partir de uma data ISO. */
export const monthLabel = (iso: string) =>
  new Date(iso.includes("T") ? iso : `${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

/** Meses únicos das próximas saídas da viagem. */
export function upcomingMonths(trip: Pick<Trip, "departures">, limit = 4): string[] {
  const today = new Date().toISOString().slice(0, 10);
  const months: string[] = [];
  for (const d of [...((trip.departures ?? []) as Departure[])].sort((a, b) =>
    a.date.localeCompare(b.date),
  )) {
    if (d.date < today) continue;
    const label = monthLabel(d.date);
    if (!months.includes(label)) months.push(label);
    if (months.length >= limit) break;
  }
  return months;
}

/** Linha "Próximas saídas" + "Locais" com chips, sobre imagem (glass) ou em fundo claro. */
export function DepartureChips({
  months,
  places,
  glass = false,
}: {
  months: string[];
  places: string[];
  glass?: boolean;
}) {
  const chip = glass ? "chip-glass" : "chip";
  const label = glass
    ? "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white"
    : "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white";

  if (months.length === 0 && places.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {months.length > 0 && (
        <div>
          <p className={label}>
            <CalendarDays className="h-4 w-4" /> Próximas saídas
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {months.map((m) => (
              <span key={m} className={`${chip} capitalize`}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
      {places.length > 0 && (
        <div>
          <p className={label}>
            <Footprints className="h-4 w-4" /> Locais
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {places.map((p) => (
              <span key={p} className={chip}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
