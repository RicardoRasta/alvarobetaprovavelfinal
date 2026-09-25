-- O bucket trip-images contém apenas imagens destinadas à exibição pública
-- do catálogo/roteiros. Torná-lo público elimina a dependência da rota
-- de proxy do servidor, que não existe em hospedagem estática como GitHub Pages.
UPDATE storage.buckets
SET public = true
WHERE id = 'trip-images';
