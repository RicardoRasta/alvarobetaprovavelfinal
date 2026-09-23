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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Informações importantes
            </p>
            <h1 className="mt-1 text-3xl md:text-5xl">Política de Cancelamentos</h1>
            <p className="mt-3 text-sm text-muted-foreground">A Casa de Aventura</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-6 text-sm leading-7 text-muted-foreground md:p-10 md:text-base">
        <h2>Para cancelamento de Cursos, Passeios e Aluguéis:</h2>
        <p>
          Em caso de cancelamento por iniciativa do cliente, de acordo com as normas da EMBRATUR, a devolução será feita nas seguintes condições:
        </p>
        <ul>
          <li>
            <strong>Antes de 30 dias:</strong> Devolução integral*
          </li>
          <li>
            <strong>Até 30 dias do início do passeio:</strong> 90% do valor*
          </li>
          <li>
            <strong>Entre 29 e 21 dias do início do passeio:</strong> 80% do valor*
          </li>
          <li>
            <strong>Entre 20 e 7 dias do início do passeio:</strong> 50% do valor*
          </li>
          <li>
            <strong>Menos de 7 dias do início do passeio:</strong> Sem devolução
          </li>
        </ul>
        <p>
          *Poderão haver abatimentos do valor dependendo da forma de pagamento.
        </p>
      </article>
    </main>
  );
}
