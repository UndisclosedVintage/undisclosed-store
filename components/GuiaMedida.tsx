"use client";

import Link from "next/link";
import { useState } from "react";

// Calculadora de "The perfect fit": el usuario escribe el ancho de pecho
// (axila a axila) de una playera que le queda bien y vemos cuántas piezas
// disponibles caen dentro de ±1 pulgada.
export default function GuiaMedida({ pechos }: { pechos: number[] }) {
  const [valor, setValor] = useState("");
  const n = Number(valor.replace(",", "."));
  const valido = Number.isFinite(n) && n >= 12 && n <= 36;
  const min = n - 1;
  const max = n + 1;
  const coinciden = valido ? pechos.filter((p) => p >= min && p <= max).length : 0;

  return (
    <div className="manila-card p-5 sm:p-6">
      <label className="block">
        <span className="tab-label mb-2 block text-[11px] uppercase text-ink/60">
          Mi playera favorita mide (axila a axila, en pulgadas)
        </span>
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          inputMode="decimal"
          placeholder="21"
          className="w-32 rounded-sm border border-ink/30 bg-paper px-3 py-2 font-mono text-lg outline-none focus:border-stamp"
        />
        <span className="ml-2 font-mono text-lg">″</span>
      </label>

      {valor !== "" && !valido && (
        <p className="mt-3 font-serif text-sm text-ink/65">
          Escribe un número entre 12 y 36.
        </p>
      )}

      {valido && (
        <div className="mt-4 font-serif">
          {coinciden > 0 ? (
            <>
              <p>
                Hay{" "}
                <strong>
                  {coinciden} {coinciden === 1 ? "pieza disponible" : "piezas disponibles"}
                </strong>{" "}
                con pecho entre {min}″ y {max}″.
              </p>
              <Link
                href={`/catalogo?pecho=${min}-${max}`}
                className="tab-label mt-3 inline-block rounded-sm border border-stamp bg-stamp px-5 py-2.5 text-sm uppercase text-paper hover:bg-stampdark"
              >
                Ver playeras que te quedan así →
              </Link>
            </>
          ) : (
            <p>
              Por ahora no hay piezas disponibles con esa medida. Revisa los{" "}
              <Link href="/catalogo?coleccion=nuevos" className="text-stamp underline">
                New arrivals
              </Link>
              : entran piezas nuevas seguido.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
