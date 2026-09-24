-- Importa os depoimentos publicados na página antiga:
-- https://www.casadeaventura.com.br/curso-introducao-ao-montanhismo/
-- O texto e os nomes abaixo foram transcritos da seção "O QUE NOSSOS CLIENTES DIZEM SOBRE O CURSO".
-- Não foram inventadas datas: activity_date fica NULL quando a página não informa uma data completa.
-- rating=5 é apenas o valor padrão exigido pelo sistema novo; a página antiga não informa uma nota em estrelas nos trechos importados.

DO $$
DECLARE
  v_trip_name text := 'Curso Introdução ao Montanhismo';
BEGIN
  INSERT INTO public.testimonials (id, name, trip_name, rating, comment, photos, approved, activity_date)
  SELECT gen_random_uuid(), x.name, v_trip_name, 5, x.comment, x.photos, true, x.activity_date
  FROM (
    VALUES
      (
        'Letícia Marina dos Santos',
        'O curso é incrível Superou minhas expectativas com toda certeza! É um curso com bastante teoria e muitas informações que eu não tinha ideia, realmente uma experiência de muito aprendizado junto à prática na natureza. Equipe com profissionais excelentes, que nos deram todo apoio necessário durante todo tempo, sempre nos fazendo superar nossas capacidades!',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Leticia-Marina-dos-Santos.jpg?fit=1000%2C1000&ssl=1'],
        NULL::date
      ),
      (
        'Manuela Satake',
        'Participei do curso de Introdução ao Montanhismo. Mesmo fazendo montanhismo há algum tempo pude aprender a utilização correta dos equipamentos, alimentação no trekking, dejetos, entre outros. Os instrutores tem muita experiência e souberam repassar o conhecimento de forma clara, além da ótima receptividade, organização e simpatia.',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Cliente-ManuelaSatake.jpg?fit=150%2C150&ssl=1'],
        NULL::date
      ),
      (
        'André Fernando Zen',
        'Sou cliente da loja a alguns anos e recentemente fiz um dos cursos que eles oferecem. Minha avaliação sobre a loja é a mais positiva o possível. Além de oferecem produtos das melhores marcas que existem no mercado no segmento de aventura a bons preços, o pós venda é muito bom. Já cheguei a ter problema com produto que veio com defeito de fábrica, e a loja resolveu meu problema de maneira muito rápida e tranquila.
O atendimento da loja conta com profissionais da área de aventura, que trabalham com cursos e expedições, então estão sempre prontos para mostrar os benefícios e usos de cada produto da loja. Também oferecem cursos muito completos. Desde o básico para iniciantes até níveis mais avançados. Enfim, vale a pena dar uma passada na loja ou visitar seu site. Se tratando de aventura, é o local certo!',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Cliente-AndreFernandoZen.png?fit=207%2C212&ssl=1'],
        NULL::date
      ),
      (
        'Francine Martins',
        'Curso muito prático, instrutores atenciosos e repassam as informações de forma clara e objetiva, lugar sensacional!!!',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Cliente-FrancineMartins.png?fit=222%2C225&ssl=1'],
        NULL::date
      ),
      (
        'Joici Cassiani Lagemann',
        'Realizamos o Curso de Introdução ao Montanhismo com o Álvaro e foi muito esclarecedor. Para quem está iniciando no mundo das trilhas super recomendo, o curso é prático e teórico. O local escolhido (Soldados de Sebold) na Serra catarinense foi perfeito.',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/curso-introducao-ao-montanhismo-feedback-joici.jpg?fit=1000%2C1000&ssl=1'],
        NULL::date
      ),
      (
        'João Gabriel Basbosa Nóbrega',
        'Foi uma experiencia ótima, muito aprendizado. Uma das partes mais interessantes do curso é quando é apresentado todo material de cozinha, mochilas e as barracas, uma experiência ótima o curso com o Álvaro.',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/curso-introducao-ao-montanhismo-feedback-joao.jpg?fit=1000%2C1000&ssl=1'],
        NULL::date
      ),
      (
        'Flávio Paganini',
        'Incrível! Fiz o curso de Introdução ao Montanhismo com o instrutor Álvaro, no Refúgio Soldados Sebold. O curso foi muito bem planejado para pessoas iniciantes, e conta com conteúdos teóricos e práticos. Foi fornecido todo o equipamento necessário. Foi uma experiência muito bacana, e o Álvaro é, além de um baita guia, um cara muito gente boa. Recomendo.',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Feedback-Site-Flavio.jpg?fit=1000%2C1000&ssl=1'],
        NULL::date
      ),
      (
        'Claudia Yukie Kawamura',
        'Experiência que vale muito a pena! Realizei o Curso de Montanhismo no mês de maio e foi uma experiência maravilhosa. Aprendi sobre uma prática que quero iniciar e que para isso eu precisava de instrução adequada. O Alvaro, que foi nosso instrutor, é um cara super bacana e compartilhou conosco de uma forma leve e ao mesmo tempo responsável a sua experiência e conhecimento. A paisagem do soldados Sebold é incrível e deixou a experiência perfeita.',
        ARRAY['https://i0.wp.com/www.casadeaventura.com.br/wp-content/uploads/2016/04/Feedback-Site-Claudia.jpg?fit=1000%2C1000&ssl=1'],
        NULL::date
      )
  ) AS x(name, comment, photos, activity_date)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.testimonials t
    WHERE lower(trim(t.name)) = lower(trim(x.name))
      AND lower(trim(t.comment)) = lower(trim(x.comment))
  );
END $$;
