import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bannerImage, DEFAULT_FX, DEFAULT_PHONE, normalizeImage } from "@/data/trips";
import { certificatesQuery, settingsQuery } from "@/lib/api";
import { uploadFile } from "@/lib/upload";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

type Stat = { label: string; value: string };

const storageUrl = (path: string) => {
  const base = import.meta.env["VITE_SUPABASE_URL"] || "";
  return base
    ? `${base.replace(/\/$/, "")}/storage/v1/object/public/trip-images/${path.split("/").map(encodeURIComponent).join("/")}`
    : path;
};

const MAX_HERO = 8;

function AdminSettings() {
  const { data: settings } = useQuery(settingsQuery);
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [aboutUploading, setAboutUploading] = useState(false);
  const [cadasturUploading, setCadasturUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    banner_badge: "",
    banner_title: "",
    banner_subtitle: "",
    banner_image_url: "",
    whatsapp_number: "",
    whatsapp_greeting: "",
    fx_usd: "",
    fx_eur: "",
    phone: "",
    contact_email: "",
    address: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    footer_text: "",
    about_title: "",
    about_text: "",
    about_image_url: "",
    cadastur_image_url: "",
  });
  const [stats, setStats] = useState<Stat[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  useEffect(() => {
    if (!settings) return;
    setForm({
      banner_badge: settings.banner_badge ?? "",
      banner_title: settings.banner_title ?? "",
      banner_subtitle: settings.banner_subtitle ?? "",
      banner_image_url: settings.banner_image_url ?? "",
      whatsapp_number: settings.whatsapp_number ?? "",
      whatsapp_greeting: settings.whatsapp_greeting ?? "",
      fx_usd: String(settings.fx_usd ?? ""),
      fx_eur: String(settings.fx_eur ?? ""),
      phone: settings.phone ?? "",
      contact_email: settings.contact_email ?? "",
      address: settings.address ?? "",
      instagram_url: settings.instagram_url ?? "",
      facebook_url: settings.facebook_url ?? "",
      youtube_url: settings.youtube_url ?? "",
      footer_text: settings.footer_text ?? "",
      about_title: settings.about_title ?? "",
      about_text: settings.about_text ?? "",
      about_image_url: settings.about_image_url ?? "",
      cadastur_image_url: settings.cadastur_image_url ?? "",
    });
    setStats(settings.stats ?? []);
    setHeroImages(settings.hero_images ?? []);
  }, [settings]);

  const field =
    "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  /** Envia a foto escolhida para o armazenamento e guarda o endereço público. */
  const uploadBanner = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("trip-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
    if (error) return toast.error(error.message);
    setForm((f) => ({ ...f, banner_image_url: storageUrl(path) }));
    toast.success("Foto enviada! Não esqueça de salvar.");
  };
  /** Adiciona uma imagem ao carrossel da home (máximo de 8). */
  const addHeroImage = async (file?: File) => {
    if (!file) return;
    setHeroUploading(true);
    try {
      const url = await uploadFile(file, "carrossel");
      setHeroImages((p) => [...p, url].slice(0, MAX_HERO));
      toast.success("Imagem adicionada! Não esqueça de salvar.");
    } catch {
      toast.error("Não foi possível enviar a imagem.");
    } finally {
      setHeroUploading(false);
    }
  };

  /** Envia a foto usada na página Quem somos. */
  const uploadAbout = async (file?: File) => {
    if (!file) return;
    setAboutUploading(true);
    try {
      const url = await uploadFile(file, "quem-somos");
      setForm((f) => ({ ...f, about_image_url: url }));
      toast.success("Foto enviada! Não esqueça de salvar.");
    } catch {
      toast.error("Não foi possível enviar a foto.");
    } finally {
      setAboutUploading(false);
    }
  };
  /** Envia e define a imagem oficial do certificado Cadastur. */
  const uploadCadastur = async (file?: File) => {
    if (!file) return;
    setCadasturUploading(true);
    try {
      const url = await uploadFile(file, "cadastur");
      setForm((f) => ({ ...f, cadastur_image_url: url }));
      toast.success("Certificado Cadastur enviado! Clique em salvar para publicar.");
    } catch {
      toast.error("Não foi possível enviar o certificado.");
    } finally {
      setCadasturUploading(false);
    }
  };


  const save = async () => {
    setSaving(true);
    const { fx_usd, fx_eur, ...rest } = form;
    const { error } = await supabase
      .from("site_settings")
      .update({
        ...rest,
        banner_image_url: form.banner_image_url.trim() || null,
        about_image_url: form.about_image_url.trim() || null,
        cadastur_image_url: form.cadastur_image_url.trim() || null,
        phone: form.phone.trim() || DEFAULT_PHONE,
        hero_images: heroImages,
        fx_usd: Number(fx_usd) > 0 ? Number(fx_usd) : DEFAULT_FX.usd,
        fx_eur: Number(fx_eur) > 0 ? Number(fx_eur) : DEFAULT_FX.eur,
        stats: stats.filter((s) => s.label.trim()),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configurações salvas!");
    await qc.refetchQueries({ queryKey: ["site_settings"] });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-surface space-y-4 p-5">
        <h2 className="text-lg font-bold uppercase">Banner da página inicial</h2>
        <label className="block">
          <span className={labelCls}>Selo</span>
          <input className={field} value={form.banner_badge} onChange={(e) => setForm({ ...form, banner_badge: e.target.value })} />
        </label>
        <label className="block">
          <span className={labelCls}>Título</span>
          <input className={field} value={form.banner_title} onChange={(e) => setForm({ ...form, banner_title: e.target.value })} />
        </label>
        <label className="block">
          <span className={labelCls}>Subtítulo</span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={form.banner_subtitle}
            onChange={(e) => setForm({ ...form, banner_subtitle: e.target.value })}
          />
        </label>
        <div className="block">
          <span className={labelCls}>Imagem do banner</span>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadBanner(file);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => bannerInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Enviando..." : form.banner_image_url ? "Trocar foto" : "Carregar foto"}
            </button>
            {form.banner_image_url && (
              <button
                type="button"
                onClick={() => setForm({ ...form, banner_image_url: "" })}
                className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                Remover foto
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Envie uma foto do seu computador (JPG, PNG ou WebP). Sem foto, usamos a imagem padrão.
          </p>
        </div>
        <img
          src={bannerImage({ banner_image_url: form.banner_image_url || null })}
          alt="Pré-visualização do banner"
          width={640}
          height={240}
          className="h-40 w-full rounded-xl object-cover"
        />

        <div className="border-t border-border pt-4">
          <span className={labelCls}>Carrossel da home (até {MAX_HERO} imagens · troca a cada 10s)</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {heroImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={normalizeImage(img)}
                  alt={`Imagem ${i + 1} do carrossel`}
                  className="h-20 w-28 rounded-xl border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setHeroImages((arr) => arr.filter((_, j) => j !== i))}
                  aria-label="Remover imagem"
                  className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {heroImages.length < MAX_HERO && (
              <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent">
                {heroUploading ? <span className="text-xs">Enviando...</span> : <ImagePlus className="h-6 w-6" />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => addHeroImage(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Sem imagens no carrossel, mostramos a imagem do banner acima.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">Contato e telefone</h2>
          <label className="block">
            <span className={labelCls}>Telefone para o botão "Ligar"</span>
            <input
              className={field}
              placeholder={DEFAULT_PHONE}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>E-mail de contato</span>
            <input
              className={field}
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Endereço</span>
            <input
              className={field}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
        </section>

        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">Rodapé e redes sociais</h2>
          <label className="block">
            <span className={labelCls}>Texto do rodapé</span>
            <textarea
              className="min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={form.footer_text}
              onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Instagram (link)</span>
            <input
              className={field}
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Facebook (link)</span>
            <input
              className={field}
              value={form.facebook_url}
              onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>YouTube (link)</span>
            <input
              className={field}
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            />
          </label>
        </section>

        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">Página "Quem somos"</h2>
          <label className="block">
            <span className={labelCls}>Título</span>
            <input
              className={field}
              value={form.about_title}
              onChange={(e) => setForm({ ...form, about_title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>História da empresa</span>
            <textarea
              className="min-h-40 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={form.about_text}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            />
          </label>
          <div>
            <span className={labelCls}>Foto da equipe</span>
            <div className="flex flex-wrap items-center gap-3">
              {form.about_image_url && (
                <img
                  src={normalizeImage(form.about_image_url)}
                  alt="Foto da equipe"
                  className="h-20 w-28 rounded-xl border border-border object-cover"
                />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">
                <Upload className="h-4 w-4" />
                {aboutUploading ? "Enviando..." : form.about_image_url ? "Trocar foto" : "Carregar foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadAbout(e.target.files?.[0])}
                />
              </label>
              {form.about_image_url && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, about_image_url: "" })}
                  className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">WhatsApp</h2>
          <label className="block">
            <span className={labelCls}>Número (com DDI e DDD)</span>
            <input
              className={field}
              placeholder="5511999999999"
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Início da mensagem automática</span>
            <input
              className={field}
              value={form.whatsapp_greeting}
              onChange={(e) => setForm({ ...form, whatsapp_greeting: e.target.value })}
            />
          </label>
          <p className="text-xs text-muted-foreground">
            A mensagem enviada inclui automaticamente o roteiro, a data de saída, o número de
            pessoas e o nome do cliente.
          </p>
        </section>

        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">Cotações (dólar e euro)</h2>
          <p className="text-xs text-muted-foreground">
            O preço principal continua em real. Estes valores são usados para mostrar a conversão
            aproximada em dólar e euro nos cards e nas páginas das viagens.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>1 dólar = R$</span>
              <input
                className={field}
                type="number"
                step="0.01"
                value={form.fx_usd}
                onChange={(e) => setForm({ ...form, fx_usd: e.target.value })}
              />
            </label>
            <label className="block">
              <span className={labelCls}>1 euro = R$</span>
              <input
                className={field}
                type="number"
                step="0.01"
                value={form.fx_eur}
                onChange={(e) => setForm({ ...form, fx_eur: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="card-surface space-y-4 p-5">
          <h2 className="text-lg font-bold uppercase">Estatísticas da home</h2>
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={field}
                value={s.value}
                placeholder="Valor"
                onChange={(e) =>
                  setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                }
              />
              <input
                className={field}
                value={s.label}
                placeholder="Rótulo"
                onChange={(e) =>
                  setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                }
              />
              <button
                type="button"
                onClick={() => setStats(stats.filter((_, j) => j !== i))}
                className="rounded-xl border border-border px-3 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStats([...stats, { value: "", label: "" }])}
            className="rounded-xl border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-accent hover:text-accent"
          >
            + Adicionar estatística
          </button>
        </section>

        <CadasturManager form={form} setForm={setForm} cadasturUploading={cadasturUploading} uploadCadastur={uploadCadastur} />

        <CertificatesManager />

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}

/** Certificado Cadastur oficial controlado diretamente pelas configurações. */
function CadasturManager({
  form,
  setForm,
  cadasturUploading,
  uploadCadastur,
}: {
  form: { cadastur_image_url: string };
  setForm: Dispatch<SetStateAction<any>>;
  cadasturUploading: boolean;
  uploadCadastur: (file?: File) => Promise<void>;
}) {
  const field =
    "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  return (
    <section id="certificado-cadastur-config" className="card-surface scroll-mt-24 space-y-4 p-5">
      <div>
        <h2 className="text-lg font-bold uppercase">Certificado Cadastur</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Envie aqui a imagem oficial do certificado. Esta imagem será a usada automaticamente
          na área de certificações da página Quem somos e no rodapé.
        </p>
      </div>

      {form.cadastur_image_url ? (
        <img
          src={normalizeImage(form.cadastur_image_url)}
          alt="Pré-visualização do certificado Cadastur"
          className="max-h-72 w-full rounded-2xl border border-border bg-white object-contain"
        />
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/40 text-center text-sm text-muted-foreground">
          Nenhum certificado Cadastur configurado.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">
          <Upload className="h-4 w-4" />
          {cadasturUploading
            ? "Enviando..."
            : form.cadastur_image_url
              ? "Trocar certificado"
              : "Carregar certificado"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadCadastur(e.target.files?.[0])}
          />
        </label>

        {form.cadastur_image_url && (
          <button
            type="button"
            onClick={() => setForm((f: any) => ({ ...f, cadastur_image_url: "" }))}
            className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
          >
            Remover
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Use a foto original do certificado (JPG, PNG ou WebP). Depois de enviar, clique em
        <strong> Salvar configurações</strong>.
      </p>
    </section>
  );
}

/** Cadastro dos certificados/selos exibidos no rodapé e na página "Quem somos". */
function CertificatesManager() {
  const { data: certificates = [] } = useQuery(certificatesQuery);
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const field =
    "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  const refresh = () => qc.invalidateQueries({ queryKey: ["certificates"] });

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      setImageUrl(await uploadFile(file, "certificado"));
    } catch {
      toast.error("Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    if (!title.trim()) return toast.error("Informe o título do certificado.");
    setBusy(true);
    const { error } = await supabase.from("certificates").insert({
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl || null,
      sort_order: certificates.length,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Certificado adicionado!");
    setTitle("");
    setDescription("");
    setImageUrl("");
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Certificado removido.");
    refresh();
  };

  return (
    <section className="card-surface space-y-4 p-5">
      <h2 className="text-lg font-bold uppercase">Certificados</h2>

      {certificates.length > 0 && (
        <ul className="divide-y divide-border">
          {certificates.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              {c.image_url ? (
                <img
                  src={normalizeImage(c.image_url)}
                  alt={c.title}
                  className="h-12 w-12 rounded-xl border border-border object-contain p-1"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl border border-border" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                {c.description && (
                  <p className="truncate text-xs text-muted-foreground">{c.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(c.id)}
                aria-label="Remover certificado"
                className="rounded-xl border border-border p-2 text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 rounded-xl border border-dashed border-border p-4">
        <label className="block">
          <span className={labelCls}>Título</span>
          <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className={labelCls}>Descrição</span>
          <input className={field} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {imageUrl && (
            <img
              src={normalizeImage(imageUrl)}
              alt="Selo"
              className="h-12 w-12 rounded-xl border border-border object-contain p-1"
            />
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent">
            <Upload className="h-4 w-4" /> {busy ? "Enviando..." : "Imagem do selo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={add}
            disabled={busy}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Os certificados são salvos na hora, separadamente das demais configurações.
      </p>
    </section>
  );
}
