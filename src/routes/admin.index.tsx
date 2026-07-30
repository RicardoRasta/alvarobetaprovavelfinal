import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, MapPinned, MessageCircle, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/data/trips";
import { bookingsQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: bookings = [] } = useQuery(bookingsQuery);

  const today = new Date().toISOString().slice(0, 10);
  const departures = trips
    .flatMap((t) => (t.departures ?? []).map((d) => ({ trip: t, ...d })))
    .filter((d) => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const openSpots = departures.reduce((sum, d) => sum + d.spots, 0);
  const people = bookings.reduce((sum, b) => sum + (b.people ?? 0), 0);

  const cards = [
    { icon: MapPinned, label: "Roteiros ativos", value: String(trips.filter((t) => t.published).length) },
    { icon: CalendarCheck, label: "Vagas abertas", value: String(openSpots) },
    { icon: MessageCircle, label: "Pedidos de reserva", value: String(bookings.length) },
    { icon: Users, label: "Aventureiros interessados", value: String(people) },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </section>

      <section className="card-surface overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-lg font-bold uppercase">
          Próximas saídas
        </h2>
        {departures.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nenhuma saída futura cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-2">Roteiro</th>
                  <th className="px-5 py-2">Destino</th>
                  <th className="px-5 py-2">Data</th>
                  <th className="px-5 py-2">Preço</th>
                  <th className="px-5 py-2">Vagas</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{d.trip.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {d.trip.destination} · {d.trip.state}
                    </td>
                    <td className="px-5 py-3">{formatDate(d.date)}</td>
                    <td className="px-5 py-3">{formatPrice(d.trip.price)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          d.spots <= 4
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {d.spots} vagas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
