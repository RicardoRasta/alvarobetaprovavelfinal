import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, DollarSign, MapPinned, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, formatPrice, trips } from "@/data/trips";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — A Casa de Aventura" },
      {
        name: "description",
        content: "Dashboard de reservas, roteiros, vagas e clientes da agência A Casa de Aventura.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo — A Casa de Aventura" },
      { property: "og:description", content: "Gestão completa da agência em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const salesData = [
  { mes: "Jan", receita: 42000 },
  { mes: "Fev", receita: 38500 },
  { mes: "Mar", receita: 51200 },
  { mes: "Abr", receita: 47800 },
  { mes: "Mai", receita: 61300 },
  { mes: "Jun", receita: 72400 },
  { mes: "Jul", receita: 68900 },
];

const dailyData = [
  { dia: "Seg", reservas: 4 },
  { dia: "Ter", reservas: 7 },
  { dia: "Qua", reservas: 9 },
  { dia: "Qui", reservas: 5 },
  { dia: "Sex", reservas: 12 },
  { dia: "Sáb", reservas: 15 },
  { dia: "Dom", reservas: 8 },
];

const recentBookings = [
  { id: "#RV-1456", cliente: "Marina Lopes", roteiro: "Vale do Pati", total: 5580, status: "Confirmada" },
  { id: "#RV-1455", cliente: "Rafael Duarte", roteiro: "Canoagem em Bonito", total: 1890, status: "Aguardando pagamento" },
  { id: "#RV-1454", cliente: "Camila Reis", roteiro: "Lençóis Maranhenses", total: 6780, status: "Confirmada" },
  { id: "#RV-1453", cliente: "João Meireles", roteiro: "Rafting em Brotas", total: 1380, status: "Em análise" },
  { id: "#RV-1452", cliente: "Ana Prado", roteiro: "Escalada Pedra Azul", total: 1450, status: "Cancelada" },
];

function Admin() {
  const allDepartures = trips.flatMap((t) => t.departures.map((d) => ({ trip: t, ...d })));
  const vagasAbertas = allDepartures.reduce((sum, d) => sum + d.spots, 0);

  const cards = [
    { icon: DollarSign, label: "Receita do mês", value: formatPrice(68900) },
    { icon: Users, label: "Clientes cadastrados", value: "1.842" },
    { icon: MapPinned, label: "Roteiros ativos", value: String(trips.length) },
    { icon: CalendarCheck, label: "Vagas abertas", value: String(vagasAbertas) },
  ];

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header>
        <h1 className="text-3xl font-bold uppercase md:text-4xl">Painel administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral de reservas, roteiros e saídas da agência.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="card-surface p-5">
          <h2 className="text-lg font-bold uppercase">Receita mensal</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={50} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-card-foreground)",
                  }}
                  formatter={(v: number) => formatPrice(v)}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-bold uppercase">Reservas por dia</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={30} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Bar dataKey="reservas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card-surface mt-6 overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-lg font-bold uppercase">
          Reservas recentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-2">Reserva</th>
                <th className="px-5 py-2">Cliente</th>
                <th className="px-5 py-2">Roteiro</th>
                <th className="px-5 py-2">Total</th>
                <th className="px-5 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{o.id}</td>
                  <td className="px-5 py-3">{o.cliente}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.roteiro}</td>
                  <td className="px-5 py-3">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-surface mt-6 overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-lg font-bold uppercase">
          Saídas programadas
        </h2>
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
              {allDepartures
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((d) => (
                  <tr key={`${d.trip.id}-${d.date}`} className="border-t border-border">
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
      </section>
    </div>
  );
}
