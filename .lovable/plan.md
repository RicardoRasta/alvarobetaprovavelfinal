# Novo visual do site — linha Quintal de Casa

Redesign completo das páginas públicas, bem próximo da referência: fundo off-white, laranja forte de destaque, verde escuro quase preto para texto e detalhes, tipografia display condensada e pesada, cantos bem arredondados e muito respiro. O painel admin entra na mesma pegada visual, mantendo todos os campos e funções como estão.

## Linguagem visual

- **Cores**: fundo off-white claro, texto verde-petróleo quase preto, laranja vibrante como cor de ação (botões, setas, links de seção). Modo escuro continua funcionando.
- **Tipografia**: título display condensado pesado (estilo "Explore a nossa agenda completa") em caixa mista, corpo em sans limpa e arredondada.
- **Formas**: blocos com cantos bem arredondados, imagens em cartões grandes, botões pílula laranja, chips cinza/translúcidos para datas e locais.
- **Movimento**: transições suaves de imagem, hover com leve zoom na foto e deslize da seta.

## Home

- **Carrossel grande** em cartão arredondado ocupando quase toda a largura: foto cheia, botão laranja "Explorar", e sobre a imagem duas linhas de chips — "Próximas saídas" (meses) e "Locais" (destino/estado). Setas circulares e indicadores em bolinhas.
- **Bloco "Explore a nossa agenda completa"**: título display gigante à esquerda, botão laranja "Acessar agenda", e à direita uma **barra de busca em pílula** com Datas + Categorias e botão redondo laranja de lupa, que leva para /viagens já filtrado.
- **"Roteiros em destaque"**: título grande + link laranja com seta para /viagens; lista em colunas com nome do roteiro e os meses das próximas saídas.
- **"Próximas aventuras"**: mesma estrutura, com as datas completas das saídas mais próximas.
- Blocos de estatísticas e diferenciais mantidos, com o novo estilo.

## Demais páginas

- **Viagens**: cabeçalho display grande, filtros em pílulas horizontais (atividade, tag, data), cards de viagem no novo formato — foto grande arredondada, chips de saídas e locais sobre a imagem, preço destacado e botão laranja de WhatsApp.
- **Página do roteiro**: capa grande arredondada com galeria/vídeo, cabeçalho com chips de datas/local/nível, barra lateral de preço e ações fixa, seções (ficha técnica, itinerário, checklist, equipamentos, guia) em blocos arredondados alternando fundo.
- **Calendário**: grade mensal no novo estilo, dias com saídas marcados em laranja.
- **Blog / post**: capas grandes arredondadas, títulos display, leitura confortável em coluna única.
- **Quem somos**: seção de história com imagem grande, equipe e certificados em cards.
- **Comentários**: formulário e depoimentos em cards arredondados com fotos em mosaico.
- **Salvas, Minha conta, Login**: mesmos componentes atualizados.
- **Topo e rodapé**: barra fixa limpa com logo à esquerda, navegação central, telefone e WhatsApp à direita; menu sanduíche no celular em painel deslizante. Rodapé escuro com colunas de contato, links, redes e selos.

## Detalhes técnicos

- Tokens de cor, sombras, raios e gradientes redefinidos em `src/styles.css`; nada de cor fixa nos componentes.
- Fontes carregadas por `<link>` no `src/routes/__root.tsx` e registradas em `@theme` (display condensado + sans de corpo).
- Novos componentes: `hero-slide-card`, `chip`, `section-heading` (título + link com seta) e `search-bar`; `hero-carousel`, `trip-card`, `app-shell` e `site-footer` reescritos.
- Rotas públicas atualizadas apenas na camada de apresentação: nenhuma mudança de banco, admin ou regra de negócio. Os campos já existentes (saídas, tags, atividades, imagens, vídeo) alimentam os novos blocos.
- Ajustes de responsivo em cada página e verificação em telas de celular e desktop.

Entrego por etapas: 1) tokens + topo/rodapé, 2) home, 3) viagens e página do roteiro, 4) calendário/blog/quem somos/comentários/conta.
