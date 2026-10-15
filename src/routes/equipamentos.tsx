import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MessageCircle, PackageCheck, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/api";

type MediaItem = { url: string; type: "image" | "video" };
type RentalEquipment = {
  id: string;
  name: string;
  description: string;
  daily_price: number;
  image_url: string | null;
  media?: MediaItem[] | null;
  available: boolean;
  sort_order: number;
};

export const Route = createFileRoute("/equipamentos")({
  head: () => ({
    meta: [
      { title: "Aluguel de equipamentos — Casa de Aventura" },
      { name: "description", content: "Selecione os equipamentos de aventura que deseja alugar e solicite pelo WhatsApp." },
    ],
  }),
  component: EquipmentRentalPage,
});

function EquipmentRentalPage() {
  const { data: settings } = useQuery(settingsQuery);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const { data: equipment = [], isLoading, error } = useQuery({
    queryKey: ["equipment_rentals_public"],
    queryFn: async (): Promise<RentalEquipment[]> => {
      const { data, error } = await supabase.from("equipment_rentals").select("*").eq("available", true).order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []) as RentalEquipment[];
    },
  });

  const selectedItems = useMemo(() => equipment.filter((item) => (selected[item.id] ?? 0) > 0), [equipment, selected]);
  const totalPerDay = selectedItems.reduce((sum, item) => sum + Number(item.daily_price || 0) * (selected[item.id] ?? 0), 0);
  const phone = (settings?.whatsapp_number || settings?.phone || "4733517661").replace(/\D/g, "");
  const message = [
    "Olá, Casa de Aventura! Gostaria de consultar a disponibilidade para aluguel dos seguintes equipamentos:",
    ...selectedItems.map((item) => `• ${item.name} — quantidade: ${selected[item.id]}${Number(item.daily_price) > 0 ? ` — R$ ${Number(item.daily_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/dia por unidade` : ""}`),
    "",
    "Por favor, me informem disponibilidade, período e condições do aluguel."
  ].join("\n");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent"><PackageCheck className="h-4 w-4" /> Equipamentos para sua aventura</div>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">Aluguel de equipamentos</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">Escolha os equipamentos, ajuste a quantidade e envie sua lista pelo WhatsApp. A equipe confirma a disponibilidade e o período do aluguel.</p>
      </header>

      {isLoading ? <p className="py-12 text-center text-muted-foreground">Carregando equipamentos...</p> : error ? (
        <p className="mt-8 rounded-xl border border-destructive/30 p-4 text-sm text-destructive">Não foi possível carregar os equipamentos. Tente novamente em instantes.</p>
      ) : equipment.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border p-8 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-bold">Catálogo em preparação</h2>
          <p className="mt-2 text-sm text-muted-foreground">Entre em contato pelo WhatsApp para consultar os equipamentos disponíveis.</p>
          <a className="btn-pill mt-5 inline-flex" href={`https://wa.me/${phone}?text=${encodeURIComponent("Olá! Gostaria de consultar os equipamentos disponíveis para aluguel.")}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Consultar no WhatsApp</a>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => {
              const quantity = selected[item.id] ?? 0;
              return <article key={item.id} className="card-surface flex min-w-0 flex-col overflow-hidden">
                {(item.media?.length ? item.media : item.image_url ? [{ url: item.image_url, type: "image" as const }] : []).length > 0 ? (
                  <div className="grid grid-cols-2 gap-1 bg-secondary p-1">
                    {(item.media?.length ? item.media : item.image_url ? [{ url: item.image_url, type: "image" as const }] : []).slice(0, 8).map((media, mediaIndex) => (
                      <div key={media.url} className={mediaIndex === 0 ? "col-span-2" : ""}>
                        {media.type === "video" ? (
                          <video src={media.url} controls playsInline preload="metadata" className={`${mediaIndex === 0 ? "aspect-[4/3]" : "aspect-square"} w-full rounded-lg bg-black object-contain`} aria-label={`Vídeo ${mediaIndex + 1} de ${item.name}`} />
                        ) : (
                          <img src={media.url} alt={`${item.name} — foto ${mediaIndex + 1}`} loading="lazy" className={`${mediaIndex === 0 ? "aspect-[4/3]" : "aspect-square"} w-full rounded-lg object-cover`} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : <div className="flex aspect-[4/3] items-center justify-center bg-secondary text-muted-foreground"><PackageCheck className="h-12 w-12" /></div>}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  {item.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.description}</p>}
                  <p className="mt-4 font-bold text-accent">{Number(item.daily_price) > 0 ? <>R$ {Number(item.daily_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-muted-foreground">/ dia por unidade</span></> : "Consulte o valor"}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-sm text-muted-foreground">Quantidade</span>
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => setSelected((s) => ({ ...s, [item.id]: Math.max(0, (s[item.id] ?? 0) - 1) }))} className="h-10 w-10 rounded-full border border-border text-lg" disabled={quantity === 0}>−</button>
                      <span className="min-w-5 text-center font-bold">{quantity}</span>
                      <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setSelected((s) => ({ ...s, [item.id]: Math.min(20, (s[item.id] ?? 0) + 1) }))} className="h-10 w-10 rounded-full border border-border text-lg">+</button>
                    </div>
                  </div>
                </div>
              </article>;
            })}
          </div>

          <aside className="sticky bottom-3 z-30 mt-8 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="min-w-0">
              <p className="font-bold">{selectedItems.length} {selectedItems.length === 1 ? "tipo de equipamento selecionado" : "tipos de equipamento selecionados"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{selectedItems.reduce((sum, item) => sum + selected[item.id], 0)} unidade(s). {totalPerDay > 0 ? `Estimativa: R$ ${totalPerDay.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/dia, sujeita à confirmação.` : "Valores e disponibilidade serão confirmados pelo WhatsApp."}</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-disabled={selectedItems.length === 0} onClick={(e) => { if (!selectedItems.length) e.preventDefault(); }} className={`mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold sm:mt-0 sm:w-auto ${selectedItems.length ? "bg-accent text-accent-foreground" : "pointer-events-auto bg-muted text-muted-foreground"}`}><MessageCircle className="h-4 w-4" /> Enviar lista pelo WhatsApp</a>
          </aside>
        </>
      )}
    </div>
  );
}
