import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { obtenerCatalogo } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const productos = await obtenerCatalogo();
  const destacadas = productos.slice(0, 4);
  const fecha = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <div>
      <section className="pt-10 sm:pt-16 pb-14">
        <div className="manila-card rounded-sm p-6 sm:p-10 relative">
          <span className="stamp text-stamp text-sm absolute -top-4 right-6 bg-paper">
            expediente {fecha}
          </span>
          <p className="tab-label text-xs uppercase text-ink/50 mb-3">
            undisclosed vintage · colonia americana, guadalajara
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl leading-tight max-w-xl">
            Cada prenda tiene un expediente. Nosotros lo abrimos por ti.
          </h1>
          <p className="font-serif text-base sm:text-lg text-ink/75 mt-4 max-w-lg">
            Ocho años buscando, autenticando y calificando ropa vintage.
            Ninguna pieza entra a la tienda sin pasar antes por nuestro
            sistema de control de calidad de cinco criterios.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="tab-label text-xs uppercase px-5 py-3 bg-stamp text-paper rounded-sm hover:bg-stampdark"
            >
              ver expediente completo
            </Link>
            <Link
              href="/nosotros"
              className="tab-label text-xs uppercase px-5 py-3 border border-ink/30 rounded-sm hover:border-ink"
            >
              cómo calificamos las piezas
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl">Últimas piezas archivadas</h2>
          <Link
            href="/catalogo"
            className="tab-label text-xs uppercase text-stamp hover:underline"
          >
            ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {destacadas.map((p) => (
            <ProductCard key={p.slug} producto={p} />
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="bg-blackout text-paper rounded-sm p-8 sm:p-10 grid sm:grid-cols-5 gap-6 items-center">
          <div className="sm:col-span-3">
            <p className="tab-label text-xs uppercase text-stamp mb-2">
              sistema de autenticación
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl leading-snug">
              Concepto, Época, Rareza, Condición y Estética — cada prenda se
              califica antes de salir a piso.
            </h2>
          </div>
          <div className="sm:col-span-2 font-serif text-sm text-paper/70 leading-relaxed">
            Es el mismo sistema que usamos internamente para decidir qué
            entra a la colección. Aquí lo hacemos visible para que compres
            con la misma información que nosotros.
          </div>
        </div>
      </section>
    </div>
  );
}
