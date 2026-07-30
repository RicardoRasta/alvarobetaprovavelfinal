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
  date: string;
  spots: number;
};

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
  description: string;
  highlights: string[];
  includes: string[];
  rating: number;
  featured: boolean;
  published: boolean;
  departures?: Departure[];
};

export type SiteSettings = {
  banner_badge: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image_url: string | null;
  whatsapp_number: string;
  whatsapp_greeting: string;
  stats: { label: string; value: string }[];
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

export const tripImage = (trip: Pick<Trip, "slug" | "image_url">) =>
  trip.image_url?.trim() || fallbackImages[trip.slug] || hero;

export const bannerImage = (settings?: Pick<SiteSettings, "banner_image_url"> | null) =>
  settings?.banner_image_url?.trim() || hero;

export const formatPrice = (value: number) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/** Número oficial do proprietário (fallback caso as configurações não carreguem). */
export const DEFAULT_WHATSAPP = "554799030838";

/** Monta o link do WhatsApp com a mensagem já preenchida. */
export function whatsappLink(
  settings: Pick<SiteSettings, "whatsapp_number" | "whatsapp_greeting"> | null | undefined,
  params: { tripName: string; date?: string; people?: number; customerName?: string },
) {
  const number =
    (settings?.whatsapp_number || DEFAULT_WHATSAPP).replace(/\D/g, "") || DEFAULT_WHATSAPP;
  const greeting = settings?.whatsapp_greeting || "Olá! Tenho interesse na viagem";
  const parts = [`${greeting}: *${params.tripName}*.`];
  if (params.date) parts.push(`Data de saída: ${formatDate(params.date)}.`);
  if (params.people) parts.push(`Número de pessoas: ${params.people}.`);
  if (params.customerName) parts.push(`Meu nome é ${params.customerName}.`);
  parts.push("Pode me passar mais detalhes?");
  return `https://wa.me/${number}?text=${encodeURIComponent(parts.join(" "))}`;
}
