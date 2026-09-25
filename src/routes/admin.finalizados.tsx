import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allTripsQuery } from "@/lib/api";
import { formatDate, formatPrice } from "@/data/trips";

export const Route = createFileRoute("/admin/finalizados")({
  component: FinalizedTrips,
});

type Finalized = {
  id: string;
  trip_id: string;
  departure_id: string | null;
  trip_name: string;
  departure_date: string | null;
  return_date: string | null;
  people_count: number;
  gross_revenue: number;
  total_expenses: number;
  notes: string | null;
  finalized_at: string;
  expenses?: Expense[];
};

type Expense = {
  id: string;
  finalized_trip_id: string;
  category: string;
  description: string | null;
  amount: number;
};

function FinalizedTrips() {
  const { data: trips = [] } = useQuery(allTripsQuery);
  const qc = useQueryClient();
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["finalized_trips"],
    queryFn: async (): Promise<Finalized[]> => {
      const { data, error } = await supabase.from("finalized_trips").select("*").order("return_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Finalized[];
    },
  });

  const [editing, setEditing] = useState<Finalized | null>(null);
  const [saving, setSaving] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({ category: "", description: "", amount: "" });

  const endedDepartures = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return trips.flatMap((trip) =>
      (trip.departures ?? [])
        .filter((d) => (d.return_date || d.date) < today)
        .map((d) => ({ trip, departure: d })),
    );
  }, [trips]);

  useEffect(() => {
    if (!endedDepartures.length) return;
    void (async () => {
      for (const item of endedDepartures) {
        await supabase.from("finalized_trips").upsert(
          {
            trip_id: item.trip.id,
            departure_id: item.departure.id,
            trip_name: item.trip.name,
            departure_date: item.departure.date,
            return_date: item.departure.return_date || item.departure.date,
          },
          { onConflict: "departure_id", ignoreDuplicates: true },
        );
      }
      qc.invalidateQueries({ queryKey: ["finalized_trips"] });
    })();
  }, [endedDepartures, qc]);

  const loadExpenses = async (tripId: string) => {
    const { data, error } = await supabase.from("finalized_trip_expenses").select("*").eq("finalized_trip_id", tripId).order("created_at");
    if (error) return toast.error(error.message);
    setExpenses((data ?? []) as Expense[]);
  };

  const addExpense = async () => {
    if (!editing || !newExpense.category.trim() || Number(newExpense.amount) <= 0) return toast.error("Informe categoria e valor do gasto.");
    const { data, error } = await supabase.from("finalized_trip_expenses").insert({ finalized_trip_id: editing.id, category: newExpense.category.trim(), description: newExpense.description.trim() || null, amount: Number(newExpense.amount) }).select().single();
    if (error) return toast.error(error.message);
    setExpenses((prev) => [...prev, data as Expense]);
    setNewExpense({ category: "", description: "", amount: "" });
  };

  const removeExpense = async (id: string) => {
    const { error } = await supabase.from("finalized_trip_expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totals = useMemo(() => {
    const revenue = records.reduce((s, r) => s + Number(r.gross_revenue || 0), 0);
    const expenses = records.reduce((s, r) => s + Number(r.total_expenses || 0), 0);
    const people = records.reduce((s, r) => s + Number(r.people_count || 0), 0);
    return { revenue, expenses, profit: revenue - expenses, people, trips: records.length };
  }, [records]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("finalized_trips")
      .update({
        people_count: Math.max(0, Number(editing.people_count) || 0),
        gross_revenue: Math.max(0, Number(editing.gross_revenue) || 0),
        total_expenses: Math.max(0, Number(editing.total_expenses) || 0),
        notes: editing.notes?.trim() || null,
      })
      .eq("id", editing.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Resultado da viagem salvo.");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["finalized_trips"] });
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="flex items-center gap-2 text-2xl font-bold uppercase">
          <BarChart3 className="h-6 w-6 text-accent" /> Finalizados
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Viagens que já passaram da data de volta saem automaticamente do site público e ficam aqui para controle financeiro.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-surface p-4"><p className="text-xs uppercase text-muted-foreground">Viagens</p><p className="mt-1 text-3xl font-bold">{totals.trips}</p></div>
        <div className="card-surface p-4"><p className="text-xs uppercase text-muted-foreground">Pessoas</p><p className="mt-1 text-3xl font-bold">{totals.people}</p></div>
        <div className="card-surface p-4"><p className="text-xs uppercase text-muted-foreground">Faturamento</p><p className="mt-1 text-2xl font-bold">{formatPrice(totals.revenue)}</p></div>
        <div className="card-surface p-4"><p className="text-xs uppercase text-muted-foreground">Lucro</p><p className="mt-1 text-2xl font-bold">{formatPrice(totals.profit)}</p><p className="text-xs text-muted-foreground">Gastos: {formatPrice(totals.expenses)}</p></div>
      </section>

      <section className="card-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold uppercase">Resultado por viagem</h3>
            <p className="text-xs text-muted-foreground">Preencha pessoas, faturamento e gastos de cada saída.</p>
          </div>
          <span className="text-xs text-muted-foreground">{records.length} registro(s)</span>
        </div>

        {isLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : records.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma viagem finalizada ainda.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => {
              const profit = Number(r.gross_revenue) - Number(r.total_expenses);
              return (
                <article key={r.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold uppercase">{r.trip_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {r.departure_date ? formatDate(r.departure_date) : "—"} → {r.return_date ? formatDate(r.return_date) : "—"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <div><p className="text-xs text-muted-foreground">Pessoas</p><strong>{r.people_count}</strong></div>
                      <div><p className="text-xs text-muted-foreground">Faturamento</p><strong>{formatPrice(Number(r.gross_revenue))}</strong></div>
                      <div><p className="text-xs text-muted-foreground">Gastos</p><strong>{formatPrice(Number(r.total_expenses))}</strong></div>
                      <div><p className="text-xs text-muted-foreground">Lucro</p><strong>{formatPrice(profit)}</strong></div>
                    </div>
                    <button type="button" onClick={() => setEditing({ ...r })} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent">
                      Editar
                    </button>
                  </div>
                  {r.notes && <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{r.notes}</p>}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-auto bg-background/80 p-4">
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
            <h3 className="text-lg font-bold uppercase">Finalizar dados — {editing.trip_name}</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block text-xs uppercase text-muted-foreground">Pessoas que foram</span><input type="number" min="0" className="h-10 w-full rounded-xl border border-input bg-card px-3" value={editing.people_count} onChange={(e) => setEditing({ ...editing, people_count: Number(e.target.value) })} /></label>
              <label className="text-sm"><span className="mb-1 block text-xs uppercase text-muted-foreground">Faturamento / receita</span><input type="number" min="0" step="0.01" className="h-10 w-full rounded-xl border border-input bg-card px-3" value={editing.gross_revenue} onChange={(e) => setEditing({ ...editing, gross_revenue: Number(e.target.value) })} /></label>
              <label className="text-sm"><span className="mb-1 block text-xs uppercase text-muted-foreground">Gastos totais</span><input type="number" min="0" step="0.01" className="h-10 w-full rounded-xl border border-input bg-card px-3" value={editing.total_expenses} onChange={(e) => setEditing({ ...editing, total_expenses: Number(e.target.value) })} /></label>
              <div className="rounded-xl bg-secondary/50 p-3"><p className="text-xs uppercase text-muted-foreground">Lucro calculado</p><p className="mt-1 text-xl font-bold">{formatPrice(Number(editing.gross_revenue) - Number(editing.total_expenses))}</p></div>
            </div>
            <label className="mt-4 block text-sm"><span className="mb-1 block text-xs uppercase text-muted-foreground">Observações</span><textarea className="min-h-28 w-full rounded-xl border border-input bg-card p-3" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-border px-4 py-2 text-sm">Cancelar</button>
              <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-accent" /> O status público é calculado pela data de volta; não é necessário despublicar manualmente.
      </div>
    </div>
  );
}
