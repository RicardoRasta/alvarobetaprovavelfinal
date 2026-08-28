import { createServerFn } from "@tanstack/react-start";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/** Envia a foto de um depoimento (visitante anônimo) com validação no servidor. */
export const uploadTestimonialPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Envio inválido.");
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Nenhum arquivo recebido.");
    if (!ALLOWED.includes(file.type)) throw new Error("Formato não suportado. Use JPG, PNG ou WebP.");
    if (file.size > MAX_BYTES) throw new Error("Arquivo muito grande (máx. 5 MB).");
    return { file };
  })
  .handler(async ({ data }) => {
    const { file } = data;
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `depoimento/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("trip-images")
      .upload(path, new Uint8Array(await file.arrayBuffer()), {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw new Error("Não foi possível enviar a foto. Tente novamente.");

    return { url: `/api/public/img/${path}` };
  });
