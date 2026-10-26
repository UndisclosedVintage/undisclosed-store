"use client";

import Link from "next/link";
import { useState } from "react";
import GaleriaFotos from "./GaleriaFotos";
import { CATEGORIAS, type Categoria, type Product } from "@/lib/products";

const PAGINA = 24;

export default function ArchivoGrid({ piezas }: { piezas: Product[] }) {
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [visibles, setVisibles] = useState(PAGINA);

  const presentes = CATEGORIAS.filter((c) =>
    piezas.some((p) => p.categoria === c.valor)
  );
  const lista =
    categoria === "todas" ? piezas : piezas.filter((p) => p.categoria === categoria);

  const chip =
    "tab-label rounded-sm border px-2.5 py-1 text-xs transition-colors";

  return (
    <div>
      {presentes.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {(["todas", ...presentes.map((c) => c.valor)] as const).map((v) => {
            const label =
              v === "todas" ? "Todas" : CATEGORIAS.find((c) => c.valor === v)!.label;
            const activo = categoria === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={activo}
                onClick={() => {
                  setCategoria(v);
                  setVisibles(PAGINA);
                }}
                className={`${chip} ${
                  activo
                    ? "border-stamp bg-stamp text-paper"
                    : "border-ink/30 hover:border-stamp"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
        {lista.slice(0, visibles).map((p) => (
          <article key={p.slug}>
            <div className="manila-card overflow-hidden">
              <GaleriaFotos
                imagenes={p.imagenes}
                alt={p.nombre}
                href={`/catalogo/${p.slug}`}
              />
            </div>
            <div className="pt-2.5">
              <p className="tab-label text-[11px] text-ink/55">
                {p.epoca}
                {p.vendidaEn
                  ? ` · ${new Date(p.vendidaEn).toLocaleDateString("es-MX", {
                      month: "short",
                      year: "numeric",
                    })}`
                  : ""}
              </p>
              <Link
                href={`/catalogo/${p.slug}`}
                className="font-serif text-[15px] leading-snug hover:text-stamp"
              >
                {p.nombre}
              </Link>
              <p className="tab-label text-[11px] text-ink/60">talla {p.talla}</p>
            </div>
          </article>
        ))}
      </div>

      {lista.length > visibles && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + PAGINA)}
            className="tab-label rounded-sm border border-ink px-6 py-2.5 text-sm uppercase hover:bg-ink hover:text-paper"
          >
            Ver más
          </button>
        </div>
      )}
    </div>
  );
}
