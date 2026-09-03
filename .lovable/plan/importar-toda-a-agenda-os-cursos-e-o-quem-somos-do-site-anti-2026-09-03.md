# Importar toda a agenda, os cursos e o Quem Somos do site antigo

Hoje o banco do site novo está vazio (0 roteiros, 0 atividades, 0 saídas, nenhuma configuração). A ideia é trazer todo o conteúdo de casadeaventura.com.br para cá, com foto, descrição e detalhes, tudo editável no painel admin.

## O que será importado

**Agenda + cursos (18 itens da página /agenda/)** — expedições e cursos, incluindo:
- Camping & Hiking Soldados Sebold, Travessia do Lagamar, Maior Praia do Mundo, Serra do Tabuleiro, Volta a Ilha Grande, Volta a Ilha de SC, Aconcágua, Valle de las Lágrimas, Cerro Plata, Huayhuash, Sajama, Los Nevados e demais itens da lista
- Cursos ACA: Combo Águas Abertas & Zona de Surf (N4), Iniciação à Canoagem (N1–N3, duas datas), Formação de Guias (Kayak Touring Trip Leader)

Para cada item, virá do site antigo:
- Nome, destino/estado (ou país), atividade, nível e duração em dias
- Datas de ida e volta (saída cadastrada no calendário) e vagas quando informadas
- Preço (quando o site antigo não mostra valor, fica marcado como "Preço sob consulta")
- Descrição completa, destaques, o que está incluso e não incluso
- Ficha técnica, programação dia a dia, pré-requisitos, clima, alimentação, checklist e equipamentos — sempre que a página do roteiro no site antigo tiver essas seções
- Fotos: capa + até 8 imagens por roteiro, copiadas para o armazenamento do site novo (não ficam dependendo do site antigo)

**Atividades e etiquetas** — Canoagem, Trekking, Hiking, Camping, Montanhismo, Cursos, além de etiquetas como "Confirmado", "Inscrições abertas", "Curso ACA", "Internacional".

**Quem Somos** — texto institucional, história, apresentação do guia Álvaro Walendowsky, certificações/credenciais e foto, carregados na página /quem-somos e no admin de configurações.

**Configurações gerais** — telefone/WhatsApp, textos do rodapé e fotos do carrossel da home usando imagens da própria agenda.

## Como fica no admin

Nada de conteúdo fixo no código: tudo entra no banco, então em **Administração > Viagens** você edita nome, datas, preço, descrição, fotos (definir capa), ficha técnica, programação, checklist e equipamentos de cada item; em **Atividades** e **Etiquetas** os filtros; em **Configurações** o Quem Somos, telefone, carrossel e rodapé.

## Etapas

1. **Coleta**: ler as 18 páginas de produto da agenda e as páginas de roteiro detalhado ligadas a cada uma, extraindo textos, datas, preços, seções e a lista de imagens originais.
2. **Fotos**: baixar as imagens em resolução original e enviá-las para o armazenamento do site (bucket `trip-images`), uma pasta por roteiro.
3. **Carga no banco**: migração com atividades, etiquetas, os 18 roteiros completos, as saídas (ida→volta) e as configurações do Quem Somos/contato.
4. **Conferência**: abrir home, /viagens, algumas páginas de roteiro, /calendario e /quem-somos para confirmar que fotos e textos aparecem; abrir o admin e confirmar que tudo está editável.

## Detalhes técnicos

- Migração SQL com INSERTs literais em `activities`, `tags`, `trips`, `departures`, `site_settings` (o schema já tem `images`, `tech_sheet`, `itinerary`, `checklist`, `equipment`, `guide_text`, `not_included`, etc.).
- Imagens gravadas no bucket `trip-images` em `roteiros/<slug>/`; as URLs privadas continuam sendo servidas pelo proxy já existente `/api/public/img/$`.
- Roteiros sem preço no site antigo entram com `price = 0` (exibido como "sob consulta").
- Itens fora do Brasil usam o campo estado para o país (ex.: "Argentina", "Peru", "Bolívia", "Colômbia").
- Nenhum texto é inventado: só o que existe nas páginas do site antigo; campos sem fonte ficam vazios para você preencher no admin.
