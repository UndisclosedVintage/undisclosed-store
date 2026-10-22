"use client";

import { useMoneda } from "@/lib/moneda-context";
import { formatear, precioEn } from "@/lib/moneda";

export default function Precio({
  precio,
  precioUSD,
  className = "",
}: {
  precio: number;
  precioUSD?: number;
  className?: string;
}) {
  const { moneda } = useMoneda();
  const valor = precioEn({ precio, precioUSD }, moneda);

  if (valor === null) {
    return (
      <span className={`tab-label text-xs text-ink/55 ${className}`}>
        solo en MXN
      </span>
    );
  }
  return <span className={`font-mono ${className}`}>{formatear(valor, moneda)}</span>;
}
