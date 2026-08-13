import { createFileRoute } from "@tanstack/react-router";

/**
 * Serve as imagens guardadas no armazenamento (bucket privado) para o site público.
 * O navegador não consegue enviar chaves em uma tag <img>, então o servidor busca
 * o arquivo e devolve o conteúdo.
 */
export const Route = createFileRoute("/api/public/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const base = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
        if (!base || !key) return new Response("Not configured", { status: 500 });

        const upstream = await fetch(
          `${base}/storage/v1/object/trip-images/${path.split("/").map(encodeURIComponent).join("/")}`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        );
        if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

        return new Response(upstream.body, {
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
