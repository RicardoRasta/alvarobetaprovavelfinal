import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  MessageCircle,
  Mountain,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatPrice, tripImages, whatsappLink } from "@/data/trips";
import type { Trip } from "@/data/trips";
import { activitiesQuery, logWhatsAppClick, settingsQuery, tripsQuery } from "@/lib/api";

function TripGallery({ trip }: { trip: Trip }) {
  const images = tripImages(trip);
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="card-surface overflow-hidden">
        <img
          src={current}
          alt={`${trip.name} em ${trip.destination}, ${trip.state}`}
          width={1024}
          height={768}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1} de ${images.length}`}
              className={`overflow-hidden rounded-md border transition ${
                i === active ? "border-accent" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/viagens/$tripId")({
  head: () => ({
    meta: [
      { title: "Roteiro de aventura — A Casa de Aventura" },
      {
        name: "description",
        content:
          "Veja o roteiro completo, datas de saída, o que está incluso e agende sua viagem pelo WhatsApp.",
      },
      { property: "og:title", content: "Roteiro de aventura — A Casa de Aventura" },
      {
        property: "og:description",
        content: "Detalhes do roteiro, próximas saídas e agendamento direto pelo WhatsApp.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripDetail,
});

function TripDetail() {
  const { tripId } = Route.useParams();
  const { data: trips = [], isLoading } = useQuery(tripsQuery);
  const { data: activities = [] } = useQuery(activitiesQuery);
  const { data: settings } = useQuery(settingsQuery);

  const trip = trips.find((t) => t.slug === tripId || t.id === tripId);
  const departures = trip?.departures ?? [];

  const [departure, setDeparture] = useState("");
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!departure && departures.length > 0) setDeparture(departures[0].date);
  }, [departures, departure]);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Carregando roteiro...</div>;
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-xl p-12 text-center">
        <h1 className="text-2xl font-bold uppercase">Roteiro não encontrado</h1>
        <Link to="/viagens" className="mt-4 inline-block text-accent hover:underline">
          Ver todas as viagens
        </Link>
      </div>
    );
  }

  const activity = activities.find((a) => a.id === trip.activity_id);
  const total = Number(trip.price) * people;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe seu nome para continuar.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("booking_requests").insert({
      trip_id: trip.id,
      trip_name: trip.name,
      customer_name: name.trim(),
      contact: contact.trim(),
      departure_date: departure || null,
      people,
    });
    setSending(false);
    if (error) {
      toast.error("Não foi possível registrar o pedido, mas você pode seguir pelo WhatsApp.");
    }
    await logWhatsAppClick({
      tripId: trip.id,
      tripName: trip.name,
      source: "trip_page",
      departureDate: departure || null,
    });
    const url = whatsappLink(settings, {
      tripName: trip.name,
      date: departure || undefined,
      people,
      customerName: name.trim(),
    });
    window.open(url, "_blank", "noopener,noreferrer");

  };

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8 md:px-6 md:py-12">
      <Link
        to="/viagens"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar às viagens
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card-surface overflow-hidden">
            <img
              src={tripImage(trip)}
              alt={`${trip.name} em ${trip.destination}, ${trip.state}`}
              width={1024}
              height={768}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {trip.highlights.length > 0 && (
            <section className="card-surface p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
                <Mountain className="h-5 w-5 text-accent" /> Destaques do roteiro
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {trip.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {trip.includes.length > 0 && (
            <section className="card-surface p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
                <ShieldCheck className="h-5 w-5 text-accent" /> O que está incluso
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {trip.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {i}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div>
          <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {trip.destination} · {trip.state}
            {activity ? ` · ${activity.name}` : ""}
          </span>
          <h1 className="mt-2 text-3xl font-bold uppercase md:text-4xl">{trip.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{Number(trip.rating).toFixed(1)}</span>
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {trip.days} dias
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              Nível {trip.level}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-muted-foreground">{trip.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(trip.price)}</span>
            {trip.old_price != null && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(trip.old_price)}
              </span>
            )}
            <span className="text-sm text-muted-foreground">por pessoa</span>
          </div>

          <form className="card-surface mt-6 space-y-4 p-5" onSubmit={handleSubmit}>
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
              <CalendarDays className="h-5 w-5 text-accent" /> Agendar esta viagem
            </h2>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Seu nome
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Como podemos te chamar?"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Telefone ou e-mail (opcional)
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="(11) 99999-9999"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            {departures.length > 0 && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                  Data de saída
                </span>
                <select
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {departures.map((d) => (
                    <option key={d.id} value={d.date}>
                      {formatDate(d.date)} — {d.spots} vagas
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase text-muted-foreground">
                Número de aventureiros
              </span>
              <input
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" /> {people} pessoa(s)
              </span>
              <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <MessageCircle className="h-5 w-5" />
              {sending ? "Enviando..." : "Agendar pelo WhatsApp"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Abrimos o WhatsApp com a mensagem já pronta com o roteiro, a data e o número de
              pessoas.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
