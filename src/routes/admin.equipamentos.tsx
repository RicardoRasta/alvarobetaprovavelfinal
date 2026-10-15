import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type MediaItem = { url: string; type: "image" | "video" };
type RentalEquipment = {
  id: string;
  name: string;
  description: string;
  daily_price: number;
  image_url: string | null;
  media?: MediaItem[] | null;
  available: boolean;
  sort_order: number;
};

type Form = { name: string; description: string; daily_price: string; image_url: string; media: MediaItem[]; available: boolean; sort_order: string };
const emptyForm: Form = { name: "", description: "", daily_price: "0", image_url: "", media: [], available: true, sort_order: "0" };
const inputClass = "w-full min-w-0 rounded-xl border border-input bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring";

export const Route = createFileRoute("/admin/equipamentos")({ component: AdminEquipmentPage });

function AdminEquipmentPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ["equipment_rentals_admin"],
    queryFn: async (): Promise<RentalEquipment[]> => {
      const { data, error } = await supabase.from("equipment_rentals").select("*").order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []) as RentalEquipment[];
    },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [saving, setSaving] = useState(false);\n  const [mediaUploading, setMediaUploading] = useState(false);\n  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return;
    const item = items.find((x) => x.id === editingId);
    if (item) {
      const media = Array.isArray(item.media) && item.media.length
        ? item.media
        : item.image_url ? [{ url: item.image_url, type: "image" as const }] : [];
      setForm({ name: item.name, description: item.description ?? "", daily_price: String(item.daily_price ?? 0), image_url: item.image_url ?? "", media, available: item.available, sort_order: String(item.sort_order ?? 0) });
    }
  }, [editingId, items]);

  const startNew = () => { setEditingId("new"); setForm(emptyForm); };
  const uploadMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    const chosen = Array.from(files);
    if (form.media.length + chosen.length > 8) {
      toast.error("Você pode adicionar no máximo 8 fotos ou vídeos por equipamento.");
      if (mediaInputRef.current) mediaInputRef.current.value = "";
      return;
    }
    const allowed = chosen.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
    if (allowed.length !== chosen.length) {
      toast.error("Escolha apenas fotos ou vídeos.");
      return;
    }
    if (chosen.some((file) => file.size > 50 * 1024 * 1024)) {
      toast.error("Cada foto ou vídeo pode ter no máximo 50 MB.");
      return;
    }
    setMediaUploading(true);
    try {
      const uploaded: MediaItem[] = [];
      for (const file of chosen) {
        const ext = file.name.split(".").pop()?.toLowerCase() || (file.type.startsWith("video/") ? "mp4" : "jpg");
        const path = `equipamentos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("trip-images").upload(path, file, {
          contentType: file.type, cacheControl: "3600", upsert: false,
        });
        if (error) throw error;
        const base = import.meta.env["VITE_SUPABASE_URL"] || "";
        if (!base) throw new Error("URL do armazenamento não configurada.");
        uploaded.push({ url: `${base.replace(/\\/$/, "")}/storage/v1/object/public/trip-images/${path.split("/").map(encodeURIComponent).join("/")}`, type: file.type.startsWith("video/") ? "video" : "image" });
      }
      setForm((current) => ({ ...current, media: [...current.media, ...uploaded].slice(0, 8), image_url: current.image_url || uploaded.find((m) => m.type === "image")?.url || uploaded[0]?.url || "" }));
      toast.success("Foto(s)/vídeo(s) enviados. Salve o equipamento para publicar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a mídia.");
    } finally {
      setMediaUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setForm((current) => {
      const media = current.media.filter((_, i) => i !== index);
      return { ...current, media, image_url: media.find((m) => m.type === "image")?.url || media[0]?.url || "" };
    });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Informe o nome do equipamento.");
    const price = Number(form.daily_price);
    if (!Number.isFinite(price) || price < 0) return toast.error("Informe um preço válido.");
    setSaving(true);
    const payload = { name: form.name.trim(), description: form.description.trim(), daily_price: price, image_url: form.media.find((m) => m.type === "image")?.url || form.image_url.trim() || form.media[0]?.url || null, media: form.media, available: form.available, sort_order: Number(form.sort_order) || 0, updated_at: new Date().toISOString() };
    const result = editingId === "new"
      ? await supabase.from("equipment_rentals").insert(payload)
      : await supabase.from("equipment_rentals").update(payload).eq("id", editingId);
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(editingId === "new" ? "Equipamento cadastrado!" : "Equipamento atualizado!");
    setEditingId(null); setForm(emptyForm);
    await qc.invalidateQueries({ queryKey: ["equipment_rentals_admin"] });
    await qc.invalidateQueries({ queryKey: ["equipment_rentals_public"] });
  };
  const remove = async (item: RentalEquipment) => {
    if (!window.confirm(`Excluir o equipamento “${item.name}”?`)) return;
    const { error } = await supabase.from("equipment_rentals").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Equipamento excluído.");
    await qc.invalidateQueries({ queryKey: ["equipment_rentals_admin"] });
    await qc.invalidateQueries({ queryKey: ["equipment_rentals_public"] });
  };

  return <div className="space-y-5">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="text-2xl font-extrabold sm:text-3xl">Aluguel de equipamentos</h2><p className="mt-1 text-sm text-muted-foreground">Cadastre e edite o catálogo que aparece para os clientes. Esta tela foi preparada para celular.</p></div>
      <button type="button" onClick={startNew} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground"><Plus className="h-4 w-4" /> Novo equipamento</button>
    </header>

    {editingId && <form onSubmit={save} className="card-surface grid gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold">{editingId === "new" ? "Cadastrar equipamento" : "Editar equipamento"}</h3><button type="button" aria-label="Cancelar edição" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-full border border-border p-2"><X className="h-4 w-4" /></button></div>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold">Nome *</span><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={120} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold">Descrição</span><textarea className={inputClass + " min-h-28"} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold">Preço por dia (R$)</span><input className={inputClass} type="number" min="0" step="0.01" value={form.daily_price} onChange={(e) => setForm({ ...form, daily_price: e.target.value })} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Ordem no catálogo</span><input className={inputClass} type="number" step="1" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></label></div>
      <div className="space-y-3">
        <div><span className="mb-1.5 block text-sm font-semibold">Fotos e vídeos do equipamento (até 8)</span>
          <p className="mb-3 text-xs text-muted-foreground">Selecione fotos ou vídeos diretamente do celular ou computador. Cada arquivo pode ter até 50 MB.</p>
          <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => uploadMedia(e.target.files)} />
          <button type="button" disabled={mediaUploading || form.media.length >= 8} onClick={() => mediaInputRef.current?.click()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold disabled:opacity-50">
            <ImagePlus className="h-4 w-4" /> {mediaUploading ? "Enviando arquivos..." : "Escolher fotos ou vídeos"}
          </button>
        </div>
        {form.media.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {form.media.map((media, index) => <div key={media.url} className="relative min-w-0 rounded-xl border border-border p-2">
            {media.type === "video" ? <video src={media.url} controls playsInline className="aspect-video w-full rounded-lg object-contain" /> : <img src={media.url} alt={`Foto ${index + 1} de ${form.name || "equipamento"}`} className="aspect-video w-full rounded-lg object-contain" />}
            <div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{media.type === "video" ? "Vídeo" : "Foto"} {index + 1}</span><button type="button" onClick={() => removeMedia(index)} className="rounded-lg border border-destructive/30 p-2 text-destructive" aria-label="Remover mídia"><Trash2 className="h-4 w-4" /></button></div>
          </div>)}
        </div>}
        {form.media.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma foto ou vídeo adicionado ainda.</p>}
      </div>
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border p-3 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-5 w-5" /> Disponível para aparecer no site</label>
      <div className="flex flex-col gap-2 sm:flex-row"><button disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-accent-foreground disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Salvando..." : "Salvar equipamento"}</button><button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="min-h-12 rounded-xl border border-border px-5 py-3 text-sm font-semibold">Cancelar</button></div>
    </form>}

    {isLoading ? <p className="py-10 text-center text-muted-foreground">Carregando...</p> : error ? <p className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">Erro ao carregar catálogo: {(error as Error).message}</p> : items.length === 0 ? <div className="card-surface p-8 text-center"><ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-semibold">Nenhum equipamento cadastrado</p><p className="mt-1 text-sm text-muted-foreground">Use “Novo equipamento” para começar.</p></div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.id} className="card-surface flex min-w-0 gap-3 p-3 sm:flex-col sm:p-4">{(item.media?.[0]?.url || item.image_url) ? ((item.media?.[0]?.type === "video") ? <video src={item.media?.[0]?.url || item.image_url || ""} controls playsInline className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-40 sm:w-full" /> : <img src={item.media?.[0]?.url || item.image_url || ""} alt={item.name} className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-40 sm:w-full" />) : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-secondary sm:h-40 sm:w-full"><ImagePlus className="h-7 w-7 text-muted-foreground" /></div>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{item.name}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.available ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{item.available ? "Publicado" : "Oculto"}</span></div><p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{item.description || "Sem descrição"}</p><p className="mt-2 text-sm font-bold text-accent">{Number(item.daily_price) > 0 ? `R$ ${Number(item.daily_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/dia` : "Preço sob consulta"}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setEditingId(item.id)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold"><Pencil className="h-3.5 w-3.5" /> Editar</button><button type="button" onClick={() => remove(item)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-destructive/30 px-3 text-xs font-semibold text-destructive"><Trash2 className="h-3.5 w-3.5" /> Excluir</button></div></div></article>)}</div>}
  </div>;
}
