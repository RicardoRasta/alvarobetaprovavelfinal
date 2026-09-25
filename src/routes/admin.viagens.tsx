import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  formatDate,
  formatPrice,
  tripImage,
  type Departure,
  type ItineraryDay,
  type TechSheetItem,
  type Trip,
} from "@/data/trips";
import { activitiesQuery, tagsQuery, tripsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/viagens")({
  component: AdminTrips,
});

type FormDeparture = {
  id?: string;
  date: string;
  return_date: string;
  spots: string;
  meeting_point: string;
};

type Form = {
  slug: string;
  name: string;
  destination: string;
  state: string;
  activity_id: string;
  price: string;
  price_on_request: boolean;
  old_price: string;
  price_usd: string;
  investment_text: string;
  cancellation_policy: string;
  days: string;
  level: string;
  images: string[];
  video_url: string;
  tags: string[];
  description: string;
  highlights: string;
  includes: string;
  rating: string;
  featured: boolean;
  published: boolean;
  departures: FormDeparture[];
  tech_sheet: TechSheetItem[];
  guide_text: string;
  guide_image_url: string;
  destination_text: string;
  prerequisites: string[];
  characteristics: string;
  climate: string;
  food: string;
  itinerary: ItineraryDay[];
  not_included: string[];
  checklist: string[];
  equipment: string[];
};

const emptyDeparture: FormDeparture = {
  date: "",
  return_date: "",
  spots: "10",
  meeting_point: "",
};

const empty: Form = {
  slug: "",
  name: "",
  destination: "",
  state: "",
  activity_id: "",
  price: "",
  price_on_request: false,
  old_price: "",
  price_usd: "",
  investment_text: "",
  cancellation_policy: "",
  days: "1",
  level: "Iniciante",
  images: [],
  video_url: "",
  tags: [],
  description: "",
  highlights: "",
  includes: "",
  rating: "5",
  featured: false,
  published: true,
  departures: [],
  tech_sheet: [],
  guide_text: "",
  guide_image_url: "",
  destination_text: "",
  prerequisites: [],
  characteristics: "",
  climate: "",
  food: "",
  itinerary: [],
  not_included: [],
  checklist: [],
  equipment: [],
};

const toForm = (t: Trip): Form => ({
  slug: t.slug,
  name: t.name,
  destination: t.destination,
  state: t.state,
  activity_id: t.activity_id ?? "",
  price: t.price > 0 ? String(t.price) : "",
  price_on_request: !t.price || t.price <= 0,
  old_price: t.old_price == null ? "" : String(t.old_price),
  price_usd: t.price_usd == null ? "" : String(t.price_usd),
  investment_text: t.investment_text ?? "",
  cancellation_policy: t.cancellation_policy ?? "",
  days: String(t.days),
  level: t.level,
  images:
    (t.images ?? []).filter(Boolean).length > 0
      ? (t.images ?? []).filter(Boolean)
      : t.image_url
        ? [t.image_url]
        : [],
  video_url: t.video_url ?? "",
  tags: t.tags ?? [],
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
    meeting_point: d.meeting_point ?? "",
  })),
  tech_sheet: (t.tech_sheet ?? []).map((i) => ({ label: i.label ?? "", value: i.value ?? "" })),
  guide_text: t.guide_text ?? "",
  guide_image_url: t.guide_image_url ?? "",
  destination_text: t.destination_text ?? "",
  prerequisites: t.prerequisites ?? [],
  characteristics: t.characteristics ?? "",
  climate: t.climate ?? "",
  food: t.food ?? "",
  itinerary: (t.itinerary ?? []).map((d) => ({ title: d.title ?? "", description: d.description ?? "" })),
  not_included: t.not_included ?? [],
  checklist: t.checklist ?? [],
  equipment: t.equipment ?? [],
});


const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const storageUrl = (path: string) => {
  const base = import.meta.env["VITE_SUPABASE_URL"] || "";
  return base
    ? `${base.replace(/\\/$/, "")}/storage/v1/object/public/trip-images/${path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`
    : `/api/public/img/${path}`;
};


const MAX_IMAGES = 8;

const cleanList = (list: string[]) => list.map((s) => s.trim()).filter(Boolean);

const fieldCls =
  "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const areaCls =
  "min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const label2 = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

/** Bloco recolhível para organizar as seções longas do formulário. */
function Block({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-lg border border-border bg-secondary/30 p-4">
      <summary className="cursor-pointer text-xs font-bold uppercase text-muted-foreground">
        {title}
      </summary>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

/** Editor de lista simples: uma linha por item, com reordenar e remover. */
function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={fieldCls}
            value={v}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1 text-xs disabled:opacity-40" aria-label="Subir">
            ↑
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="px-1 text-xs disabled:opacity-40" aria-label="Descer">
            ↓
          </button>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remover item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Adicionar item
      </button>
    </div>
  );
}

/** Editor de pares rótulo/valor (ficha técnica). */
function PairEditor({
  items,
  onChange,
}: {
  items: TechSheetItem[];
  onChange: (next: TechSheetItem[]) => void;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <input
            className={`${fieldCls} sm:w-48 flex-1`}
            placeholder="Item (ex.: Distância)"
            value={it.label}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
          />
          <input
            className={`${fieldCls} flex-1`}
            placeholder="Valor (ex.: 42 km)"
            value={it.value}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
          />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1 text-xs disabled:opacity-40" aria-label="Subir">
            ↑
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="px-1 text-xs disabled:opacity-40" aria-label="Descer">
            ↓
          </button>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remover linha"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", value: "" }])}
        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Adicionar linha
      </button>
    </div>
  );
}

/** Editor da programação dia a dia. */
function ItineraryEditor({
  items,
  onChange,
}: {
  items: ItineraryDay[];
  onChange: (next: ItineraryDay[]) => void;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const t = i + dir;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((d, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-input bg-card p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-muted-foreground">Dia {i + 1}</span>
            <input
              className={`${fieldCls} flex-1`}
              placeholder="Título do dia (ex.: Chegada e aclimatação)"
              value={d.title}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
            />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1 text-xs disabled:opacity-40" aria-label="Subir">
              ↑
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="px-1 text-xs disabled:opacity-40" aria-label="Descer">
              ↓
            </button>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remover dia"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <textarea
            className={areaCls}
            placeholder="O que acontece nesse dia"
            value={d.description}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { title: "", description: "" }])}
        className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Adicionar dia
      </button>
    </div>
  );
}

function AdminTrips() {
  const { data: trips = [] } = useQuery(tripsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const { data: tags = [] } = useQuery(tagsQuery);
  const qc = useQueryClient();

  const formRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGuide, setUploadingGuide] = useState(false);

  /** Envia a foto do guia para o armazenamento e guarda o endereço interno. */
  const uploadGuideImage = async (file: File) => {
    setUploadingGuide(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `guia-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("trip-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploadingGuide(false);
    if (error) {
      toast.error(error.message);
    } else {
      setForm((f) => (f ? { ...f, guide_image_url: storageUrl(path) } : f));
      toast.success("Foto do guia enviada!");
    }
    if (guideInputRef.current) guideInputRef.current.value = "";
  };

  /** Recarrega do banco para confirmar o que ficou gravado. */
  const refresh = () => qc.refetchQueries({ queryKey: ["trips"] });

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
    if (editing && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);


  /** Evita perder o que foi digitado ao fechar/atualizar a aba com o formulário aberto. */
  useEffect(() => {
    if (!form) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form]);

  const uploadImages = async (files: File[]) => {
    const current = form?.images ?? [];
    const room = MAX_IMAGES - current.length;
    if (room <= 0) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens por viagem.`);
      return;
    }
    const selected = files.slice(0, room);
    if (files.length > room) toast.error(`Só cabem mais ${room} imagem(ns).`);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of selected) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("trip-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        toast.error(error.message);
        continue;
      }
      uploaded.push(storageUrl(path));
    }
    setUploading(false);
    if (uploaded.length) {
      setForm((f) => (f ? { ...f, images: [...f.images, ...uploaded].slice(0, MAX_IMAGES) } : f));
      toast.success(uploaded.length > 1 ? "Imagens enviadas!" : "Imagem enviada!");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) =>
    setForm((f) => (f ? { ...f, images: f.images.filter((_, i) => i !== idx) } : f));

  const moveImage = (idx: number, dir: -1 | 1) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.images];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return f;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...f, images: next };
    });

  /** Move a imagem escolhida para a primeira posição (capa da viagem). */
  const setCover = (idx: number) =>
    setForm((f) => {
      if (!f || idx === 0) return f;
      const next = [...f.images];
      const [chosen] = next.splice(idx, 1);
      if (!chosen) return f;
      return { ...f, images: [chosen, ...next] };
    });

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || (!form.price && !form.price_on_request)) {
      toast.error("Informe o nome e o preço (ou marque \u201csob consulta\u201d).");
      return;
    }
    setSaving(true);

    const slug = form.slug.trim() || slugify(form.name);
    const normalizeTagName = (value: string) =>
      value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const selectedTagNames = form.tags
      .map((id) => tags.find((t) => t.id === id)?.name ?? "")
      .map(normalizeTagName)
      .filter(Boolean);
    const isCourse = selectedTagNames.some(
      (name) => name === "cursos" || name.startsWith("curso "),
    );
    const cursosTagId = tags.find((t) => normalizeTagName(t.name) === "cursos")?.id;
    const viagensTagId = tags.find((t) => normalizeTagName(t.name) === "viagens")?.id;
    const normalizedTags = [...form.tags];
    const ensureTag = (id?: string) => {
      if (id && !normalizedTags.includes(id)) normalizedTags.push(id);
    };
    const removeTag = (id?: string) => {
      if (!id) return;
      for (let i = normalizedTags.length - 1; i >= 0; i -= 1) {
        if (normalizedTags[i] === id) normalizedTags.splice(i, 1);
      }
    };
    if (isCourse) {
      removeTag(viagensTagId);
      ensureTag(cursosTagId);
    } else {
      removeTag(cursosTagId);
      ensureTag(viagensTagId);
    }

    const tripPayload = {
      slug,
      name: form.name.trim(),
      destination: form.destination.trim(),
      state: form.state.trim(),
      activity_id: form.activity_id || null,
      price: form.price_on_request ? 0 : Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      price_usd: form.price_usd ? Number(form.price_usd) : null,
      investment_text: form.investment_text.trim() || null,
      cancellation_policy: form.cancellation_policy.trim() || null,
      days: Number(form.days) || 1,
      level: form.level,
      image_url: form.images[0] ?? null,
      images: form.images,
      video_url: form.video_url.trim(),
      tags: normalizedTags,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      rating: Number(form.rating) || 5,
      featured: form.featured,
      published: form.published,
      tech_sheet: form.tech_sheet.filter((i) => i.label.trim() || i.value.trim()),
      guide_text: form.guide_text.trim(),
      guide_image_url: form.guide_image_url.trim() || null,
      destination_text: form.destination_text.trim(),
      prerequisites: cleanList(form.prerequisites),
      characteristics: form.characteristics.trim(),
      climate: form.climate.trim(),
      food: form.food.trim(),
      itinerary: form.itinerary.filter((d) => d.title.trim() || d.description.trim()),
      not_included: cleanList(form.not_included),
      checklist: cleanList(form.checklist),
      equipment: cleanList(form.equipment),
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

    const originalIds: string[] =
      editing === "new" ? [] : (trips.find((t) => t.id === editing)?.departures ?? []).map((d) => d.id);
    const keptIds = form.departures.map((d) => d.id).filter((id): id is string => Boolean(id));
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
        meeting_point: d.meeting_point.trim(),
      }));

    if (newDepartures.length > 0) {
      const { error } = await supabase.from("departures").insert(newDepartures);
      if (error) {
        setSaving(false);
        return toast.error(error.message);
      }
    }

    const updatedDepartures = form.departures
      .filter((d): d is FormDeparture & { id: string } => Boolean(d.id && d.date))
      .map((d) => ({
        id: d.id,
        trip_id: tripId,
        date: d.date,
        return_date: d.return_date || null,
        spots: Number(d.spots) || 0,
        meeting_point: d.meeting_point.trim(),
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

  const field = "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase">Catálogo de roteiros</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
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
            <div>
              <span className={labelCls}>Preço por pessoa (R$)</span>
              <input
                className={field}
                type="number"
                disabled={form.price_on_request}
                placeholder={form.price_on_request ? "Sob consulta" : ""}
                value={form.price_on_request ? "" : form.price}
                onChange={(e) => set("price", e.target.value)}
              />
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.price_on_request}
                  onChange={(e) => set("price_on_request", e.target.checked)}
                />
                <span>Preço sob consulta</span>
              </label>
            </div>
            <label>
              <span className={labelCls}>Preço antigo (opcional)</span>
              <input className={field} type="number" value={form.old_price} onChange={(e) => set("old_price", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Valor em dólares (opcional)</span>
              <input
                className={field}
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex.: 1250"
                value={form.price_usd}
                onChange={(e) => set("price_usd", e.target.value)}
              />
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
              <span className={labelCls}>Vídeo do roteiro (link do YouTube/Vimeo)</span>
              <input
                className={field}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.video_url}
                onChange={(e) => set("video_url", e.target.value)}
              />
            </label>

            <div className="sm:col-span-2">
              <span className={labelCls}>Tags</span>
              {tags.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhuma tag cadastrada ainda — crie na aba Tags.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tg) => {
                    const on = form.tags.includes(tg.id);
                    return (
                      <button
                        key={tg.id}
                        type="button"
                        onClick={() =>
                          setForm((f) =>
                            f
                              ? {
                                  ...f,
                                  tags: on ? f.tags.filter((x) => x !== tg.id) : [...f.tags, tg.id],
                                }
                              : f,
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          on
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                        }`}
                      >
                        {tg.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <span className={labelCls}>Imagens do roteiro (até {MAX_IMAGES})</span>
              <div className="space-y-3 rounded-xl border border-input bg-card p-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {form.images.map((url, idx) => (
                    <div key={url} className="relative overflow-hidden rounded-xl border border-border">
                      <img src={url} alt={`Imagem ${idx + 1}`} className="aspect-square w-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          ★ Capa
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex justify-between bg-background/90 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => moveImage(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Mover para a esquerda"
                          className="px-1 text-xs disabled:opacity-40"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 1)}
                          disabled={idx === form.images.length - 1}
                          aria-label="Mover para a direita"
                          className="px-1 text-xs disabled:opacity-40"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCover(idx)}
                        disabled={idx === 0}
                        className="w-full border-t border-border bg-background px-1 py-1.5 text-[11px] font-semibold text-accent disabled:text-muted-foreground disabled:opacity-70"
                      >
                        {idx === 0 ? "Esta é a capa" : "Definir como capa"}
                      </button>
                    </div>
                  ))}
                  {form.images.length === 0 && (
                    <div className="col-span-2 flex h-28 items-center justify-center rounded-xl border border-dashed border-border bg-muted sm:col-span-5">
                      <span className="text-xs text-muted-foreground">Sem imagens</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) uploadImages(files);
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading || form.images.length >= MAX_IMAGES}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Enviando..." : "Adicionar imagens"}
                  </button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Use “Definir como capa” para escolher a imagem principal (a que aparece nos
                    cards e na home). Formatos: JPG, PNG, WebP.
                  </p>
                </div>
              </div>
            </div>

            <label className="sm:col-span-2">
              <span className={labelCls}>Descrição</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
            <label>
              <span className={labelCls}>Destaques (um por linha)</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.highlights}
                onChange={(e) => set("highlights", e.target.value)}
              />
            </label>
            <label>
              <span className={labelCls}>Incluso (um por linha)</span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={form.includes}
                onChange={(e) => set("includes", e.target.value)}
              />
            </label>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">Conteúdo da página</h4>
            <p className="text-xs text-muted-foreground">
              Preencha só o que fizer sentido — seções vazias não aparecem no site.
            </p>

            <Block title="Ficha técnica" hint="Itens como distância, altitude, duração, grupo...">
              <PairEditor items={form.tech_sheet} onChange={(v) => set("tech_sheet", v)} />
            </Block>

            <Block title="Conheça quem irá lhe conduzir">
              <textarea
                className={areaCls}
                placeholder="Apresentação do guia/condutor"
                value={form.guide_text}
                onChange={(e) => set("guide_text", e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                {form.guide_image_url && (
                  <img
                    src={form.guide_image_url}
                    alt="Foto do guia"
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                )}
                <input
                  ref={guideInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadGuideImage(file);
                  }}
                />
                <button
                  type="button"
                  disabled={uploadingGuide}
                  onClick={() => guideInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingGuide ? "Enviando..." : form.guide_image_url ? "Trocar foto" : "Foto do guia"}
                </button>
                {form.guide_image_url && (
                  <button
                    type="button"
                    onClick={() => set("guide_image_url", "")}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </Block>

            <Block title="Saiba para onde você está indo">
              <textarea
                className={areaCls}
                placeholder="Sobre o destino, região, parque..."
                value={form.destination_text}
                onChange={(e) => set("destination_text", e.target.value)}
              />
            </Block>

            <Block title="Pré-requisitos">
              <ListEditor
                items={form.prerequisites}
                onChange={(v) => set("prerequisites", v)}
                placeholder="Ex.: bom condicionamento físico"
              />
            </Block>

            <Block title="Para quem é este roteiro...">
              <textarea
                className={areaCls}
                value={form.characteristics}
                onChange={(e) => set("characteristics", e.target.value)}
              />
            </Block>

            <Block title="Clima">
              <textarea className={areaCls} value={form.climate} onChange={(e) => set("climate", e.target.value)} />
            </Block>

            <Block title="Alimentação">
              <textarea className={areaCls} value={form.food} onChange={(e) => set("food", e.target.value)} />
            </Block>

            <Block title="Programação (dia a dia)">
              <ItineraryEditor items={form.itinerary} onChange={(v) => set("itinerary", v)} />
            </Block>

            <Block title="Investimento e formas de pagamento" hint="Use este campo para explicar valores, condições e formas de pagamento.">
              <textarea
                className={areaCls}
                placeholder="Ex.: investimento por pessoa, parcelamento, Pix, cartão, transferência..."
                value={form.investment_text}
                onChange={(e) => set("investment_text", e.target.value)}
              />
            </Block>

            <Block title="Política de cancelamento">
              <textarea
                className={areaCls}
                placeholder="Informe aqui as regras de cancelamento deste roteiro."
                value={form.cancellation_policy}
                onChange={(e) => set("cancellation_policy", e.target.value)}
              />
            </Block>

            <Block title="Não inclui">
              <ListEditor
                items={form.not_included}
                onChange={(v) => set("not_included", v)}
                placeholder="Ex.: passagem aérea"
              />
            </Block>

            <Block title="Check list">
              <ListEditor items={form.checklist} onChange={(v) => set("checklist", v)} placeholder="Ex.: documento com foto" />
            </Block>

            <Block title="Equipamentos que você deve levar ou alugar">
              <ListEditor items={form.equipment} onChange={(v) => set("equipment", v)} placeholder="Ex.: mochila de ataque 30L" />
            </Block>
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
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1 text-xs font-medium hover:border-accent hover:text-accent"
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
                  <div key={i} className="flex flex-wrap items-end gap-2 rounded-xl border border-input bg-card p-3">
                    <label className="min-w-0 flex-1 sm:min-w-[140px]">
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
                    <label className="min-w-0 flex-1 sm:min-w-[180px]">
                      <span className={labelCls}>Ponto de saída</span>
                      <input
                        className={field}
                        placeholder="Ex.: Terminal Rodoviário de Joinville"
                        value={d.meeting_point}
                        onChange={(e) => setDep(i, { meeting_point: e.target.value })}
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
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
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
              className="h-28 w-full rounded-xl object-cover sm:w-40"
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
                {t.destination} · {t.state} · {t.days} dias · {t.price > 0 ? formatPrice(t.price) : "Sob consulta"}
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
                className="rounded-xl border border-border px-3 py-1.5 text-xs hover:border-accent hover:text-accent"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
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
