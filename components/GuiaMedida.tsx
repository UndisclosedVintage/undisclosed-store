"use client";

import Link from "next/link";
import { useState } from "react";

type Tipo = "tops" | "bottoms";

// Calculadora de "El fit perfecto": la persona escribe la medida de una prenda
// que le queda bien y mostramos cuántas piezas disponibles caen dentro de
// ±1 pulgada, con un enlace al catálogo ya filtrado.
export default function GuiaMedida({
  pechos,
  cinturas,
}: {
  pechos: number[];
  cinturas: number[];
}) {
  const [tipo, setTipo] = useState<Tipo>("tops");
  const [valor, setValor] = useState("");

  const n = Number(valor.replace(",", "."));
  const valido = Number.isFinite(n) && n >= 10 && n <= 60;
  const min = n - 1;
  const max = n + 1;
  const medidas = tipo === "tops" ? pechos : cinturas;
  const coinciden = valido ? medidas.filter((m) => m >= min && m <= max).length : 0;
  const parametro = tipo === "tops" ? "pecho" : "cintura";

  function elegir(t: Tipo) {
    setTipo(t);
    setValor("");
  }

  return (
    <div className="manila-card p-5 sm:p-6">
      <div role="group" aria-label="Tipo de prenda" className="mb-4 flex gap-2">
        {(
          [
            ["tops", "Tops"],
            ["bottoms", "Bottoms"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            aria-pressed={tipo === t}
            onClick={() => elegir(t)}
            className={`tab-label rounded-sm border px-4 py-1.5 text-xs uppercase transition-colors ${
              tipo === t
                ? "border-stamp bg-stamp text-paper"
                : "border-ink/30 hover:border-stamp"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="tab-label mb-2 block text-[11px] uppercase text-ink/60">
          Mi pieza favorita mide…{" "}
          {tipo === "tops" ? "(axila a axila, en pulgadas)" : "(cintura, en pulgadas)"}
        </span>
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          inputMode="decimal"
          placeholder={tipo === "tops" ? "21" : "32"}
          className="w-32 rounded-sm border border-ink/30 bg-paper px-3 py-2 font-mono text-lg outline-none focus:border-stamp"
        />
        <span className="ml-2 font-mono text-lg">″</span>
      </label>

      {valor !== "" && !valido && (
        <p className="mt-3 font-serif text-sm text-ink/65">
          Escribe un número entre 10 y 60.
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
                con {tipo === "tops" ? "pecho" : "cintura"} entre {min}″ y {max}″.
              </p>
              <Link
                href={`/catalogo?${parametro}=${min}-${max}`}
                className="tab-label mt-3 inline-block rounded-sm border border-stamp bg-stamp px-5 py-2.5 text-sm uppercase text-paper hover:bg-stampdark"
              >
                Ver piezas con esa medida →
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
