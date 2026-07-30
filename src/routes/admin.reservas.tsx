import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/data/trips";
import { bookingsQuery } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reservas")({
  component: AdminBookings,
});

const statuses = ["novo", "em contato", "confirmada", "cancelada"];

function AdminBookings() {
  const { data: bookings = [] } = useQuery(bookingsQuery);
  const qc = useQueryClient();

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("booking_requests").update({ status }).eq("id", id);
    if (error) return toast.error("Não foi possível atualizar.");
    qc.invalidateQueries({ queryKey: ["booking_requests"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("booking_requests").delete().eq("id", id);
    if (error) return toast.error("Não foi possível excluir.");
    qc.invalidateQueries({ queryKey: ["booking_requests"] });
  };

  return (
    <section className="card-surface overflow-hidden">
      <h2 className="border-b border-border px-5 py-4 text-lg font-bold uppercase">
        Pedidos de reserva
      </h2>
      {bookings.length === 0 ? (
        <p className="p-6 text-sm text-muted-foreground">
          Nenhum pedido ainda. Eles aparecem aqui sempre que alguém agenda pelo site.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-2">Cliente</th>
                <th className="px-5 py-2">Contato</th>
                <th className="px-5 py-2">Roteiro</th>
                <th className="px-5 py-2">Saída</th>
                <th className="px-5 py-2">Pessoas</th>
                <th className="px-5 py-2">Status</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{b.customer_name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.contact || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.trip_name}</td>
                  <td className="px-5 py-3">{b.departure_date ? formatDate(b.departure_date) : "—"}</td>
                  <td className="px-5 py-3">{b.people}</td>
                  <td className="px-5 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => update(b.id, e.target.value)}
                      className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
