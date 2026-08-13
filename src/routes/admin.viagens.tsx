import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatPrice, tripImage, type Departure, type Trip } from "@/data/trips";
import { activitiesQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/viagens")({
  component: AdminTrips,
});

type FormDeparture = {
  id?: string;
  date: string;
  return_date: string;
  spots: string;
};

type Form = {
  slug: string;
  name: string;
  destination: string;
  state: string;
  activity_id: string;
  price: string;
  old_price: string;
  days: string;
  level: string;
  image_url: string;
  description: string;
  highlights: string;
  includes: string;
  rating: string;
  featured: boolean;
  published: boolean;
  departures: FormDeparture[];
};

const emptyDeparture: FormDeparture = {
  date: "",
  return_date: "",
  spots: "10",
};

const empty: Form = {
  slug: "",
  name: "",
  destination: "",
  state: "",
  activity_id: "",
  price: "",
  old_price: "",
  days: "1",
  level: "Iniciante",
  image_url: "",
  description: "",
  highlights: "",
  includes: "",
  rating: "5",
  featured: false,
  published: true,
  departures: [],
};

const toForm = (t: Trip): Form => ({
  slug: t.slug,
  name: t.name,
  destination: t.destination,
  state: t.state,
  activity_id: t.activity_id ?? "",
  price: String(t.price),
  old_price: t.old_price == null ? "" : String(t.old_price),
  days: String(t.days),
  level: t.level,
  image_url: t.image_url ?? "",
  description: t.description,
  highlights: (t.highlights ?? []).join("\n"),
  includes: (t.includes ?? []).join("\n"),
  rating: String(t.rating),
  featured: t.featured,
  published: t.published,
  departures: (t.departures ?? []).map((d) => ({
    id: d.id,
    date: d.date,
    return_date: d.return_date ?? "",
    spots: String(d.spots),
  })),
});

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const storageUrl = (path: string) => {
  const base = import.meta.env.VITE_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/trip-images/${path}`;
};

function AdminTrips() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const qc = useQueryClient();

  const formRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["trips"] });

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const setDep = (idx: number, patch: Partial<FormDeparture>) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.departures];
      next[idx] = { ...next[idx], ...patch };
      return { ...f, departures: next };
    });

  const addDep = () => setForm((f) => (f ? { ...f, departures: [...f.departures, { ...emptyDeparture }] } : f));

  const removeDep = (idx: number) =>
    setForm((f) => (f ? { ...f, departures: f.departures.filter((_, i) => i !== idx) } : f));

  const openNew = () => {
    setEditing("new");
    setForm({ ...empty });
  };

  const openEdit = (t: Trip) => {
    setEditing(t.id);
    setForm(toForm(t));
  };

  useEffect(() => {
    if (form && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [form]);

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    setUploading(true);
    const { error } = await supabase.storage.from("trip-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    set("image_url", storageUrl(path));
    toast.success("Imagem enviada!");
  };

  const removeImage = () => {
    set("image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.price) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    setSaving(true);

    const slug = form.slug.trim() || slugify(form.name);
    const tripPayload = {
      slug,
      name: form.name.trim(),
      destination: form.destination.trim(),
      state: form.state.trim(),
      activity_id: form.activity_id || null,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      days: Number(form.days) || 1,
      level: form.level,
      image_url: form.image_url.trim() || null,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      rating: Number(form.rating) || 5,
      featured: form.featured,
      published: form.published,
    };

    let tripId = editing!;
    if (editing === "new") {
      const { data, error } = await supabase.from("trips").insert(tripPayload).select("id").single();
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
      tripId = data.id;
    } else {
      const { error } = await supabase.from("trips").update(tripPayload).eq("id", editing!);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }

    const originalIds = editing === "new" ? [] : (trips.find((t) => t.id === editing)?.departures ?? []).map((d) => d.id);
    const keptIds = form.departures.map((d) => d.id).filter(Boolean) as string[];
    const toDelete = originalIds.filter((id) => !keptIds.includes(id));

    if (toDelete.length > 0) {
      const { error } = await supabase.from("departures").delete().in("id", toDelete);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }

    const newDepartures = form.departures
      .filter((d) => !d.id && d.date)
      .map((d) => ({
        trip_id: tripId,
        date: d.date,
        return_date: d.return_date || null,
        spots: Number(d.spots) || 0,
      }));

    if (newDepartures.length > 0) {
      const { error } = await supabase.from("departures").insert(newDepartures);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }

    const updatedDepartures = form.departures
      .filter((d) => d.id && d.date)
      .map((d) => ({
        id: d.id,
        trip_id: tripId,
        date: d.date,
        return_date: d.return_date || null,
        spots: Number(d.spots) || 0,
      }));

    for (const d of updatedDepartures) {
      const { error } = await supabase.from("departures").update(d).eq("id", d.id);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }

    setSaving(false);
    toast.success("Roteiro salvo!");
    setEditing(null);
    setForm(null);
    refresh();
  };

  const remove = async (id: string) => {
    const { error: depError } = await supabase.from("departures").delete().eq("trip_id", id);
    if (depError) return toast.error(depError.message);
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Roteiro excluído.");
    refresh();
  };

  const field = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase">Catálogo de roteiros</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> Nova viagem
        </button>
      </div>

      {form && (
        <section ref={formRef} className="card-surface space-y-5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase">
              {editing === "new" ? "Nova viagem" : "Editar viagem"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setEditing(null);
              }}
              className="text-muted-foreground hover:text-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Nome do roteiro</span>
              <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>URL da página</span>
              <input
                className={field}
                value={form.slug}
                placeholder={slugify(form.name)}
                onChange={(e) => set("slug", e.target.value)}
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                Endereço final: /viagens/{form.slug.trim() || slugify(form.name) || "nome-do-roteiro"}
              </span>
            </label>
            <label>
              <span className={labelCls}>Destino</span>
              <input className={field} value={form.destination} onChange={(e) => set("destination", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Estado</span>
              <input className={field} value={form.state} onChange={(e) => set("state", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Atividade</span>
              <select className={field} value={form.activity_id} onChange={(e) => set("activity_id", e.target.value)}>
                <option value="">Sem categoria</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Nível</span>
              <select className={field} value={form.level} onChange={(e) => set("level", e.target.value)}>
                {["Iniciante", "Intermediário", "Avançado"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Preço por pessoa (R$)</span>
              <input className={field} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Preço antigo (opcional)</span>
              <input className={field} type="number" value={form.old_price} onChange={(e) => set("old_price", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Duração (dias)</span>
              <input className={field} type="number" value={form.days} onChange={(e) => set("days", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Avaliação (0 a 5)</span>
              <input className={field} type="number" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </label>

            <div className="sm:col-span-2">
              <span className={labelCls}>Imagem do roteiro</span>
              <div className="flex flex-col gap-3 rounded-md border border-input bg-card p-3 sm:flex-row sm:items-center">
                {form.image_url ? (
                  <div className="relative h-28 w-full overflow-hidden rounded-md sm:w-40">
                    <img
                      src={form.image_url}
                      alt="Pré-visualização do roteiro"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted sm:w-40">
                    <span className="text-xs text-muted-foreground">Sem imagem</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Enviando..." : form.image_url ? "Trocar imagem" : "Enviar imagem"}
                  </button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Envie uma foto do roteiro direto do seu computador. Formatos: JPG, PNG, WebP.
                  </p>
                </div>
              </div>
            </div>

            <label className="sm:col-span-2">
              <span className={labelCls}>Descrição</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
            <label>
              <span className={labelCls}>Destaques (um por linha)</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.highlights}
                onChange={(e) => set("highlights", e.target.value)}
              />
            </label>
            <label>
              <span className={labelCls}>Incluso (um por linha)</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.includes}
                onChange={(e) => set("includes", e.target.value)}
              />
            </label>
          </div>

          <div className="card-surface space-y-3 rounded-lg border border-border bg-secondary/40 p-4">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">Visibilidade</h4>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <span className="font-semibold">Destacar na home</span>
                <span className="block text-xs text-muted-foreground">
                  Exibe o roteiro na seção "Roteiros em destaque" da página inicial.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <span className="font-semibold">Publicado no site</span>
                <span className="block text-xs text-muted-foreground">
                  Roteiros não publicados ficam como rascunho e não aparecem para visitantes.
                </span>
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">Saídas</h4>
              <button
                type="button"
                onClick={addDep}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar saída
              </button>
            </div>

            {form.departures.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma saída cadastrada. Adicione datas para o roteiro aparecer nas listas.
              </p>
            ) : (
              <div className="space-y-2">
                {form.departures.map((d, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-input bg-card p-3">
                    <label className="flex-1 min-w-[140px]">
                      <span className={labelCls}>Data de ida</span>
                      <input
                        type="date"
                        className={field}
                        value={d.date}
                        onChange={(e) => setDep(i, { date: e.target.value })}
                      />
                    </label>
                    <label className="flex-1 min-w-[140px]">
                      <span className={labelCls}>Data de volta (opcional)</span>
                      <input
                        type="date"
                        className={field}
                        value={d.return_date}
                        onChange={(e) => setDep(i, { return_date: e.target.value })}
                      />
                    </label>
                    <label className="w-28">
                      <span className={labelCls}>Vagas</span>
                      <input
                        type="number"
                        className={field}
                        value={d.spots}
                        onChange={(e) => setDep(i, { spots: e.target.value })}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeDep(i)}
                      className="mb-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar roteiro"}
          </button>
        </section>
      )}

      <div className="grid gap-4">
        {trips.map((t) => (
          <article key={t.id} className="card-surface flex flex-col gap-4 p-4 sm:flex-row">
            <img
              src={tripImage(t)}
              alt={t.name}
              width={160}
              height={120}
              className="h-28 w-full rounded-md object-cover sm:w-40"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold uppercase">{t.name}</h3>
                {!t.published && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">rascunho</span>
                )}
                {t.featured && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">destaque</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t.destination} · {t.state} · {t.days} dias · {formatPrice(t.price)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {(t.departures ?? []).map((d) => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {formatDate(d.date)}
                    {d.return_date && d.return_date !== d.date && ` → ${formatDate(d.return_date)}`}
                    · {d.spots} vagas
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <button
                type="button"
                onClick={() => openEdit(t)}
                className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-accent hover:text-accent"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
