import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bannerImage, DEFAULT_FX } from "@/data/trips";
import { settingsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

type Stat = { label: string; value: string };

const storageUrl = (path: string) => `/api/public/img/${path}`;


function AdminSettings() {
  const { data: settings } = useQuery(settingsQuery);
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  });
  const [stats, setStats] = useState<Stat[]>([]);

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
    });
    setStats(settings.stats ?? []);
  }, [settings]);

  const field =
    "h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
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


  const save = async () => {
    setSaving(true);
    const { fx_usd, fx_eur, ...rest } = form;
    const { error } = await supabase
      .from("site_settings")
      .update({
        ...rest,
        banner_image_url: form.banner_image_url.trim() || null,
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
            className="min-h-20 w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
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
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Enviando..." : form.banner_image_url ? "Trocar foto" : "Carregar foto"}
            </button>
            {form.banner_image_url && (
              <button
                type="button"
                onClick={() => setForm({ ...form, banner_image_url: "" })}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
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
          className="h-40 w-full rounded-md object-cover"
        />


      </section>

      <div className="space-y-6">
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
                className="rounded-md border border-border px-3 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStats([...stats, { value: "", label: "" }])}
            className="rounded-md border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-accent hover:text-accent"
          >
            + Adicionar estatística
          </button>
        </section>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-full rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}
