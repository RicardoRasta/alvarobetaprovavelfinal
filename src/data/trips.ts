/**
 * Tipos, formatadores e imagens padrão da agência A CASA DE AVENTURA.
 * O conteúdo real (viagens, saídas, banner) vem do banco e é editável no /admin.
 */
import canoagem from "@/assets/e-canoagem.jpg";
import escalada from "@/assets/e-escalada.jpg";
import chapada from "@/assets/e-chapada.jpg";
import rafting from "@/assets/e-rafting.jpg";
import lencois from "@/assets/e-lencois.jpg";
import amazonia from "@/assets/e-amazonia.jpg";
import hero from "@/assets/hero.jpg";

export type Activity = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Departure = {
  id: string;
  trip_id: string;
  /** Data de ida */
  date: string;
  /** Data de volta (opcional) */
  return_date?: string | null;
  spots: number;
};

/** Par rótulo/valor da ficha técnica (ex.: "Distância" / "42 km"). */
export type TechSheetItem = { label: string; value: string };

/** Um dia da programação do roteiro. */
export type ItineraryDay = { title: string; description: string };

export type Trip = {
  id: string;
  slug: string;
  name: string;
  destination: string;
  state: string;
  activity_id: string | null;
  price: number;
  old_price: number | null;
  days: number;
  level: string;
  image_url: string | null;
  images?: string[] | null;
  description: string;
  highlights: string[];
  includes: string[];
  rating: number;
  featured: boolean;
  published: boolean;
  departures?: Departure[];
  /** Conteúdo detalhado da página (tudo opcional) */
  tech_sheet?: TechSheetItem[] | null;
  guide_text?: string | null;
  guide_image_url?: string | null;
  destination_text?: string | null;
  prerequisites?: string[] | null;
  characteristics?: string | null;
  climate?: string | null;
  food?: string | null;
  itinerary?: ItineraryDay[] | null;
  not_included?: string[] | null;
  checklist?: string[] | null;
  equipment?: string[] | null;
};


export type SiteSettings = {
  banner_badge: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image_url: string | null;
  whatsapp_number: string;
  whatsapp_greeting: string;
  stats: { label: string; value: string }[];
  /** Cotação do dólar em reais (1 USD = fx_usd BRL) */
  fx_usd?: number | null;
  /** Cotação do euro em reais (1 EUR = fx_eur BRL) */
  fx_eur?: number | null;
  fx_updated_at?: string | null;
};

/** Imagens locais usadas quando o admin ainda não definiu uma URL própria. */
const fallbackImages: Record<string, string> = {
  "canoagem-bonito": canoagem,
  "escalada-pedra-azul": escalada,
  "trekking-chapada": chapada,
  "rafting-jacare-pepira": rafting,
  "lencois-maranhenses": lencois,
  "amazonia-rio-negro": amazonia,
};

/** Converte endereços antigos do armazenamento para a rota interna de imagens. */
export const normalizeImage = (url?: string | null) => {
  const v = (url ?? "").trim();
  if (!v) return "";
  const m = v.match(/\/storage\/v1\/object\/(?:public\/)?trip-images\/(.+)$/);
  return m ? `/api/public/img/${m[1]}` : v;
};

export const tripImage = (trip: Pick<Trip, "slug" | "image_url">) =>
  normalizeImage(trip.image_url) || fallbackImages[trip.slug] || hero;

/** Lista de imagens da viagem (capa primeiro), com fallback para a imagem única. */
export const tripImages = (trip: Pick<Trip, "slug" | "image_url" | "images">): string[] => {
  const list = (trip.images ?? []).map((u) => normalizeImage(u)).filter(Boolean);
  return list.length > 0 ? list.slice(0, 5) : [tripImage(trip)];
};

export const bannerImage = (settings?: Pick<SiteSettings, "banner_image_url"> | null) =>
  normalizeImage(settings?.banner_image_url) || hero;


export const formatPrice = (value: number) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

/** Cotações padrão caso o admin ainda não tenha configurado. */
export const DEFAULT_FX = { usd: 5.4, eur: 5.9 };

/** Converte um valor em reais para outra moeda e formata. */
export const formatForeign = (brl: number, rate: number, currency: "USD" | "EUR") =>
  (Number(brl) / (rate > 0 ? rate : 1)).toLocaleString(currency === "USD" ? "en-US" : "de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/** Mostra "12 ago 2026 → 15 ago 2026" quando há data de volta. */
export const formatRange = (from: string, to?: string | null) =>
  to && to !== from ? `${formatDate(from)} → ${formatDate(to)}` : formatDate(from);

/** Quantos dias faltam para a data (0 = hoje). */
export const daysUntil = (iso: string) => {
  const today = new Date();
  const target = new Date(`${iso}T12:00:00`);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  return Math.round((target.getTime() - start.getTime()) / 86400000);
};

/** Número oficial do proprietário (fallback caso as configurações não carreguem). */
export const DEFAULT_WHATSAPP = "554799030838";

/** Monta o link do WhatsApp com a mensagem já preenchida e detalhada da viagem. */
export function whatsappLink(
  settings: Pick<SiteSettings, "whatsapp_number" | "whatsapp_greeting"> | null | undefined,
  params: {
    tripName: string;
    date?: string;
    returnDate?: string | null;
    people?: number;
    customerName?: string;
    destination?: string | null;
    state?: string | null;
    days?: number | null;
    price?: number | null;
    slug?: string | null;
    general?: boolean;
  },
) {
  const number =
    (settings?.whatsapp_number || DEFAULT_WHATSAPP).replace(/\D/g, "") || DEFAULT_WHATSAPP;
  const greeting = settings?.whatsapp_greeting || "Olá! Tenho interesse na viagem";

  if (params.general) {
    const lines = [
      `${greeting}.`,
      "Gostaria de saber mais sobre os roteiros, datas disponíveis e valores.",
    ];
    return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  const lines: string[] = [`${greeting}:`, `*${params.tripName}*`];

  const local = [params.destination, params.state].filter(Boolean).join(" - ");
  if (local) lines.push(`📍 Destino: ${local}`);
  if (params.date) {
    lines.push(`📅 Saída: ${formatRange(params.date, params.returnDate ?? undefined)}`);
  }
  if (params.days && params.days > 0) lines.push(`⏱️ Duração: ${params.days} dia(s)`);
  if (params.price != null) {
    lines.push(
      params.price > 0 ? `💰 Valor anunciado: ${formatPrice(params.price)} por pessoa` : "💰 Valor: sob consulta",
    );
  }
  if (params.people) lines.push(`👥 Pessoas: ${params.people}`);
  if (params.customerName) lines.push(`🙋 Meu nome: ${params.customerName}`);
  if (params.slug && typeof window !== "undefined") {
    lines.push(`🔗 ${window.location.origin}/viagens/${params.slug}`);
  }
  lines.push("", "Pode me confirmar disponibilidade e os próximos passos?");

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

