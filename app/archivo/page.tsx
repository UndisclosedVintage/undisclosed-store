import type { Metadata } from "next";
import Link from "next/link";
import ArchivoGrid from "@/components/ArchivoGrid";
import { obtenerCatalogo } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archivo",
  description:
    "Registro fotográfico de las piezas que han pasado por Undisclosed Vintage.",
};

export default async function Archivo() {
  const catalogo = await obtenerCatalogo();
  const vendidas = catalogo
    .filter((p) => !p.stock)
    .sort((a, b) =>
      (b.vendidaEn ?? b.creadoEn).localeCompare(a.vendidaEn ?? a.creadoEn)
    );

  return (
    <div className="py-12">
      <p className="tab-label text-xs uppercase text-ink/55">Registro</p>
      <h1 className="font-display text-6xl leading-none">Archivo</h1>
      <p className="mt-3 max-w-2xl font-serif text-lg text-ink/75">
        Las piezas que han pasado por Undisclosed Vintage. Cada una fue única y
        ya encontró nuevo dueño; aquí queda su registro.
      </p>
      <p className="tab-label mt-2 text-xs text-ink/55">
        {vendidas.length} {vendidas.length === 1 ? "pieza" : "piezas"}
      </p>

      <div className="mt-10">
        {vendidas.length === 0 ? (
          <p className="font-serif text-ink/65">
            Todavía no hay piezas en el archivo. Cuando se venda la primera,
            aparecerá aquí.{" "}
            <Link href="/catalogo" className="text-stamp underline">
              Ver el catálogo
            </Link>
            .
          </p>
        ) : (
          <ArchivoGrid piezas={vendidas} />
        )}
      </div>
    </div>
  );
}
