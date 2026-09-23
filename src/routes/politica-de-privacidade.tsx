import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — A Casa de Aventura" },
      {
        name: "description",
        content: "Política de Privacidade da A Casa de Aventura.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-12 md:px-8 md:py-16">
      <header className="card-surface p-6 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Transparência</p>
            <h1 className="mt-1 text-3xl md:text-5xl">Política de Privacidade</h1>
            <p className="mt-3 text-sm text-muted-foreground">A Casa de Aventura</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-6 text-sm leading-7 text-muted-foreground md:p-10 md:text-base">
        <h2>1. Compromisso com a privacidade</h2>
        <p>
          A Casa de Aventura valoriza a privacidade e a segurança das informações de seus clientes,
          participantes e visitantes. Esta página explica, de forma objetiva, como os dados fornecidos
          durante a utilização do site e dos serviços podem ser utilizados para atendimento, comunicação,
          organização das atividades e cumprimento de obrigações legais.
        </p>

        <h2>2. Dados fornecidos pelo visitante</h2>
        <p>
          Podemos receber informações fornecidas voluntariamente pelo visitante, como nome, telefone,
          e-mail, dados necessários para uma reserva ou atendimento e informações enviadas em comentários,
          avaliações e solicitações de contato.
        </p>

        <h2>3. Finalidades</h2>
        <p>
          Os dados podem ser utilizados para responder solicitações, organizar inscrições e reservas,
          prestar suporte, enviar informações relacionadas a uma atividade contratada, melhorar a
          experiência no site e atender obrigações legais e regulatórias aplicáveis.
        </p>

        <h2>4. Compartilhamento e segurança</h2>
        <p>
          As informações devem ser tratadas apenas na medida necessária para as finalidades descritas,
          inclusive quando houver prestadores de serviços envolvidos na operação do site, pagamentos,
          comunicação ou execução das atividades. São adotadas medidas técnicas e administrativas
          compatíveis com a proteção das informações.
        </p>

        <h2>5. Cookies e tecnologias semelhantes</h2>
        <p>
          O site pode utilizar recursos técnicos necessários ao funcionamento, segurança, preferências
          e melhoria da experiência de navegação. Quando aplicável, ferramentas de terceiros podem
          possuir suas próprias políticas de privacidade.
        </p>

        <h2>6. Solicitações do titular</h2>
        <p>
          Para dúvidas ou solicitações relacionadas aos dados pessoais, entre em contato pelos canais
          oficiais disponíveis no site. A solicitação será analisada conforme a legislação aplicável
          e os dados disponíveis para identificação do atendimento.
        </p>

        <h2>7. Atualizações</h2>
        <p>
          Esta política pode ser atualizada quando houver mudanças no site, nos serviços ou nas
          exigências legais. A versão publicada nesta página é a referência vigente no momento da
          consulta.
        </p>
      </article>
    </main>
  );
}
