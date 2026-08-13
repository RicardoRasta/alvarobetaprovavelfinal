# Ajustes no painel e na vitrine de viagens

## 1. Dashboard — Próximas saídas
- A lista já mostra as saídas futuras em ordem crescente de data; vou destacar a primeira linha (a mais próxima) e mostrar "faltam X dias" ao lado da data, mantendo as vagas visíveis.
- Também incluo a data de volta quando existir.

## 2. Formulário "Nova viagem" (admin)
- Campo "Slug (URL)" passa a se chamar **URL da página**, com o endereço final visível (ex.: `/viagens/canoagem-bonito`) e preenchimento automático a partir do nome.
- **Imagem**: troco o campo de URL por **upload de arquivo** (envio da foto direto do computador, com pré-visualização e opção de trocar/remover). A imagem fica guardada no armazenamento do próprio sistema.
- **Datas da saída dentro do formulário**: nova seção "Saídas" onde já é possível cadastrar, na criação da viagem, cada saída com **data de ida, data de volta e número de vagas** — hoje só dá para adicionar depois, na lista, e sem data de volta.
- **Destacar na home** e **Publicado no site**: passam a ficar em bloco próprio com explicação, e a viagem salva mantém a escolha ao reabrir a edição.
- **Editar**: ao clicar em "Editar", a página rola automaticamente até o formulário no topo.

## 3. Home (início)
- Seção "Roteiros em destaque" mostra as viagens marcadas como destaque, ordenadas pela saída mais próxima.
- "Próximas saídas" continua da mais próxima para a mais distante, agora com data de ida → volta e vagas.

## 4. Página de viagens do site
- A listagem passa a ser ordenada sempre pela **saída mais próxima** (1ª, 2ª, 3ª...), com viagens sem data marcada no final.
- Vale também com filtro de atividade e busca ativos.

## 5. Atividades (canoagem, escalada, trekking, rafting, expedições)
- Nova aba **Atividades** no admin para criar, renomear, reordenar e excluir categorias, para você montar a lista do seu jeito. Elas aparecem na home e nos filtros na ordem que você definir.

## Detalhes técnicos
- Migração: adicionar `return_date` (data de volta, opcional) em `departures`; criar bucket público `trip-images` com políticas de leitura pública e escrita apenas para admin.
- `src/routes/admin.viagens.tsx`: upload via `supabase.storage`, seção de saídas no formulário (ida/volta/vagas), rótulos novos, `scrollIntoView` ao editar.
- Nova rota `src/routes/admin.atividades.tsx` (CRUD em `activities`) + link no menu de `admin.tsx`.
- `src/lib/api.ts`: helper `nextDeparture` já existe; adicionar `sortByNextDeparture` usado em `viagens.index.tsx` e na home.
- `src/data/trips.ts`: tipo `Departure` ganha `return_date`; formatação de intervalo de datas.
- `admin.index.tsx`, `index.tsx`, `trip-card.tsx`: exibir ida → volta e destaque da saída mais próxima.
