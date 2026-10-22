export type Moneda = "MXN" | "USD";

export const MONEDAS: Moneda[] = ["MXN", "USD"];

const fmtMXN = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
const fmtUSD = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatear(valor: number, moneda: Moneda) {
  const n = moneda === "MXN" ? fmtMXN.format(valor) : fmtUSD.format(valor);
  return `$${n} ${moneda}`;
}

// El precio en USD se escribe a mano en cada pieza (no hay conversión
// automática). Si una pieza no tiene precio en USD, solo se vende en MXN.
export function precioEn(
  p: { precio: number; precioUSD?: number },
  moneda: Moneda
): number | null {
  if (moneda === "MXN") return p.precio;
  return typeof p.precioUSD === "number" && p.precioUSD > 0
    ? p.precioUSD
    : null;
}
