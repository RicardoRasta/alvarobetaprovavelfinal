import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ImagePlus, MessageSquare, Star, Upload, X } from "lucide-react";
import { TestimonialCard } from "@/components/testimonial-card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { testimonialsQuery } from "@/lib/api";
import { normalizeImage } from "@/data/trips";
import { uploadTestimonialPhoto } from "@/lib/testimonial-upload.functions";

export const Route = createFileRoute("/comentarios")({
  head: () => ({
    meta: [
      { title: "Comentários e depoimentos — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Veja o que dizem os aventureiros sobre as expedições da Casa de Aventura e compartilhe sua própria experiência.",
      },
      { property: "og:title", content: "Comentários e depoimentos — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Depoimentos reais de quem já viveu uma aventura com a Casa de Aventura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comentarios,
});

const field =
  "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const area =
  "min-h-28 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

function Comentarios() {
  const { data: items = [] } = useQuery(testimonialsQuery);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [tripName, setTripName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["testimonials", "approved"] });
  const sendPhoto = useServerFn(uploadTestimonialPhoto);

  const addPhoto = async (file?: File) => {
    if (!file) return;
    if (photos.length >= 5) return toast.error("Máximo de 5 fotos.");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await sendPhoto({ data: fd });
      setPhotos((p) => [...p, url].slice(0, 5));
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Informe seu nome.");
    if (!activityDate) return toast.error("Informe a data da atividade.");
    if (!comment.trim()) return toast.error("Escreva seu comentário.");
    setSending(true);
    const { error } = await supabase.from("testimonials").insert({
      name: name.trim(),
      trip_name: tripName.trim(),
      activity_date: activityDate || null,
      rating,
      comment: comment.trim(),
      photos,
      approved: false,
    });
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Obrigado! Seu comentário foi enviado e será publicado após aprovação.");
    setName("");
    setTripName("");
    setActivityDate("");
    setRating(5);
    setComment("");
    setPhotos([]);
    refresh();
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <header className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-4xl leading-[0.95] md:text-5xl">Comentários</h1>
          <p className="mt-1 text-sm text-muted-foreground">O que dizem quem já viajou com a gente.</p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold uppercase">Deixe seu depoimento</h2>
        <div className="card-surface space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Seu nome *</span>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              <span className={labelCls}>Viagem (opcional)</span>
              <input className={field} value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Ex.: Trekking Chapada Diamantina" />
            </label>
            <label>
              <span className={labelCls}>Data da atividade *</span>
              <input
                type="date"
                className={field}
                value={activityDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setActivityDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <span className={labelCls}>Nota</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  aria-label={`${n} estrelas`}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <label>
            <span className={labelCls}>Comentário *</span>
            <textarea className={area} value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <div>
            <span className={labelCls}>Fotos (até 5)</span>
            <div className="flex flex-wrap gap-3">
              {photos.map((p, i) => (
                <div key={i} className="relative">
                  <img src={normalizeImage(p)} alt={`Foto ${i + 1}`} className="h-20 w-20 rounded-xl border border-border object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((arr) => arr.filter((_, idx) => idx !== i))}
                    className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border"
                    aria-label="Remover foto"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent">
                  {uploading ? <span className="text-xs">Enviando...</span> : <ImagePlus className="h-6 w-6" />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => addPhoto(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {sending ? "Enviando..." : "Enviar depoimento"}
          </button>
          <p className="text-xs text-muted-foreground">
            Seu comentário será publicado após aprovação da equipe.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold uppercase">Depoimentos</h2>
        {items.length === 0 ? (
          <p className="card-surface p-8 text-center text-sm text-muted-foreground">
            Ainda não há depoimentos publicados. Seja o primeiro a compartilhar sua experiência!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
