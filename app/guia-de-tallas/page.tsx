import type { Metadata } from "next";
import GuiaMedida from "@/components/GuiaMedida";
import { obtenerCatalogo } from "@/lib/products-store";
import {
  INTRO,
  PASO_FINAL,
  PASO_GENERAL,
  PASOS_BOTTOMS,
  PASOS_TOPS,
} from "@/lib/guia-tallas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "El fit perfecto",
  description:
    "Cómo medir tu prenda favorita y encontrar piezas vintage que te queden exactamente como quieres.",
};

export default async function GuiaDeTallas() {
  const catalogo = await obtenerCatalogo();
  const disponibles = catalogo.filter((p) => p.stock);
  const pechos = disponibles
    .map((p) => p.medidas?.pecho)
    .filter((v): v is number => typeof v === "number");
  const cinturas = disponibles
    .map((p) => p.medidas?.cintura)
    .filter((v): v is number => typeof v === "number");

  return (
    <div className="mx-auto max-w-3xl py-12">
      <p className="tab-label text-xs uppercase text-ink/55">Guía</p>
      <h1 className="font-display text-6xl">El fit perfecto</h1>
      <p className="mt-3 font-serif text-lg text-ink/75">{INTRO}</p>

      <section className="mt-12">
        <h2 className="font-display text-4xl">Mide tu pieza favorita</h2>

        <ol className="mt-4 space-y-5 font-serif">
          <li className="flex gap-3">
            <Numero n={1} />
            <span>{PASO_GENERAL}</span>
          </li>

          <li>
            <p className="tab-label mb-2 text-[11px] uppercase text-ink/55">
              Tops · playeras, camisas, chaquetas, etc.
            </p>
            <ol className="space-y-2">
              {PASOS_TOPS.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <Numero n={2 + i} />
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </li>

          <li>
            <p className="tab-label mb-2 text-[11px] uppercase text-ink/55">
              Bottoms · pantalón, short, falda
            </p>
            <ol className="space-y-2">
              {PASOS_BOTTOMS.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <Numero n={2 + PASOS_TOPS.length + i} />
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </li>

          <li className="flex gap-3">
            <Numero n={2 + PASOS_TOPS.length + PASOS_BOTTOMS.length} />
            <span>{PASO_FINAL}</span>
          </li>
        </ol>

        <div className="mt-8">
          <GuiaMedida pechos={pechos} cinturas={cinturas} />
        </div>
      </section>
    </div>
  );
}

function Numero({ n }: { n: number }) {
  return (
    <span className="tab-label mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-stamp text-xs text-stamp">
      {n}
    </span>
  );
}
