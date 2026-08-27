import { supabase } from "@/integrations/supabase/client";

/** Envia um arquivo ao armazenamento e devolve o endereço interno para exibição. */
export async function uploadFile(file: File, prefix = "arquivo"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("trip-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return `/api/public/img/${path}`;
}
