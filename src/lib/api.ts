import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Activity, Departure, SiteSettings, Trip } from "@/data/trips";

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

export const bookingsQuery = queryOptions({
  queryKey: ["booking_requests"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const nextDeparture = (trip: Trip) => {
  const today = new Date().toISOString().slice(0, 10);
  return (trip.departures ?? []).filter((d) => d.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
};
