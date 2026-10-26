import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { enlaceWhatsApp, site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Vende tus piezas",
  description:
    "¿Tienes ropa vintage? Cuéntanos qué tienes y vemos si encaja en Undisclosed Vintage.",
};

const PASOS = [
  {
    t: "Cuéntanos qué tienes",
    d: "Escríbenos con fotos claras de cada pieza (frente, espalda y etiqueta) y lo que sepas de ella.",
  },
  {
    t: "Revisamos tu selección",
    d: "Vemos qué piezas encajan con lo que manejamos y te contestamos con una propuesta.",
  },
  {
    t: "Acordamos los términos",
    d: "Hablamos de cómo se trabaja la consigna y de las condiciones antes de que nos entregues nada.",
  },
  {
    t: "Las ponemos en la tienda",
    d: "Fotografiamos, medimos y publicamos cada pieza.",
  },
];

export default function Consigna() {
  const wa = enlaceWhatsApp(
    "Hola, quiero consignar piezas vintage en Undisclosed Vintage."
  );

  return (
    <div className="mx-auto max-w-3xl py-12">
      <p className="tab-label text-xs uppercase text-ink/55">Consigna</p>
      <h1 className="font-display text-6xl">Vende tus piezas</h1>
      <p className="mt-3 font-serif text-lg text-ink/75">
        Si tienes piezas vintage guardadas listas para encontrar un nuevo dueño
        podemos venderlas por ti.
      </p>

      <ol className="mt-10 space-y-4">
        {PASOS.map((p, i) => (
          <li key={p.t} className="manila-card flex gap-4 p-5">
            <span className="font-display text-5xl leading-none text-stamp">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-2xl">{p.t}</h2>
              <p className="font-serif text-ink/75">{p.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="relative mt-10 overflow-hidden bg-verde/60 p-6 sm:p-8">
        <h2 className="font-display text-4xl">¿Empezamos?</h2>
        <p className="mt-1 max-w-md font-serif">
          Mándanos fotos de lo que quieres consignar.
        </p>
        <div className="mt-4">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="tab-label inline-block rounded-sm border border-ink bg-ink px-6 py-3 text-sm uppercase text-paper hover:bg-stamp"
            >
              Escribir por WhatsApp
            </a>
          ) : (
            <Link
              href="/contacto"
              className="tab-label inline-block rounded-sm border border-ink bg-ink px-6 py-3 text-sm uppercase text-paper hover:bg-stamp"
            >
              Ir a contacto
            </Link>
          )}
        </div>
        <Image
          src={site.logos.azulExplosion}
          alt=""
          width={900}
          height={513}
          className="pointer-events-none absolute -bottom-6 -right-6 hidden h-40 w-auto sm:block"
        />
      </div>
    </div>
  );
}
