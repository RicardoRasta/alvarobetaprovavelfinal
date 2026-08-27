import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  Activity,
  BlogPost,
  Certificate,
  Departure,
  SiteSettings,
  Tag,
  Testimonial,
  Trip,
} from "@/data/trips";

export const activitiesQuery = queryOptions({
  queryKey: ["activities"],
  queryFn: async (): Promise<Activity[]> => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Activity[];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return (data as unknown as SiteSettings) ?? null;
  },
});

async function fetchTrips(): Promise<Trip[]> {
  const [{ data: trips, error }, { data: departures, error: depError }] = await Promise.all([
    supabase.from("trips").select("*").order("created_at", { ascending: true }),
    supabase.from("departures").select("*").order("date", { ascending: true }),
  ]);
  if (error) throw error;
  if (depError) throw depError;
  const byTrip = new Map<string, Departure[]>();
  for (const d of (departures ?? []) as Departure[]) {
    const list = byTrip.get(d.trip_id) ?? [];
    list.push(d);
    byTrip.set(d.trip_id, list);
  }
  return ((trips ?? []) as unknown as Trip[]).map((t) => ({
    ...t,
    departures: byTrip.get(t.id) ?? [],
  }));
}

export const tripsQuery = queryOptions({
  queryKey: ["trips"],
  queryFn: fetchTrips,
});

export type BookingRequest = {
  id: string;
  trip_id: string | null;
  trip_name: string;
  customer_name: string;
  contact: string | null;
  departure_date: string | null;
  people: number;
  status: string;
  created_at: string;
};

export const bookingsQuery = queryOptions({
  queryKey: ["booking_requests"],
  queryFn: async (): Promise<BookingRequest[]> => {
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as BookingRequest[];
  },
});

export type WhatsAppClick = {
  id: string;
  trip_id: string | null;
  trip_name: string;
  source: "card" | "trip_page" | "fab";
  departure_date: string | null;
  created_at: string;
};

export const whatsappClicksQuery = queryOptions({
  queryKey: ["whatsapp_clicks"],
  queryFn: async (): Promise<WhatsAppClick[]> => {
    const { data, error } = await supabase
      .from("whatsapp_clicks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []) as unknown as WhatsAppClick[];
  },
});

/** Registra um clique em "Agendar no WhatsApp" para acompanhamento de leads. */
export async function logWhatsAppClick(input: {
  tripId?: string | null;
  tripName: string;
  source: WhatsAppClick["source"];
  departureDate?: string | null;
}) {
  try {
    await supabase.from("whatsapp_clicks").insert({
      trip_id: input.tripId ?? null,
      trip_name: input.tripName.slice(0, 160),
      source: input.source,
      departure_date: input.departureDate || null,
    });
  } catch {
    /* nunca bloquear o envio ao WhatsApp */
  }
}

export const nextDeparture = (trip: Trip) => {
  const today = new Date().toISOString().slice(0, 10);
  return (trip.departures ?? []).filter((d) => d.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
};

/** Ordena roteiros pela saída mais próxima; sem data marcada vai para o fim. */
export const sortByNextDeparture = <T extends Trip>(trips: T[]): T[] =>
  [...trips].sort((a, b) => {
    const da = nextDeparture(a)?.date;
    const db = nextDeparture(b)?.date;
    if (da && db) return da.localeCompare(db);
    if (da) return -1;
    if (db) return 1;
    return a.name.localeCompare(b.name);
  });


/* ---------- Tags ---------- */
export const tagsQuery = queryOptions({
  queryKey: ["tags"],
  queryFn: async (): Promise<Tag[]> => {
    const { data, error } = await supabase.from("tags").select("*").order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Tag[];
  },
});

/* ---------- Certificados ---------- */
export const certificatesQuery = queryOptions({
  queryKey: ["certificates"],
  queryFn: async (): Promise<Certificate[]> => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Certificate[];
  },
});

/* ---------- Comentários ---------- */
export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials", "approved"],
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Testimonial[];
  },
});

export const allTestimonialsQuery = queryOptions({
  queryKey: ["testimonials", "all"],
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Testimonial[];
  },
});

/* ---------- Blog ---------- */
export const blogQuery = queryOptions({
  queryKey: ["blog_posts"],
  queryFn: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as BlogPost[];
  },
});

/* ---------- Fichas de inscrição ---------- */
export type EnrollmentLink = {
  id: string;
  token: string;
  trip_id: string | null;
  trip_name: string;
  active: boolean;
  created_at: string;
};

export const enrollmentLinksQuery = queryOptions({
  queryKey: ["enrollment_links"],
  queryFn: async (): Promise<EnrollmentLink[]> => {
    const { data, error } = await supabase
      .from("enrollment_links")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as EnrollmentLink[];
  },
});

export type Enrollment = Record<string, string | boolean | number | null> & {
  id: string;
  trip_name: string;
  full_name: string;
  created_at: string;
};

export const enrollmentsQuery = queryOptions({
  queryKey: ["enrollments"],
  queryFn: async (): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Enrollment[];
  },
});
