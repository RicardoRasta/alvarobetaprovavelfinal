import { createFileRoute } from "@tanstack/react-router";
import { Backpack } from "lucide-react";

export const Route = createFileRoute("/contrato-aluguel-de-equipamentos")({
  head: () => ({
    meta: [
      { title: "Contrato de Aluguel de Equipamentos — A Casa de Aventura" },
      {
        name: "description",
        content: "Instrumento particular de locação de equipamentos recreativos e esportivos.",
      },
    ],
  }),
  component: RentalContract,
});

function RentalContract() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:py-12 md:px-8 md:py-16">
      <header className="card-surface p-5 sm:p-6 md:p-10">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Backpack className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Documento</p>
            <h1 className="mt-1 text-2xl leading-tight sm:text-3xl md:text-5xl">Contrato de Aluguel de Equipamentos</h1>
            <p className="mt-3 text-sm text-muted-foreground">Instrumento particular de locação de equipamentos recreativos e esportivos por prazo determinado.</p>
          </div>
        </div>
      </header>

      <article className="card-surface content-copy mt-6 p-5 text-sm leading-7 text-muted-foreground sm:p-7 md:p-10 md:text-base">
        <h2>INSTRUMENTO PARTICULAR DE LOCAÇÃO DE EQUIPAMENTOS RECREATIVOS E ESPORTIVOS POR PRAZO DETERMINADO E OUTRAS AVENÇAS.</h2>

        <p>
          Pelo presente Instrumento Particular de Locação de Equipamentos Recreativos e Esportivos por Prazo Determinado e Outras Avenças, de um lado <strong className="text-foreground">IVO LEONARDO SCHMITZ 00515856932</strong>, com sede na Rua Portugal, 10, Bairro Santa Rita, Cidade de Brusque, Santa Catarina, inscrita no CNPJ sob o nº 33.009.330/0001-05, doravante simplesmente denominada LOCADORA e de outro lado, o LOCATÁRIO(A), qualificada e cadastrada no ANEXO 01 – TERMO DE LOCAÇÃO, ajustam entre si as cláusulas e condições a seguir dispostas, com a finalidade de locação de todos os produtos presentes no ANEXO 01 – TERMO DE LOCAÇÃO deste documento.
        </p>
        <p>
          O LOCATÁRIO(A) declara estar de acordo em cumprir com os termos e condições do presente Contrato, aceitando através de um clique no campo "Li e Aceito os Termos do Contrato de Locação", declarando expressamente aceitar e concordar com as cláusulas e condições deste instrumento, inclusive os dispostos nos Termos e Condições e Política de Privacidade do Site.
        </p>

        <h2>CLÁUSULA PRIMEIRA – DA PRESTAÇÃO DE SERVIÇOS</h2>
        <p>1.1 – Ao aderir a este Termo, você terá direito à locação dos produtos disponíveis no site www.casadeaventura.com.br www.bikedealuguel.com.br e/ou www.spotdealuguel.com.br, redes sociais e catálogo virtual, sendo possível mantê-los em sua posse até a data de devolução pré-estabelecida, mediante o pagamento de uma taxa cujo valor variará conforme o produto contratado.</p>
        <p>1.2 – Para que você possa efetuar a locação do(s) produto(s) de interesse, deverá fornecer seus dados pessoais (cadastro site) e preencher o documento ANEXO 01 – TERMO DE LOCAÇÃO com o descritivo dos equipamentos, para garantia de eventuais danos ou atrasos na devolução dos produtos locados, além do comprovante de pagamento do período de locação.</p>
        <p>1.3 – As diárias de locação equivalem a 24 (vinte e quatro) horas.</p>
        <p>1.4 – Ocorrendo a insatisfação com o estado de conservação do produto, após seu recebimento, poderá ser solicitada por e-mail a sua devolução no prazo máximo de 24 horas após o recebimento.</p>

        <h2>CLÁUSULA SEGUNDA – ENTREGA DO PRODUTO LOCADO</h2>
        <p>2.1 – O(s) Produto(s) locado(s) deverá(ão) ser entregue(s) pela LOCADORA, limpo(s), em estado de conservação adequado para utilização, na forma e na data solicitada pela LOCATÁRIA(O), no prazo de até às 22:00 hs (vinte e duas horas), sendo certo que caso a LOCADORA venha a realizar a entrega antecipada do(s) Produto(s), não haverá qualquer cobrança adicional.</p>
        <p>2.2 – Fica ciente o LOCATÁRIO(A) de que o(s) produto(s) poderão ser locado(s) antes por outros clientes, sendo que no caso de o cliente anterior danificá-lo(s), a LOCADORA deverá entrar em contato com o LOCATÁRIO(A), informando-a do ocorrido. Nesses casos o LOCATÁRIO(A), por sua vez, poderá optar pela troca do Produto ou o estorno do valor pago.</p>
        <p>2.3 – O LOCATÁRIO(A) assume a responsabilidade integral pela recepção do(s) Produto(s) locado(s), estando ciente neste ato que no caso de o endereço de entrega não ser considerado seguro ou o parceiro contratado para entrega encontrar dificuldades de acesso, poderá ocorrer atraso e cobrança de eventuais custos adicionais, estes serão cobrados pela LOCADORA e suportados pelo LOCATÁRIO(A).</p>
        <p>2.4 – Em caso de eventual impossibilidade de entrega do(s) Produto(s) locado(s), o valor do aluguel será integralmente restituído ao LOCATÁRIO(A).</p>

        <h2>CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO LOCATÁRIO(A).</h2>
        <p>3.1 – O LOCATÁRIO(A), após o recebimento do(s) Produto(s) locado(s), assume o compromisso e a responsabilidade pela guarda, cuidado e utilização zelosa dos referidos produtos, como se fossem de sua propriedade, responsabilizando-se por eventual perda, destruição, e/ou quaisquer danos irreversíveis que ocorram com o(s) Produto(s), com exceção do desgaste natural decorrente da utilização normal.</p>
        <p>3.2 – Ante a responsabilidade assumida no item anterior, o LOCATÁRIO(A) concorda plenamente e desde já, em arcar com os danos eventualmente causados ao(s) Produto(s) locados de propriedade da LOCADORA, autorizando-a desde já, que eventuais valores decorrentes da reparação dos danos causados, sejam devidamente cobrados para a realização dos reparos.</p>
        <p>3.3 – Na hipótese de dano irreparável causado ao(s) Produto(s) locado(s), será cobrado do LOCATÁRIO(A), o valor integral de varejo do(s) referido(s) Produto(s) presentes no ANEXO 01 – TERMO DE LOCAÇÃO, sendo que após efetuado o pagamento, o LOCATÁRIO(A) poderá permanecer com o(s) Produto(s) danificado(s).</p>

        <h2>CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DO LOCATÁRIO(A).</h2>
        <p>3.1 – O LOCATÁRIO(A), após o recebimento do(s) Produto(s) locado(s), assume o compromisso e a responsabilidade pela guarda, cuidado e utilização zelosa dos referidos produtos, como se fossem de sua propriedade, responsabilizando-se por eventual perda, destruição, e/ou quaisquer danos irreversíveis que ocorram com o(s) Produto(s), com exceção do desgaste natural decorrente da utilização normal.</p>
        <p>3.2 – Ante a responsabilidade assumida no item anterior, o LOCATÁRIO(A) concorda plenamente e desde já, em arcar com os danos eventualmente causados ao(s) Produto(s) locados de propriedade da LOCADORA, autorizando-a desde já, que eventuais valores decorrentes da reparação dos danos causados, sejam devidamente cobrados para a realização dos reparos.</p>
        <p>3.3 – Na hipótese de dano irreparável causado ao(s) Produto(s) locado(s), será cobrado do LOCATÁRIO(A), o valor integral de varejo do(s) referidos(s) Produto(s), sendo que após efetuado o pagamento, o LOCATÁRIO(A) poderá permanecer com o(s) Produto(s) danificado(s).</p>

        <h2>CLÁUSULA QUARTA – DO VALOR E FORMAS DE PAGAMENTO.</h2>
        <p>4.1 – O LOCATÁRIO(A) tem plena ciência do valor da Locação no ato da contratação, concordando expressamente com o valor, prazo da locação, local de entrega e forma de devolução do(s) Produto(s) e de que o custo do respectivo frete de entrega e/ou devolução, será acrescido ao valor da Locação se necessário a entrega.</p>
        <p>4.2 – O pagamento deverá ser feito de forma antecipada, conforme opção de pagamento presente no documento ANEXO 01 – TERMO DE LOCAÇÃO.</p>
        <p>4.3 – Em caso de não devolução de algum dos produtos, será cobrado do LOCATÁRIO(A) o valor integral de varejo do(s) referidos(s) Produto(s).</p>

        <h2>CLÁUSULA QUINTA – DO PRAZO DA LOCAÇÃO.</h2>
        <p>5.1 – O prazo da Locação será aquele escolhido pelo LOCATÁRIO(A), no ato da contratação e de acordo com as opções disponibilizadas e presente no ANEXO 01 – TERMO DE LOCAÇÃO.</p>
        <p>5.2 – O LOCATÁRIO(A) pode solicitar à LOCADORA, através de e-mail ou telefone a prorrogação do prazo de Locação do(s) Produto(s) locado(s), sujeita à aprovação ou não da referida prorrogação, de acordo com a disponibilidade do(s) Produto(s) e mediante o pagamento do valor adicional do aluguel resultante da prorrogação do prazo solicitado.</p>

        <h2>CLÁUSULA SEXTA – DA DEVOLUÇÃO DOS PRODUTOS LOCADOS.</h2>
        <p>6.1 – O LOCATÁRIO(A) se responsabiliza e compromete-se em realizar a devolução do(s) Produto(s) locado(s), da forma escolhida no ato da contratação da Locação.</p>
        <p>6.2 – O LOCATÁRIO(A) deverá efetuar a devolução do(s) Produto(s) locado(s) no endereço de entrega da LOCADORA, ou o LOCATÁRIO(A) deverá despachar o(s) Produto(s) para o endereço física da LOCADORA.</p>
        <p>6.3 – Caso o LOCATÁRIO(A) venha a optar pela devolução de forma diferente da acordada no momento da locação, este deverá informar a LOCADORA via e-mail ou telefone para realizar a devolução do(s) Produto(s), através de outros meios, informando o respectivo modo.</p>
        <p>6.4 – O LOCATÁRIO(A) se compromete a informar imediatamente a LOCADORA, todo e qualquer possível atraso que possa ocorrer na devolução do(s) Produto(s) locado(s), através de e-mail ou telefone, para que possa ser verificada a possibilidade de prorrogação do prazo da Locação, conforme indicado acima.</p>
        <p>6.5 – Caso a prorrogação do prazo da Locação não seja possível, o atraso na devolução do(s) produto(s) locado(s) acarretará a cobrança de multa correspondente ao valor proporcional a 02 (duas) diárias da Locação realizada, por dia de atraso, cujo valor será cobrado pela LOCADORA.</p>
        <p>6.6 – Caso o atraso na devolução do(s) Produto(s) locado(s) for superior a 05 (cinco) dias, será devido pelo LOCATÁRIO(A) à LOCADORA, o valor proporcional a 02 (duas) diárias da Locação realizada, por dia de atraso, que será cobrado na forma indicada no item acima, sem prejuízo do procedimento de coleta indicado no também em item acima.</p>

        <h2>CLÁUSULA SÉTIMA – DO CANCELAMENTO DA LOCAÇÃO.</h2>
        <p>7.1 – O LOCATÁRIO(A) poderá realizar solicitação de cancelamento da Locação, através de e-mail ou telefone, no prazo de até 7 dias antes da data solicitada para a entrega do(s) Produto(s) locado(s), sendo que nesta hipótese o LOCATÁRIO(A) poderá optar:</p>
        <p>a) Pela restituição de 100% do valor já pago referente a Locação, mediante o estorno do valor;</p>
        <p>b) Pelo recebimento do crédito do valor total da Locação cancelada, na forma de um voucher com utilização válida para nova Locação dentro do prazo de até 12 (doze) meses da data da emissão.</p>
        <p>7.2 – Caso o LOCATÁRIO(A) venha solicitar o cancelamento da Locação em prazo inferior ao indicado no item acima, porém, no prazo de até 48 (quarenta e oito) horas antes da data solicitada para a entrega do(s) Produto(s) locado(s), o LOCATÁRIO(A) poderá optar:</p>
        <p>a) Pelo recebimento do valor total da Locação cancelada, na forma de um voucher com crédito para utilização em uma nova Locação no prazo de até 12(doze) meses da data de sua emissão;</p>
        <p>b) Pela restituição do valor de 50% (cinquenta por cento) da Locação cancelada.</p>
        <p>7.3 – Caso a solicitação de cancelamento da Locação seja realizada pelo LOCATÁRIO(A) em prazo inferior ao indicado no item acima, o LOCATÁRIO(A) poderá optar: a) Pelo recebimento do valor de 75% (setenta e cinco por cento) da Locação cancelada, na forma de um voucher para utilização em uma nova Locação no prazo de até 12 (doze) meses da data de sua emissão.</p>
        <p>7.4 – Se o LOCATÁRIO desejar cancelar a locação após receber os produtos não haverá estorno do valor acordado e nem voucher de voucher de crédito. O cancelamento após a entrega é de responsabilidade do cliente.</p>
        <p>7.5 – Se o LOCATÁRIO(A) decidir, por conta própria, devolver os itens alugados antes da data pré definida com a LOCADORA, os valores equivalentes as diárias não usadas, não será estornado ou revertido como crédito para uma futura locação. Nesse caso, a devolução antecipada é de responsabilidade do LOCATÁRIO(A).</p>

        <h2>CLÁUSULA OITAVA – DA TROCA DE PRODUTOS.</h2>
        <p>8.1 – Poderá ser realizada a troca do(s) Produto(s) locado(s), uma única vez e somente se a solicitação de troca for realizada pela LOCATÁRIO(A) via e-mail ou telefone, na mesma data de recebimento do(s) Produto(s) locado(s), sendo certo que o próprio LOCATÁRIO(A) fica responsável pelo custo de frete da nova entrega.</p>
        <p>8.2 – Para efetivação da troca, o LOCATÁRIO(A) deverá devolver o(s) Produto(s) locado(s) à LOCADORA em até 24 (vinte e quatro) horas, a contar da data de entrega do(s) Produto(s).</p>
        <p>8.3 – Após o recebimento e verificação da não utilização do(s) Produto(s), a LOCADORA emitirá um voucher com crédito do valor da respectiva Locação, para utilização pelo LOCATÁRIO(A) em uma nova Locação no prazo de até 12 (doze) meses da data de sua emissão, sendo certo que caso a LOCADORA verifique que o(s) Produto(s) foi(ram) utilizado(s), a emissão do voucher não será efetuada.</p>

        <h2>CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS</h2>
        <p>10.1 – Este Contrato, incluindo os Termos e Condições e a Política de Privacidade do Site constitui o acordo integral entre as partes.</p>
        <p>10.2 – Se qualquer disposição deste Contrato for considerada ilegal, inválida ou conflitante com a Legislação pertinente e incidente sobre o presente Contrato, as demais disposições permanecerão plenamente válidas e vigentes.</p>
        <p>10.3 – A responsabilidade da LOCADORA por eventual falha na entrega do(s) Produto(s) é limitada ao valor da Locação, razão pela qual esta não será responsável em qualquer hipótese, por eventuais danos diretos ou indiretos decorrentes da Locação objeto deste contrato.</p>
        <p>10.4 – Todas as cobranças decorrentes deste Contrato estão sujeitas a protesto e inclusão do nome do devedor nos cadastros dos órgãos de serviços de proteção ao crédito, sendo certo que todos os custos decorrentes de tais cobranças, incluindo, mas não se limitando, honorários advocatícios serão de responsabilidade do respectivo devedor.</p>
        <p>10.5 – Em caso de violação de qualquer disposição deste Contrato, a LOCADORA reserva-se o direito de não realizar novas locações ao LOCATÁRIO(A) inadimplente, bem como o de alterar ou cancelar o presente Contrato a qualquer momento, a seu exclusivo critério e sem prejuízo das demais penalidades legais e deste instrumento.</p>

        <h2>CLÁUSULA DÉCIMA – DO FORO</h2>
        <p>11.1 – As Partes elegem o Foro Central da Comarca de Brusque/SC, como o competente para dirimir quaisquer dúvidas oriundas do presente contrato, com exclusão de qualquer outro, por mais privilegiado que possa ser.</p>
      </article>
    </main>
  );
}
