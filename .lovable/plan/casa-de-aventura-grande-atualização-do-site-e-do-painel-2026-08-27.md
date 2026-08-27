# Casa de Aventura — grande atualização do site e do painel

Plano dividido em 5 etapas. Cada etapa é entregue funcionando antes de começar a próxima.

## Etapa 1 — Navegação, contato e mídia dos roteiros

- **Menu no topo**: o menu lateral sai; os botões (Início, Viagens, Calendário, Blog, Comentários, Quem somos, Viagens salvas, Minha conta) passam a ficar em uma barra fixa no topo, com menu sanduíche no celular.
- **Telefone 4733511661**: passa a ser o número usado no botão "Agendar no WhatsApp" (flutuante, nos cards e na página do roteiro) e aparece também como botão "Ligar" na página do roteiro e no topo/rodapé.
- **Até 8 imagens + 1 vídeo por roteiro**: hoje o admin sobe até 5 imagens. Passa para 8, mais um campo de vídeo (link do YouTube/Vimeo ou upload) exibido na galeria da página do roteiro.
- **Tags**: o admin cria tags livres e marca nos roteiros; as tags aparecem nos cards e viram filtro na página de Viagens.
- **Rodapé completo** no padrão do site A Casa de Aventura: colunas com contato (telefone, WhatsApp, e-mail), links principais, redes sociais e selos/certificações.

## Etapa 2 — Home

- **Carrossel de até 8 imagens** no topo, trocando automaticamente a cada 10 segundos, com setas e indicadores; as imagens são cadastradas pelo admin em Configurações.
- **Estatísticas da home**: bloco de números (viagens realizadas, aventureiros atendidos, destinos, anos de estrada), editável no painel, com números que animam ao aparecer.

## Etapa 3 — Calendário, Quem somos e Comentários

- **Aba Calendário**: calendário mensal marcando o dia de hoje e todas as saídas cadastradas nos roteiros (ida e volta, ponto de saída, vagas). Clicar no dia mostra os roteiros daquela data com link para a página e para o WhatsApp.
- **Ponto de saída**: novo campo por saída no painel, exibido no calendário e na página do roteiro.
- **Quem somos**: página institucional com história da agência, equipe/guias e área de certificados (imagem + título + descrição), tudo editável pelo admin.
- **Comentários / Depoimentos**: qualquer visitante pode enviar nome, texto, nota e fotos reais. O comentário fica pendente e só aparece no site depois que o admin aprova em uma aba própria (aprovar, recusar, excluir).

## Etapa 4 — Blog

- Aba pública **Blog** com lista de posts e página individual.
- Aba **Blog** no painel: criar/editar/excluir post com título, resumo, texto completo, até 10 fotos e até 10 vídeos, data e rascunho/publicado.

## Etapa 5 — Ficha de inscrição

- Aba **Fichas de inscrição** no painel: o admin escolhe o roteiro vendido (ou "Todos") e gera um link único para enviar ao cliente.
- O link abre uma **ficha pública** com o cabeçalho/contato da Casa de Aventura e o nome do evento, com os campos:
  - Dados: nome completo, e-mail, telefone, CPF, data de nascimento, passaporte, profissão.
  - Endereço: CEP, país, estado, cidade, bairro, rua, número.
  - Físico: altura, peso, tamanho de camiseta, tamanho de calçado, tipo sanguíneo.
  - Saúde: disfunção cardíaca (sim/não + qual), alergia ou restrição a medicamentos (sim/não + qual), restrição alimentar, plano de saúde, observações de saúde.
  - Vacinas: raiva, febre amarela, SARS-CoV-2 (sim/não cada).
  - Contato de emergência.
  - Experiência: já pratica atividade ao ar livre?, qual atividade/esporte de rotina e frequência, já participou de evento igual, o que espera do evento, como e onde nos encontrou.
  - Termo de ciência de riscos (aceite obrigatório) e forma de pagamento.
- Ao enviar, a ficha cai na aba do admin, filtrável por viagem (com opção "Todos"), e cada ficha pode ser **baixada em PDF** pronto para imprimir e levar na viagem.

## Detalhes técnicos

- Banco: `trips.video_url` e `trips.tags[]`; novas tabelas `tags`, `hero_slides`, `about_page`/`certificates`, `testimonials` (com fotos e status de aprovação), `blog_posts` (arrays de fotos/vídeos), `enrollment_links` e `enrollments`. Leitura pública apenas do que está aprovado/publicado; escrita restrita ao admin, exceto envio de comentário e de ficha (via link válido).
- Novos campos em `site_settings`: telefone, imagens do carrossel, textos do rodapé e redes sociais. Saídas ganham `meeting_point`.
- Uploads de imagens/vídeos usam o bucket já existente, servidos pela rota interna de imagens.
- Rotas novas: `/calendario`, `/quem-somos`, `/comentarios`, `/blog`, `/blog/$slug`, `/ficha/$token`, e no painel `/admin/tags`, `/admin/comentarios`, `/admin/blog`, `/admin/fichas`.
- PDF da ficha gerado no navegador a partir de um layout de impressão, sem dependência externa pesada.
