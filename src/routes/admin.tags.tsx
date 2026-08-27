import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { tagsQuery } from "@/lib/api";

export const Route = createFileRoute("/admin/tags")({
  component: AdminTags,
});

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const field =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function AdminTags() {
  const { data: tags = [] } = useQuery(tagsQuery);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["tags"] });

  const add = async () => {
    const clean = name.trim();
    if (!clean) return;
    const id = slugify(clean);
    if (!id) return toast.error("Nome inválido.");
    setSaving(true);
    const { error } = await supabase
      .from("tags")
      .insert({ id, name: clean, sort_order: tags.length });
    setSaving(false);
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Tag criada!");
    refresh();
  };

  const rename = async (id: string, value: string) => {
    const { error } = await supabase.from("tags").update({ name: value }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Tag removida.");
    refresh();
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-5">
        <h2 className="text-lg font-bold uppercase">Nova tag</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          As tags aparecem nos cards e viram filtro na página de viagens.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            className={`${field} max-w-xs flex-1`}
            placeholder="Ex.: Família, Bate e volta, Nível difícil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button
            type="button"
            onClick={add}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
      </section>

      <section className="card-surface divide-y divide-border">
        {tags.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Nenhuma tag cadastrada.</p>
        ) : (
          tags.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-4">
              <input
                className={`${field} max-w-sm`}
                defaultValue={t.name}
                onBlur={(e) => e.target.value.trim() !== t.name && rename(t.id, e.target.value.trim())}
              />
              <code className="text-xs text-muted-foreground">{t.id}</code>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="ml-auto text-muted-foreground hover:text-destructive"
                aria-label="Excluir tag"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
