import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Quiénes somos: ${site.nombre}, ropa vintage desde ${site.ciudad}.`,
};

export default function Nosotros() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <Image
        src={site.logos.pinchos}
        alt=""
        width={900}
        height={552}
        className="h-24 w-auto"
      />
      <h1 className="mt-4 font-display text-6xl">Nosotros</h1>
      <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-ink/80">
        <p>
          {site.nombre} es una tienda de ropa vintage con base en la Colonia
          Americana, Guadalajara. Seleccionamos cada pieza a mano, la medimos y
          la fotografiamos para que sepas exactamente lo que estás comprando.
        </p>
        <p>
          Todo lo que vendemos es único. Si algo te gusta, es probable que no
          vuelva a aparecer.
        </p>
      </div>
      <Link
        href="/catalogo?coleccion=nuevos"
        className="tab-label mt-8 inline-block text-sm uppercase text-stamp hover:underline"
      >
        Ver New arrivals →
      </Link>
    </div>
  );
}
