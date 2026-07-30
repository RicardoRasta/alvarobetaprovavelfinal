import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, MapPin, Package, User } from "lucide-react";
import { formatPrice } from "@/data/store";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Casa de Aventura" },
      {
        name: "description",
        content: "Acesse sua conta para ver pedidos, endereços e favoritos na Casa de Aventura.",
      },
      { property: "og:title", content: "Minha conta — Casa de Aventura" },
      { property: "og:description", content: "Login, cadastro e histórico de pedidos." },
    ],
  }),
  component: Conta,
});

const orders = [
  { id: "#10432", date: "12/07/2026", total: 1848.9, status: "Entregue" },
  { id: "#10388", date: "28/06/2026", total: 549.0, status: "Em trânsito" },
  { id: "#10291", date: "03/06/2026", total: 469.9, status: "Cancelado" },
];

type Tab = "login" | "cadastro" | "recuperar";

function Conta() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold uppercase md:text-4xl">Área do cliente</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Entre na sua conta para acompanhar pedidos, endereços e favoritos.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="card-surface p-6">
          <div className="mb-5 flex gap-1 rounded-md bg-muted p-1">
            {(["login", "cadastro", "recuperar"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded px-2 py-1.5 text-sm font-medium capitalize transition-colors ${
                  tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {t === "recuperar" ? "Senha" : t}
              </button>
            ))}
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {tab === "cadastro" && <Field label="Nome completo" type="text" />}
            <Field label="E-mail" type="email" />
            {tab !== "recuperar" && <Field label="Senha" type="password" />}
            {tab === "cadastro" && <Field label="Confirmar senha" type="password" />}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {tab === "login" ? "Entrar" : tab === "cadastro" ? "Criar conta" : "Enviar link"}
            </button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Interface pronta — a autenticação real é ativada na próxima etapa.
          </p>
        </section>

        <div className="space-y-6">
          <section className="card-surface p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
              <User className="h-5 w-5 text-accent" /> Perfil
            </h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Nome", "Convidado"],
                ["E-mail", "—"],
                ["Telefone", "—"],
                ["Cliente desde", "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card-surface overflow-hidden">
            <h2 className="flex items-center gap-2 border-b border-border px-6 py-4 text-lg font-bold uppercase">
              <Package className="h-5 w-5 text-accent" /> Histórico de pedidos
            </h2>
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-2">Pedido</th>
                  <th className="px-6 py-2">Data</th>
                  <th className="px-6 py-2">Total</th>
                  <th className="px-6 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-6 py-3 font-medium">{o.id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{o.date}</td>
                    <td className="px-6 py-3">{formatPrice(o.total)}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="card-surface p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
                <MapPin className="h-5 w-5 text-accent" /> Endereços
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum endereço cadastrado ainda.
              </p>
            </section>
            <section className="card-surface p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
                <KeyRound className="h-5 w-5 text-accent" /> Alterar senha
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Disponível após o login na conta.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
