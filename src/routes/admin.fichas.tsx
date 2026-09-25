import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Copy, FileText, Link2, Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { enrollmentsQuery, enrollmentLinksQuery, tripsQuery } from "@/lib/api";
import { allFields, enrollmentGroups, RISK_TERMS } from "@/lib/enrollment-fields";

export const Route = createFileRoute("/admin/fichas")({
  component: AdminFichas,
});

const btn =
  "inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:border-accent hover:text-accent";

function AdminFichas() {
  const { data: links = [] } = useQuery(enrollmentLinksQuery);
  const { data: enrollments = [] } = useQuery(enrollmentsQuery);
  const { data: trips = [] } = useQuery(tripsQuery);
  const qc = useQueryClient();
  const [tripId, setTripId] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["enrollment_links"] });
    qc.invalidateQueries({ queryKey: ["enrollments"] });
  };

  const createLink = async () => {
    const trip = tripId ? trips.find((t) => t.id === tripId) : null;
    const tripName = trip ? trip.name : "Todos os roteiros";
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
    const { error } = await supabase.from("enrollment_links").insert({
      token,
      trip_id: tripId || null,
      trip_name: tripName,
      active: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Link gerado!");
    setTripId("");
    refresh();
  };

  const toggle = async (id: string, active: boolean) => {
    const { error } = await supabase.from("enrollment_links").update({ active }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const removeLink = async (id: string) => {
    const { error } = await supabase.from("enrollment_links").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Link removido.");
    refresh();
  };

  const removeEnrollment = async (id: string) => {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Ficha excluída.");
    refresh();
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/ficha/${token}`;
    navigator.clipboard?.writeText(url);
    toast.success("Link copiado!");
  };

  const filtered = useMemo(() => {
    if (!filter) return enrollments;
    if (filter === "all") return enrollments;
    return enrollments.filter((e) => e.trip_id === filter || (!e.trip_id && filter === "none"));
  }, [enrollments, filter]);

  const detail = selected ? enrollments.find((e) => e.id === selected) : null;

  return (
    <div className="space-y-8">
      <section className="card-surface p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
          <Link2 className="h-5 w-5 text-accent" /> Gerar link de ficha
        </h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 sm:min-w-56">
            <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">Roteiro</span>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos os roteiros</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={createLink} className={btn + " bg-accent text-accent-foreground border-accent"}>
            <Plus className="h-4 w-4" /> Gerar link
          </button>
        </div>

        {links.length > 0 && (
          <ul className="mt-4 divide-y divide-border">
            {links.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
                <span className="font-medium">{l.trip_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${l.active ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>
                  {l.active ? "Ativo" : "Inativo"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(l.created_at).toLocaleDateString("pt-BR")}
                </span>
                <div className="ml-auto flex gap-2">
                  <button type="button" onClick={() => copyLink(l.token)} className={btn} title="Copiar link">
                    <Copy className="h-4 w-4" /> Copiar
                  </button>
                  <button type="button" onClick={() => toggle(l.id, !l.active)} className={btn}>
                    {l.active ? "Desativar" : "Ativar"}
                  </button>
                  <button type="button" onClick={() => removeLink(l.id)} className={btn + " text-destructive hover:border-destructive"}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-surface p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
          <FileText className="h-5 w-5 text-accent" /> Fichas recebidas
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filtrar:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-card px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <span className="text-sm text-muted-foreground">{filtered.length} ficha(s)</span>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhuma ficha recebida ainda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {filtered.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 py-3 text-sm">
                <span className="font-medium">{e.full_name || "—"}</span>
                <span className="text-muted-foreground">· {e.trip_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString("pt-BR")}
                </span>
                <div className="ml-auto flex gap-2">
                  <button type="button" onClick={() => setSelected(e.id)} className={btn}>
                    <Printer className="h-4 w-4" /> Ver / PDF
                  </button>
                  <button type="button" onClick={() => removeEnrollment(e.id)} className={btn + " text-destructive hover:border-destructive"}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {detail && (
        <EnrollmentPrint
          data={detail}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/** Visualização pronta para impressão em PDF (window.print) de uma ficha. */
function EnrollmentPrint({ data, onClose }: { data: Record<string, unknown> & { id: string; trip_name: string; full_name: string; created_at: string }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-background/80 p-4 print:p-0">
      <div className="print-sheet mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 print:border-0 print:p-0">
        <div className="flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold uppercase">Ficha de inscrição</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} className={btn + " bg-accent text-accent-foreground border-accent"}>
              <Printer className="h-4 w-4" /> Imprimir / PDF
            </button>
            <button type="button" onClick={onClose} className={btn}>
              Fechar
            </button>
          </div>
        </div>

        <div className="mt-4 print:mt-0">
          <p className="font-display text-lg font-bold uppercase">A Casa de Aventura</p>
          <p className="text-sm text-muted-foreground">
            Evento: <strong className="text-foreground">{data.trip_name}</strong> · Enviada em{" "}
            {new Date(data.created_at).toLocaleDateString("pt-BR")}
          </p>
          {typeof data.face_photo_url === "string" && data.face_photo_url && (
            <div className="mt-4 flex items-start gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase text-accent">Foto do participante</p>
                <img src={data.face_photo_url} alt="Foto do rosto do participante" className="h-32 w-32 rounded-lg border border-border object-cover print:h-36 print:w-36" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-5 print:mt-2 print:space-y-1">
          {enrollmentGroups.map((g) => (
            <section key={g.title}>
              <h3 className="border-b border-border pb-1 text-xs font-bold uppercase text-accent">{g.title}</h3>
              <dl className="print-grid mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {g.fields.map((f) => {
                  const v = data[f.key];
                  const display =
                    f.kind === "bool"
                      ? v === true || v === "true"
                        ? "Sim"
                        : "Não"
                      : f.kind === "date" && v
                        ? String(v).split("-").reverse().join("/")
                        : String(v ?? "");
                  return (
                    <div key={f.key} className="flex gap-2 text-sm">
                      <dt className="text-muted-foreground">{f.label}:</dt>
                      <dd className="font-medium">{display}</dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}

          <section>
            <h3 className="border-b border-border pb-1 text-xs font-bold uppercase text-accent">Termo</h3>
            <p className="print-terms mt-2 text-xs text-muted-foreground">{RISK_TERMS}</p>
            <p className="mt-2 text-sm">
              Aceite: <strong>{data.risk_terms_accepted ? "Sim" : "Não"}</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
