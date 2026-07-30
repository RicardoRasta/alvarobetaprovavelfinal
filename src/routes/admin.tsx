import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
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
import { formatPrice, products } from "@/data/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Casa de Aventura" },
      {
        name: "description",
        content: "Dashboard de vendas, estoque, clientes e pedidos da loja Casa de Aventura.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo — Casa de Aventura" },
      { property: "og:description", content: "Gestão completa da loja em um só lugar." },
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
  { dia: "Seg", vendas: 18 },
  { dia: "Ter", vendas: 24 },
  { dia: "Qua", vendas: 31 },
  { dia: "Qui", vendas: 22 },
  { dia: "Sex", vendas: 45 },
  { dia: "Sáb", vendas: 52 },
  { dia: "Dom", vendas: 29 },
];

const recentOrders = [
  { id: "#10456", cliente: "Marina Lopes", total: 1299.9, status: "Pago" },
  { id: "#10455", cliente: "Rafael Duarte", total: 749.9, status: "Separando" },
  { id: "#10454", cliente: "Camila Reis", total: 2148.0, status: "Enviado" },
  { id: "#10453", cliente: "João Meireles", total: 469.9, status: "Entregue" },
  { id: "#10452", cliente: "Ana Prado", total: 1189.0, status: "Cancelado" },
];

function Admin() {
  const semEstoque = products.filter((p) => p.stock === 0).length;

  const cards = [
    { icon: DollarSign, label: "Vendas do mês", value: formatPrice(68900) },
    { icon: Users, label: "Clientes cadastrados", value: "1.842" },
    { icon: Package, label: "Produtos cadastrados", value: String(products.length) },
    { icon: AlertTriangle, label: "Produtos sem estoque", value: String(semEstoque) },
  ];

  return (
    <div className="mx-auto max-w-7xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header>
        <h1 className="text-3xl font-bold uppercase md:text-4xl">Painel administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral de vendas, estoque e pedidos da loja.
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
          <h2 className="text-lg font-bold uppercase">Vendas por dia</h2>
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
                <Bar dataKey="vendas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card-surface mt-6 overflow-hidden">
        <h2 className="border-b border-border px-5 py-4 text-lg font-bold uppercase">
          Pedidos recentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-2">Pedido</th>
                <th className="px-5 py-2">Cliente</th>
                <th className="px-5 py-2">Total</th>
                <th className="px-5 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{o.id}</td>
                  <td className="px-5 py-3">{o.cliente}</td>
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
          Estoque de produtos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-2">Produto</th>
                <th className="px-5 py-2">Marca</th>
                <th className="px-5 py-2">Preço</th>
                <th className="px-5 py-2">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-5 py-3">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.stock === 0
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {p.stock === 0 ? "Esgotado" : `${p.stock} un.`}
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
