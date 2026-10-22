import type { Metadata } from "next";
import Link from "next/link";
import GuiaMedida from "@/components/GuiaMedida";
import { obtenerCatalogo } from "@/lib/products-store";
import { AJUSTES, PASOS_MEDIR, TABLA_TALLAS } from "@/lib/guia-tallas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The perfect fit",
  description:
    "Cómo leer las medidas de la ropa vintage y encontrar piezas que te queden exactamente como quieres.",
};

export default async function GuiaDeTallas() {
  const catalogo = await obtenerCatalogo();
  const pechos = catalogo
    .filter((p) => p.stock && p.medidas?.pecho)
    .map((p) => p.medidas!.pecho as number);

  return (
    <div className="mx-auto max-w-3xl py-12">
      <p className="tab-label text-xs uppercase text-ink/55">Guía</p>
      <h1 className="font-display text-6xl">The perfect fit</h1>
      <p className="mt-3 font-serif text-lg text-ink/75">
        La talla de la etiqueta casi nunca coincide con la de hoy: las prendas
        vintage encogen, se estiran y se cortaban distinto. Por eso medimos cada
        pieza en pulgadas. Lo único que necesitas es una playera que ya te
        quede como te gusta.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-4xl">Mide tu playera favorita</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 font-serif">
          {PASOS_MEDIR.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
        <div className="mt-6">
          <GuiaMedida pechos={pechos} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-4xl">Shirts that fit like…</h2>
        <p className="mt-2 font-serif text-ink/70">
          Elige cómo quieres que caiga y te llevamos a las piezas con esa medida.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {AJUSTES.map((a) => (
            <Link
              key={a.clave}
              href={`/catalogo?pecho=${a.pecho[0]}-${a.pecho[1]}`}
              className="manila-card group block p-5"
            >
              <p className="tab-label text-[11px] uppercase text-ink/55">
                Pecho {a.pecho[0]}–{a.pecho[1]}″
              </p>
              <h3 className="font-display text-3xl group-hover:text-stamp">
                {a.titulo}
              </h3>
              <p className="mt-1 font-serif text-sm text-ink/70">{a.descripcion}</p>
              <span className="tab-label mt-3 inline-block text-xs uppercase text-stamp">
                Ver piezas →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-4xl">Referencia por talla</h2>
        <p className="mt-2 font-serif text-sm text-ink/65">
          Solo orientativa. Manda siempre la medida real de cada pieza.
        </p>
        <table className="mt-4 w-full max-w-sm border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-ink/30 text-left">
              <th className="py-2 font-medium">Talla</th>
              <th className="py-2 font-medium">Pecho aprox.</th>
            </tr>
          </thead>
          <tbody>
            {TABLA_TALLAS.map((t) => (
              <tr key={t.talla} className="border-b border-ink/10">
                <td className="py-2">{t.talla}</td>
                <td className="py-2">{t.pecho}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
