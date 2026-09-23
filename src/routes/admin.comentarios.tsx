import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allTestimonialsQuery } from "@/lib/api";
import { normalizeImage } from "@/data/trips";
import { TestimonialCard } from "@/components/testimonial-card";

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

  const saveActivityDate = async (id: string, value: string) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ activity_date: value || null })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Data da atividade atualizada.");
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
    <div className="space-y-3">
      <TestimonialCard testimonial={t} />
      <div className="card-surface flex flex-wrap gap-2 p-4">
        <label className="w-full text-xs font-medium uppercase text-muted-foreground sm:w-[220px]">
          Data da atividade
          <input
            type="date"
            defaultValue={t.activity_date ?? ""}
            onBlur={(e) => {
              const next = e.currentTarget.value;
              if (next !== (t.activity_date ?? "")) void saveActivityDate(t.id, next);
            }}
            className="mt-1 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-normal normal-case text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="flex flex-1 items-end gap-2">
          {!t.approved ? (
            <button
              type="button"
              onClick={() => setApproved(t.id, true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
            >
              <Check className="h-4 w-4" /> Aprovar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setApproved(t.id, false)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              <X className="h-4 w-4" /> Ocultar
            </button>
          )}
          <button
            type="button"
            onClick={() => remove(t.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      </div>
    </div>
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
