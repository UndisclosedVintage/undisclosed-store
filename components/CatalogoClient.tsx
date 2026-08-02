"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

const CATEGORIAS = [
  { valor: "todas", label: "todas" },
  { valor: "playeras", label: "playeras" },
  { valor: "chamarras", label: "chamarras" },
  { valor: "pantalones", label: "pantalones" },
  { valor: "accesorios", label: "accesorios" },
] as const;

export default function CatalogoClient({
  productos,
}: {
  productos: Product[];
}) {
  const [categoria, setCategoria] =
    useState<(typeof CATEGORIAS)[number]["valor"]>("todas");

  const filtradas =
    categoria === "todas"
      ? productos
      : productos.filter((p) => p.categoria === categoria);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 perforated pb-6">
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            onClick={() => setCategoria(c.valor)}
            className={`tab-label text-xs uppercase px-3 py-1.5 rounded-sm border ${
              categoria === c.valor
                ? "bg-stamp border-stamp text-paper"
                : "border-ink/25 hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <p className="font-serif text-ink/60">
          No hay piezas archivadas en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtradas.map((p) => (
            <ProductCard key={p.slug} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
