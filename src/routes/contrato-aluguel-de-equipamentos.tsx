import { createFileRoute } from "@tanstack/react-router";
import { Backpack } from "lucide-react";

export const Route = createFileRoute("/contrato-aluguel-de-equipamentos")({
  head: () => ({
    meta: [
      { title: "Contrato de Aluguel de Equipamentos — A Casa de Aventura" },
      {
        name: "description",
        content: "Informações sobre o contrato de aluguel de equipamentos da A Casa de Aventura.",
      },
    ],
  }),
  component: RentalContract,
});

function RentalContract() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-12 md:px-8 md:py-16">
      <header className="card-surface p-6 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Backpack className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Locação</p>
            <h1 className="mt-1 text-3xl md:text-5xl">Contrato de Aluguel de Equipamentos</h1>
            <p className="mt-3 text-sm text-muted-foreground">Itens e acessórios de viagem</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-6 text-sm leading-7 text-muted-foreground md:p-10 md:text-base">
        <h2>Sobre a locação</h2>
        <p>
          Esta área apresenta as informações relacionadas à locação de equipamentos e acessórios de
          viagem disponibilizados pela A Casa de Aventura.
        </p>

        <h2>Condições da contratação</h2>
        <p>
          A locação deve ser confirmada de acordo com a disponibilidade dos itens, período contratado,
          valores, condições de retirada e devolução e demais regras informadas pela equipe no momento
          da contratação.
        </p>

        <h2>Responsabilidade pelos equipamentos</h2>
        <p>
          O cliente deve utilizar os equipamentos de maneira adequada e devolvê-los nas condições
          acordadas. Eventuais avarias, perdas ou divergências serão analisadas conforme as condições
          da contratação e do instrumento aplicável à locação.
        </p>

        <h2>Atendimento</h2>
        <p>
          Antes de retirar um equipamento, confirme com a equipe as condições específicas da reserva,
          o período de utilização, valores e procedimentos de devolução.
        </p>
      </article>
    </main>
  );
}
