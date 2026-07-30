import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatPrice, tripImage, type Trip } from "@/data/trips";
import { activitiesQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/viagens")({
  component: AdminTrips,
});

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
});

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function AdminTrips() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const qc = useQueryClient();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [depDate, setDepDate] = useState("");
  const [depSpots, setDepSpots] = useState("10");
  const [depTrip, setDepTrip] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["trips"] });

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const openNew = () => {
    setEditing("new");
    setForm({ ...empty });
  };

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.price) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    setSaving(true);
    const payload = {
      slug: form.slug.trim() || slugify(form.name),
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
    const { error } =
      editing === "new"
        ? await supabase.from("trips").insert(payload)
        : await supabase.from("trips").update(payload).eq("id", editing!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Roteiro salvo!");
    setEditing(null);
    setForm(null);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Roteiro excluído.");
    refresh();
  };

  const addDeparture = async (tripId: string) => {
    if (!depDate) return toast.error("Escolha uma data.");
    const { error } = await supabase
      .from("departures")
      .insert({ trip_id: tripId, date: depDate, spots: Number(depSpots) || 0 });
    if (error) return toast.error(error.message);
    setDepDate("");
    setDepTrip(null);
    refresh();
  };

  const removeDeparture = async (id: string) => {
    const { error } = await supabase.from("departures").delete().eq("id", id);
    if (error) return toast.error(error.message);
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
        <section className="card-surface space-y-4 p-5">
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
              <span className={labelCls}>Slug (URL)</span>
              <input
                className={field}
                value={form.slug}
                placeholder={slugify(form.name)}
                onChange={(e) => set("slug", e.target.value)}
              />
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
            <label className="sm:col-span-2">
              <span className={labelCls}>URL da imagem</span>
              <input
                className={field}
                value={form.image_url}
                placeholder="https://..."
                onChange={(e) => set("image_url", e.target.value)}
              />
            </label>
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

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              Destacar na home
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
              Publicado no site
            </label>
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
                    {formatDate(d.date)} · {d.spots} vagas
                    <button type="button" onClick={() => removeDeparture(d.id)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {depTrip === t.id ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <input
                      type="date"
                      value={depDate}
                      onChange={(e) => setDepDate(e.target.value)}
                      className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                    />
                    <input
                      type="number"
                      value={depSpots}
                      onChange={(e) => setDepSpots(e.target.value)}
                      className="h-8 w-20 rounded-md border border-input bg-card px-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => addDeparture(t.id)}
                      className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                    >
                      Adicionar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDepTrip(t.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:border-accent hover:text-accent"
                  >
                    <Plus className="h-3 w-3" /> saída
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <button
                type="button"
                onClick={() => {
                  setEditing(t.id);
                  setForm(toForm(t));
                }}
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
