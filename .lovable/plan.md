# Casa de Aventura — agenda, capa, admin e multi-moeda

## 1. Escolha da capa entre as 5 imagens
No formulário de viagem do admin, cada miniatura ganha um botão claro "Definir como capa" (e selo "Capa" na atual). A capa passa a ser a imagem usada em cards, home e compartilhamento — as setas de reordenar continuam para o resto da galeria.

## 2. Importar a agenda do site atual
Importar as 17 datas publicadas em casadeaventura.com.br/agenda como viagens reais no banco, com:
- Nome, destino/estado, atividade (trekking, canoagem, hiking, curso, montanhismo, camping)
- Datas de saída e retorno (ex.: 13 a 22 de agosto de 2026)
- Duração em dias, preço quando divulgado (R$ 850 a R$ 5.250) e status/vagas no texto
- Itens sem preço ("Leia mais") entram sem valor, marcados como "sob consulta"
Tudo entra como conteúdo editável no admin, não como texto fixo no código.

## 3. Esconder o admin da navegação
Remover "Administração" do menu do site. O acesso passa a ser só digitando /admin. Rotas e proteção continuam iguais.

## 4. Usuário administrador
Criar o acesso casadeaventura@admin.com com a senha informada, já com papel de administrador e e-mail confirmado, para entrar direto em /admin.

## 5. Salvamento confiável
- Toda gravação (viagem, imagens, saídas, atividades, configurações) confirma sucesso ou mostra erro claro; nada é perdido em silêncio.
- Botão de salvar com estado "salvando", bloqueio de duplo clique e aviso ao sair com alterações não salvas.
- Upload de imagem só entra na viagem depois de concluído; falha de upload não apaga o que já existia.
- Após salvar, os dados são recarregados do banco para confirmar o que ficou gravado.

## 6. Preços em Real, Dólar e Euro
Real continua como preço principal e destacado. Abaixo, em letra menor, aparece a conversão aproximada em USD e EUR (card, página da viagem e destaques). As cotações ficam configuráveis em Configurações do admin, com atualização automática diária por uma fonte pública de câmbio e queda para os valores salvos se a fonte falhar.

## Detalhes técnicos
- `trips`: uso do array `images` já existente; a capa é sempre `images[0]`, o botão "Definir como capa" move a imagem para a posição 0 e sincroniza `image_url`.
- Importação da agenda via migração de dados (INSERT) em `trips` + `departures`, reaproveitando `activities` existentes e criando as que faltarem.
- Admin: criação do usuário via Auth Admin (server function protegida, executada uma vez) e inserção do papel `admin` em `user_roles`.
- Navegação: remover o item `/admin` de `src/components/app-shell.tsx`.
- Câmbio: nova coluna/campo JSON em `site_settings` (`fx_usd`, `fx_eur`, `fx_updated_at`), atualizada por server function pública de leitura de cotação; helper `formatPrice` ganha variantes de moeda.
