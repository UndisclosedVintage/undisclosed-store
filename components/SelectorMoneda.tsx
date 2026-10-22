"use client";

import { useMoneda } from "@/lib/moneda-context";
import type { Moneda } from "@/lib/moneda";

const OPCIONES: Moneda[] = ["MXN", "USD"];

export default function SelectorMoneda() {
  const { moneda, setMoneda } = useMoneda();

  return (
    <div
      role="group"
      aria-label="Moneda"
      className="tab-label inline-flex overflow-hidden rounded-sm border border-ink/30 text-[11px]"
    >
      {OPCIONES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMoneda(m)}
          aria-pressed={moneda === m}
          className={`px-2.5 py-1 transition-colors ${
            moneda === m ? "bg-ink text-paper" : "hover:bg-ink/10"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
