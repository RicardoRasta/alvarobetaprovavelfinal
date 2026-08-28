# Corrigir envio de fotos nos comentários

## O problema (confirmado)

As regras do armazenamento de imagens só permitem envio por **administradores logados**. Quem visita o site (visitante anônimo) tenta enviar a foto do depoimento e o envio é recusado — aparece apenas "Não foi possível enviar a foto".

## Solução

Criar um caminho de envio próprio para depoimentos, feito no servidor, com validação:

1. Nova função de servidor que recebe a foto do visitante e a grava no armazenamento com credencial privilegiada (o visitante nunca recebe chave nenhuma).
2. Validações no servidor: apenas imagens (JPEG, PNG, WebP), tamanho máximo de 5 MB, no máximo 5 fotos por depoimento, nome de arquivo gerado pelo servidor com prefixo `depoimento/`.
3. A página de comentários passa a usar essa função em vez do envio direto.
4. Mensagens de erro claras para o visitante: "Arquivo muito grande (máx. 5 MB)", "Formato não suportado", etc.
5. As fotos continuam sendo exibidas pela rota de imagens já existente, e o depoimento segue precisando de aprovação no painel antes de aparecer no site.

## Detalhes técnicos

- Novo `src/lib/testimonial-upload.functions.ts`: `createServerFn({ method: "POST" })` recebendo `FormData`, validando tipo/tamanho, carregando `@/integrations/supabase/client.server` dentro do handler e gravando em `trip-images` no prefixo `depoimento/`. Retorna o caminho público `/api/public/img/depoimento/...`.
- `src/routes/comentarios.tsx`: `addPhoto` passa a chamar essa função (via `useServerFn`) em vez de `uploadFile`; `uploadFile` continua igual para o admin.
- Sem mudanças nas políticas do armazenamento (o envio anônimo direto continua bloqueado).
