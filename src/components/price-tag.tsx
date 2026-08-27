import { useQuery } from "@tanstack/react-query";
import { DEFAULT_FX, formatForeign, formatPrice } from "@/data/trips";
import { liveFxQuery, settingsQuery } from "@/lib/api";

/**
 * Preço principal em reais e, abaixo, a conversão aproximada em dólar e euro.
 * Usa a cotação automática do dia; se indisponível, cai para a cotação manual
 * definida em /admin/configuracoes.
 */
export function PriceTag({
  value,
  size = "md",
  className = "",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { data: settings } = useQuery(settingsQuery);
  const { data: liveFx } = useQuery(liveFxQuery);
  const usd =
    Number(liveFx?.usd) > 0
      ? Number(liveFx?.usd)
      : Number(settings?.fx_usd) > 0
        ? Number(settings?.fx_usd)
        : DEFAULT_FX.usd;
  const eur =
    Number(liveFx?.eur) > 0
      ? Number(liveFx?.eur)
      : Number(settings?.fx_eur) > 0
        ? Number(settings?.fx_eur)
        : DEFAULT_FX.eur;


  const mainCls =
    size === "lg"
      ? "font-display text-4xl font-bold"
      : size === "sm"
        ? "text-base font-bold"
        : "text-xl font-bold";

  if (!value || value <= 0) {
    return <span className={`${mainCls} ${className}`}>Sob consulta</span>;
  }

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className={mainCls}>{formatPrice(value)}</span>
      <span className="text-xs text-muted-foreground">
        ≈ {formatForeign(value, usd, "USD")} · {formatForeign(value, eur, "EUR")}
      </span>
    </span>
  );
}
