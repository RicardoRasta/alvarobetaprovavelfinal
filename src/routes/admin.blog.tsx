import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { blogQuery } from "@/lib/api";
import { normalizeImage, type BlogPost } from "@/data/trips";
import { uploadFile } from "@/lib/upload";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlog,
});

const MAX_MEDIA = 10;

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Form = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  videos: string[];
  published: boolean;
  published_at: string;
};

const empty: Form = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  images: [],
  videos: [],
  published: true,
  published_at: new Date().toISOString().slice(0, 10),
};

const field =
  "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const area =
  "min-h-32 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

function AdminBlog() {
  const { data: posts = [] } = useQuery(blogQuery);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["blog_posts"] });
  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const startEdit = (p: BlogPost) => {
    setEditing(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      images: p.images ?? [],
      videos: p.videos ?? [],
      published: p.published,
      published_at: p.published_at.slice(0, 10),
    });
  };

  const uploadImages = async (files: File[]) => {
    if (!form) return;
    const room = MAX_MEDIA - form.images.length;
    if (room <= 0) return toast.error(`Máximo de ${MAX_MEDIA} fotos por post.`);
    setUploading(true);
    const urls: string[] = [];
    for (const file of files.slice(0, room)) {
      try {
        urls.push(await uploadFile(file, "blog"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
    setUploading(false);
    setForm((f) => (f ? { ...f, images: [...f.images, ...urls].slice(0, MAX_MEDIA) } : f));
  };

  const uploadVideos = async (files: File[]) => {
    if (!form) return;
    const room = MAX_MEDIA - form.videos.length;
    if (room <= 0) return toast.error(`Máximo de ${MAX_MEDIA} vídeos por post.`);
    setUploading(true);
    const urls: string[] = [];
    for (const file of files.slice(0, room)) {
      try {
        urls.push(await uploadFile(file, "blog-video"));
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
    setUploading(false);
    setForm((f) => (f ? { ...f, videos: [...f.videos, ...urls].slice(0, MAX_MEDIA) } : f));
  };

  const save = async () => {
    if (!form) return;
    if (!form.title.trim()) return toast.error("Informe o título.");
    setSaving(true);
    const payload = {
      slug: form.slug.trim() || slugify(form.title),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_url: form.images[0] ?? null,
      images: form.images,
      videos: form.videos.filter(Boolean),
      published: form.published,
      published_at: new Date(`${form.published_at}T12:00:00`).toISOString(),
    };
    const { error } =
      editing === "new"
        ? await supabase.from("blog_posts").insert(payload)
        : await supabase.from("blog_posts").update(payload).eq("id", editing!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Post salvo!");
    setEditing(null);
    setForm(null);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post excluído.");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold uppercase">Blog ({posts.length})</h2>
        <button
          type="button"
          onClick={() => {
            setEditing("new");
            setForm({ ...empty });
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> Novo post
        </button>
      </div>

      {form && (
        <section className="card-surface space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={labelCls}>Título</span>
              <input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Endereço (slug)</span>
              <input
                className={field}
                placeholder={slugify(form.title)}
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </label>
            <label>
              <span className={labelCls}>Data de publicação</span>
              <input
                type="date"
                className={field}
                value={form.published_at}
                onChange={(e) => set("published_at", e.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className={labelCls}>Resumo</span>
              <input className={field} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelCls}>Texto completo</span>
              <textarea className={area} value={form.content} onChange={(e) => set("content", e.target.value)} />
            </label>
          </div>

          <div>
            <span className={labelCls}>Fotos (até {MAX_MEDIA})</span>
            <div className="flex flex-wrap gap-2">
              {form.images.map((url, i) => (
                <div key={url} className="relative">
                  <img src={normalizeImage(url)} alt="" className="h-24 w-24 rounded-xl border border-border object-cover" />
                  <button
                    type="button"
                    onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remover foto"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">
              <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Adicionar fotos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) uploadImages(files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div>
            <span className={labelCls}>Vídeos (até {MAX_MEDIA} — arquivos ou links)</span>
            <div className="space-y-2">
              {form.videos.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={field}
                    value={v}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => set("videos", form.videos.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                  <button
                    type="button"
                    onClick={() => set("videos", form.videos.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remover vídeo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => form.videos.length < MAX_MEDIA && set("videos", [...form.videos, ""])}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar link de vídeo
              </button>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent">
                <Upload className="h-3.5 w-3.5" /> Enviar arquivo de vídeo
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) uploadVideos(files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            Publicado (visível no site)
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar post"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(null);
              }}
              className="rounded-xl border border-border px-5 py-2.5 text-sm"
            >
              Cancelar
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-3">
        {posts.map((p) => (
          <article key={p.id} className="card-surface flex flex-wrap items-center gap-4 p-4">
            {p.cover_url && (
              <img src={normalizeImage(p.cover_url)} alt="" className="h-16 w-24 rounded-xl object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(p.published_at).toLocaleDateString("pt-BR")} ·{" "}
                {p.published ? "Publicado" : "Rascunho"} · {p.images?.length ?? 0} fotos ·{" "}
                {p.videos?.length ?? 0} vídeos
              </p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(p)}
              className="rounded-xl border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Excluir post"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
