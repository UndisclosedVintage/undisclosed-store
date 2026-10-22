import type { Moneda } from "./moneda";

// Tarifas de envío según cuántas piezas lleva el pedido.
//
//  - MXN = envío nacional (México).
//  - USD = envío internacional.
//
// Confirmado: 1 pieza = $70 MXN nacional y $250 MXN internacional.
// El monto internacional se expresa en USD porque ese checkout cobra en
// dólares: $250 MXN ≈ $15 USD (tipo de cambio de referencia ~17). AJÚSTALO.
//
// Para agregar escalones, añade filas ordenadas de menor a mayor, por ejemplo:
//   { hasta: 1, monto: 70 }, { hasta: 3, monto: 110 }, { hasta: 6, monto: 170 }
// Si un pedido tiene más piezas que el último escalón, se cobra el último
// monto por cada bloque completo de piezas (con un solo escalón: monto × piezas).
export interface Tramo {
  hasta: number;
  monto: number;
}

export const TARIFAS: Record<Moneda, Tramo[]> = {
  MXN: [{ hasta: 1, monto: 70 }],
  USD: [{ hasta: 1, monto: 15 }],
};

export function calcularEnvio(moneda: Moneda, piezas: number): number {
  if (piezas <= 0) return 0;
  const tabla = TARIFAS[moneda];
  const tramo = tabla.find((t) => piezas <= t.hasta);
  if (tramo) return tramo.monto;
  const ultimo = tabla[tabla.length - 1];
  return ultimo.monto * Math.ceil(piezas / ultimo.hasta);
}

export function etiquetaEnvio(moneda: Moneda) {
  return moneda === "MXN" ? "Envío nacional" : "Envío internacional";
}
