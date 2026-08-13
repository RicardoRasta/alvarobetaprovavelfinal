# Até 5 imagens por viagem

Hoje cada viagem tem apenas uma imagem. A ideia é permitir cadastrar até 5, com a primeira sendo a capa usada nos cards e listagens, e as demais formando uma galeria na página da viagem.

## Banco de dados
- Adicionar a coluna `images` (lista de textos) na tabela `trips`, com valor padrão vazio.
- Migrar o valor atual de `image_url` para o primeiro item de `images`, mantendo `image_url` como capa para não quebrar nada existente.

## Admin (/admin/viagens)
- Substituir o upload único por uma grade de até 5 imagens:
  - botão de adicionar (desabilita ao chegar em 5)
  - miniatura com botão de remover
  - reordenação simples (mover para esquerda/direita) para definir a capa
- Ao salvar, a primeira imagem vira a capa (`image_url`) e a lista completa vai para `images`.
- Upload continua indo para o bucket `trip-images`.

## Site público
- Cards e listagens continuam usando a capa (sem mudança visual).
- Página da viagem (`/viagens/:slug`): galeria com imagem principal grande + miniaturas clicáveis abaixo; quando houver só uma imagem, o layout fica igual ao de hoje.

## Detalhes técnicos
- Nova migração: `ALTER TABLE public.trips ADD COLUMN images text[] NOT NULL DEFAULT '{}'` + backfill a partir de `image_url`. Políticas existentes já cobrem leitura pública e escrita de admin.
- `src/data/trips.ts`: incluir `images` no tipo `Trip` e criar helper `tripImages()` que retorna a lista tratada com fallback para a capa.
- `src/routes/admin.viagens.tsx`: estado de formulário passa de `image_url: string` para `images: string[]`; upload em lote com validação de limite.
- `src/routes/viagens.$tripId.tsx`: componente de galeria com estado local do índice selecionado.

Observação: continua valendo a limitação atual do workspace que bloqueia buckets públicos — as imagens enviadas só aparecem para usuários autenticados até isso ser liberado.
