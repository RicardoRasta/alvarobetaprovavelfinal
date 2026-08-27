import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allTestimonialsQuery } from "@/lib/api";
import { normalizeImage } from "@/data/trips";

export const Route = createFileRoute("/admin/comentarios")({
  component: AdminComments,
});

function AdminComments() {
  const { data: items = [] } = useQuery(allTestimonialsQuery);
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["testimonials"] });

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("testimonials").update({ approved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(approved ? "Comentário aprovado!" : "Comentário ocultado.");
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Comentário excluído.");
    refresh();
  };

  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  const Card = ({ t }: { t: (typeof items)[number] }) => (
    <article className="card-surface space-y-3 p-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{t.name}</span>
        <span className="flex items-center gap-0.5 text-accent">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </span>
        {t.trip_name && <span className="text-xs text-muted-foreground">· {t.trip_name}</span>}
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(t.created_at).toLocaleDateString("pt-BR")}
        </span>
      </header>
      <p className="text-sm text-muted-foreground">{t.comment}</p>
      {t.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {t.photos.map((p) => (
            <img
              key={p}
              src={normalizeImage(p)}
              alt="Foto enviada pelo cliente"
              className="h-20 w-20 rounded-md border border-border object-cover"
            />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {!t.approved ? (
          <button
            type="button"
            onClick={() => setApproved(t.id, true)}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
          >
            <Check className="h-4 w-4" /> Aprovar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setApproved(t.id, false)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" /> Ocultar
          </button>
        )}
        <button
          type="button"
          onClick={() => remove(t.id)}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" /> Excluir
        </button>
      </div>
    </article>
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-bold uppercase">Aguardando aprovação ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum comentário pendente.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {pending.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold uppercase">Publicados ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum comentário publicado ainda.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {approved.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
