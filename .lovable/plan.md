# Ficha técnica completa nas viagens

Objetivo: o admin cadastra e edita todas as informações detalhadas da viagem (como na página de referência da Casa de Aventura), tanto ao criar o anúncio quanto depois que já está no ar. A página pública passa a exibir essas seções organizadas.

## Campos novos por viagem

Cada viagem ganha os blocos abaixo, todos opcionais e editáveis no admin:

- Ficha técnica (lista de item + valor: distância, altitude, duração, etc.)
- Conheça quem irá lhe conduzir (texto do guia, com foto opcional)
- Saiba para onde você está indo (texto sobre o destino)
- Pré-requisitos (lista)
- Características (texto)
- Clima (texto)
- Alimentação (texto)
- Programação (dia a dia: título do dia + descrição, na ordem)
- Incluso no pacote (lista — já existe, será reaproveitada)
- Não inclui (lista)
- Check list (lista)
- Equipamentos que você deve levar ou alugar (lista)

## Admin (/admin/viagens)

- O formulário de nova viagem e o de edição passam a ter uma seção "Conteúdo da página" com abas/blocos recolhíveis para cada item acima, para não virar um formulário gigante.
- Listas (pré-requisitos, não inclui, check list, equipamentos) usam campos de linhas: uma linha por item, com botões de adicionar/remover e reordenar.
- Programação usa blocos "Dia 1, Dia 2..." com título e descrição, podendo adicionar, remover e reordenar.
- Ficha técnica usa pares rótulo/valor (ex.: "Distância" / "42 km").
- Tudo salva junto com a viagem e reabre preenchido ao clicar em Editar.

## Página pública da viagem

- Layout parecido com o do link de referência: descrição principal no topo, depois ficha técnica em tabela, guia, destino, pré-requisitos, características/clima/alimentação, programação dia a dia, incluso, não incluído, check list e equipamentos.
- Seções vazias simplesmente não aparecem, então as viagens já cadastradas continuam funcionando normalmente.
- Botão de WhatsApp continua fixo e com a mensagem já preenchida.

## Detalhes técnicos

- Migração em `trips`: `tech_sheet jsonb default '[]'` (label/value), `guide_text text`, `guide_image_url text`, `destination_text text`, `prerequisites text[]`, `characteristics text`, `climate text`, `food text`, `itinerary jsonb default '[]'` (title/description), `not_included text[]`, `checklist text[]`, `equipment text[]`. Sem mudança de RLS (políticas atuais de trips já cobrem).
- `src/data/trips.ts`: tipo `Trip` estendido com os novos campos.
- `src/routes/admin.viagens.tsx`: componentes reutilizáveis `ListEditor`, `PairEditor` e `ItineraryEditor`; inclusão dos campos no estado do formulário, no insert e no update.
- `src/routes/viagens.$tripId.tsx`: novas seções de renderização condicional, mantendo os tokens de design atuais.
