import { createServerFn } from "@tanstack/react-start";

export type LiveFx = { usd: number; eur: number; updatedAt: string } | null;

/**
 * Busca a cotação atual de USD e EUR em reais (fonte: AwesomeAPI).
 * Retorna null se a fonte estiver indisponível — o app usa então a cotação manual.
 */
export const getLiveFx = createServerFn({ method: "GET" }).handler(async (): Promise<LiveFx> => {
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL", {
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, { bid?: string; create_date?: string }>;
    const usd = Number(json?.USDBRL?.bid);
    const eur = Number(json?.EURBRL?.bid);
    if (!(usd > 0) || !(eur > 0)) return null;
    return {
      usd,
      eur,
      updatedAt: json?.USDBRL?.create_date ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
});
