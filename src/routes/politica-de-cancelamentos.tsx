import { createFileRoute } from "@tanstack/react-router";
import { CircleX } from "lucide-react";

export const Route = createFileRoute("/politica-de-cancelamentos")({
  head: () => ({
    meta: [
      { title: "Política de Cancelamentos — A Casa de Aventura" },
      {
        name: "description",
        content: "Política de cancelamentos da A Casa de Aventura.",
      },
    ],
  }),
  component: CancellationPolicy,
});

function CancellationPolicy() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-12 md:px-8 md:py-16">
      <header className="card-surface p-6 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <CircleX className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Informações importantes</p>
            <h1 className="mt-1 text-3xl md:text-5xl">Política de Cancelamentos</h1>
            <p className="mt-3 text-sm text-muted-foreground">A Casa de Aventura</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-6 text-sm leading-7 text-muted-foreground md:p-10 md:text-base">
        <h2>1. Antes de solicitar um cancelamento</h2>
        <p>
          Cada roteiro pode possuir condições específicas de participação, pagamento, alteração e
          cancelamento. Por isso, o participante deve verificar as condições apresentadas no roteiro
          contratado e nas informações enviadas no momento da confirmação da atividade.
        </p>

        <h2>2. Solicitação</h2>
        <p>
          A solicitação de cancelamento deve ser realizada pelos canais oficiais da A Casa de Aventura,
          informando o nome do participante, a atividade, a data prevista e os dados necessários para
          localizar a contratação.
        </p>

        <h2>3. Análise das condições</h2>
        <p>
          Após o recebimento da solicitação, a equipe verificará a atividade contratada, a antecedência
          do pedido, valores já pagos, custos eventualmente assumidos para a operação e as condições
          específicas apresentadas para aquele roteiro.
        </p>

        <h2>4. Alterações de atividade ou data</h2>
        <p>
          Quando houver possibilidade operacional, alterações de data ou de atividade poderão ser
          analisadas individualmente. A confirmação depende da disponibilidade e das condições do
          roteiro correspondente.
        </p>

        <h2>5. Regras específicas</h2>
        <p>
          Quando uma viagem, curso ou experiência possuir regras próprias de cancelamento, essas
          condições específicas prevalecem para a respectiva contratação, sem prejuízo dos direitos
          assegurados pela legislação aplicável.
        </p>

        <h2>6. Atendimento</h2>
        <p>
          Em caso de dúvida antes de confirmar uma atividade, utilize o WhatsApp ou telefone disponíveis
          no site para esclarecer as condições do roteiro.
        </p>
      </article>
    </main>
  );
}
