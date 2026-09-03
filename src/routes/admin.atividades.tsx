import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { activitiesQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/atividades")({
  component: AdminActivities,
});

type Form = {
  id: string;
  name: string;
  description: string;
  sort_order: string;
};

const empty: Form = {
  id: "",
  name: "",
  description: "",
  sort_order: "0",
};

function AdminActivities() {
  const { data: activities = [] } = useQuery(activitiesQuery);
  const qc = useQueryClient();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.refetchQueries({ queryKey: ["activities"] });

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const openNew = () => {
    setEditing("new");
    setForm({ ...empty });
  };

  const openEdit = (a: (typeof activities)[number]) => {
    setEditing(a.id);
    setForm({
      id: a.id,
      name: a.name,
      description: a.description,
      sort_order: String(a.sort_order ?? 0),
    });
  };

  const save = async () => {
    if (!form) return;
    if (!form.id.trim() || !form.name.trim()) {
      toast.error("Identificador e nome são obrigatórios.");
      return;
    }
    const id = form.id
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!id) {
      toast.error("Identificador inválido.");
      return;
    }
    setSaving(true);
    const payload = {
      id,
      name: form.name.trim(),
      description: form.description.trim(),
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } =
      editing === "new"
        ? await supabase.from("activities").insert(payload)
        : await supabase.from("activities").update(payload).eq("id", editing!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Atividade salva!");
    setEditing(null);
    setForm(null);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Atividade excluída.");
    refresh();
  };

  const move = async (id: string, direction: -1 | 1) => {
    const sorted = [...activities].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const swap = sorted[swapIdx];
    const { error } = await supabase
      .from("activities")
      .update({ sort_order: swap.sort_order })
      .eq("id", current.id);
    if (error) return toast.error(error.message);
    const { error: err2 } = await supabase
      .from("activities")
      .update({ sort_order: current.sort_order })
      .eq("id", swap.id);
    if (err2) return toast.error(err2.message);
    refresh();
  };

  const field = "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1 block text-xs font-medium uppercase text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase">Atividades</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> Nova atividade
        </button>
      </div>

      {form && (
        <section className="card-surface space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase">
              {editing === "new" ? "Nova atividade" : "Editar atividade"}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="sm:col-span-1">
              <span className={labelCls}>Identificador (URL)</span>
              <input
                className={field}
                value={form.id}
                disabled={editing !== "new"}
                placeholder="ex.: canoagem"
                onChange={(e) => set("id", e.target.value)}
              />
            </label>
            <label className="sm:col-span-1">
              <span className={labelCls}>Nome</span>
              <input
                className={field}
                value={form.name}
                placeholder="ex.: Canoagem"
                onChange={(e) => set("name", e.target.value)}
              />
            </label>
            <label className="sm:col-span-1">
              <span className={labelCls}>Ordem</span>
              <input
                className={field}
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </label>
            <label className="sm:col-span-3">
              <span className={labelCls}>Descrição curta</span>
              <input
                className={field}
                value={form.description}
                placeholder="Breve descrição que aparece na home"
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar atividade"}
          </button>
        </section>
      )}

      <div className="grid gap-3">
        {[...activities]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((a, i, arr) => (
            <article
              key={a.id}
              className="card-surface flex items-center gap-3 p-3"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(a.id, -1)}
                  className="text-muted-foreground hover:text-accent disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
                <button
                  type="button"
                  disabled={i === arr.length - 1}
                  onClick={() => move(a.id, 1)}
                  className="text-muted-foreground hover:text-accent disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <GripVertical className="h-4 w-4 -rotate-90" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.description || "Sem descrição"} · ordem {a.sort_order}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs hover:border-accent hover:text-accent"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
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
