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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Transparência
            </p>
            <h1 className="mt-1 text-3xl md:text-5xl">Política de Privacidade</h1>
            <p className="mt-3 text-sm text-muted-foreground">A Casa de Aventura</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-6 text-sm leading-7 text-muted-foreground md:p-10 md:text-base">
        <h2>Condições Gerais</h2>
        <p>
          Esta política de privacidade estabelece a forma como usamos e protegemos todas as informações que você fornece quando realiza transações comerciais conosco ou utiliza este site.
        </p>
        <p>
          Estamos empenhados em garantir que sua privacidade esteja protegida. Pedimos que você forneça certas informações pelas quais você pode ser identificado quando utiliza nosso site, então você pode ter certeza que estas informações somente serão utilizadas de acordo com esta declaração de privacidade.
        </p>
        <p>
          Esta política pode ser alterada de tempos em tempos, atualizando esta página. Você deve verificar esta página de tempos em tempos para garantir que está de acordo com as mudanças.
        </p>

        <h2>O que nós coletamos</h2>
        <p>Nós podemos coletar as seguintes informações:</p>
        <ul>
          <li>Nome;</li>
          <li>Dados para contato como e-mail e telefone;</li>
          <li>Redes sociais;</li>
          <li>Informações demográficas como endereço, código postal, município, estado e país;</li>
          <li>Preferências e interesses;</li>
        </ul>

        <h2>O que fazemos com as informações que coletamos</h2>
        <p>
          Precisamos dessas informações para entender suas necessidades e lhe fornecer um melhor serviço, em particular, pelas seguintes razões:
        </p>
        <ul>
          <li>Manutenção de registro interno;</li>
          <li>Melhorar nossos produtos e serviços;</li>
        </ul>
        <p>
          Podemos enviar periodicamente e-mails com informações promocionais sobre novos produtos, ofertas especiais ou outras informações que julgamos ser de seu interesse, utilizando o endereço de e-mail que você forneceu. Através do seu cadastro, você poderá ajustar suas informações e escolher o que deseja receber de mensagens.
        </p>
        <p>
          De tempos em tempos, também podemos utilizar suas informações para contatá-lo para fins de pesquisa de mercado. Podemos entrar em contato por e-mail, telefone ou outros canais de contato fornecidos.
        </p>
        <p>Podemos usar as informações para personalizar o site de acordo com seus interesses.</p>

        <h2>Segurança e Lei Geral de Proteção de Dados</h2>
        <p>
          Estamos empenhados em garantir que suas informações estão seguras. A fim de evitar o acesso não autorizado ou divulgação, realizamos boas práticas de procedimentos físicos, eletrônicos e administrativos para salvaguardar e proteger as informações que coletamos online.
        </p>
        <p>
          Você pode a qualquer momento entrar em contato conosco através do e-mail{" "}
          <a className="font-semibold text-accent underline underline-offset-4" href="mailto:lgpd@casadeaventura.com.br">
            lgpd@casadeaventura.com.br
          </a>{" "}
          para obter informações de quais dados dispomos em nosso banco de dados, ou então solicitar a sua remoção parcial ou total.
        </p>

        <h2>Como utilizamos os cookies</h2>
        <p>
          Um cookie é um pequeno arquivo que pede permissão para ser colocado no disco rígido do seu computador. Uma vez que você concorda, o arquivo é adicionado e o cookie ajuda a analisar o tráfego web ou deixa você saber quando você visita um determinado site. A aplicação web pode adequar suas operações por recolher e registar informações sobre suas preferências.
        </p>
        <p>
          Nós utilizamos cookies de tráfego para identificar quais páginas estão sendo usadas. Isso nos ajuda a analisar os dados sobre tráfego na página web e melhorar o nosso site, a fim de adaptá-lo às necessidades dos clientes. Nós utilizamos somente esta informação para fins de análise estatística e em seguida os dados são retirados do sistema.
        </p>
        <p>
          Em geral os cookies nos ajudam a fornecer-lhe um site melhor, pois nos permite monitorar as páginas que você acha útil e outras que não acha. Um cookie não nos dá acesso ao seu computador ou qualquer informação sobre você, além dos dados que você escolher para compartilhar conosco. Você pode optar por aceitar ou recusar cookies. A maioria dos browsers automaticamente aceita cookies, mas você pode modificar a configuração do navegador para recusar cookies se você preferir. Isso pode impedir você de tirar pleno proveito do site.
        </p>

        <h2>Links para outros sites</h2>
        <p>
          Nossa página pode conter links para outros sites. No entanto, depois de ter usado esses links para sair do nosso site, você deve saber que não temos qualquer controle sobre o site acessado. Portanto, não podemos ser responsáveis pela proteção e privacidade de qualquer informação que você fornecer enquanto visita tais sites e tais sites não são regidos por esta declaração de privacidade. Você deve ter cautela e olhar para a declaração de privacidade aplicável ao site acessado.
        </p>

        <h2>Controlando suas informações pessoais</h2>
        <p>
          Você pode optar por restringir a coleta ou uso de suas informações pessoais das seguintes maneiras:
        </p>
        <p>
          sempre que você é convidado a preencher um formulário no site, procure a caixa que você pode clicar para indicar que você não quer que a informação seja utilizada por qualquer pessoa para fins de marketing direto.
        </p>
        <p>
          Se você já concordou em nos fornecer suas informações pessoais para fins de marketing direto, você pode mudar de idéia a qualquer momento usando a área de cadastro do site.
        </p>
        <p>
          Nós não iremos vender, distribuir ou alugar suas informações pessoais a terceiros, a menos que tenhamos sua permissão ou que sejamos obrigados por lei a fazê-lo.
        </p>
        <p>
          Nós podemos usar suas informações pessoais para lhe enviar informações promocionais sobre terceiros que julgamos ser interessantes se você nos disser que deseja que isso aconteça.
        </p>
        <p>Estamos à disposição para esclarecimentos.</p>
      </article>
    </main>
  );
}
