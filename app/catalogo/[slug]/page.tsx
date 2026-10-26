import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonAgregar from "@/components/BotonAgregar";
import GaleriaFotos from "@/components/GaleriaFotos";
import Precio from "@/components/Precio";
import ProductCard from "@/components/ProductCard";
import { obtenerCatalogo, obtenerProductoPorSlug } from "@/lib/products-store";
import { CATEGORIAS, folioVisible } from "@/lib/products";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await obtenerProductoPorSlug(slug);
  if (!p) return { title: "Pieza no encontrada" };
  return {
    title: `${p.nombre} (${p.epoca})`,
    description: p.descripcion.slice(0, 160),
    openGraph: p.imagenes?.[0] ? { images: [p.imagenes[0]] } : undefined,
  };
}

export default async function Pieza({ params }: Props) {
  const { slug } = await params;
  const p = await obtenerProductoPorSlug(slug);
  if (!p) notFound();

  const catalogo = await obtenerCatalogo();
  const relacionadas = catalogo
    .filter((x) => x.slug !== p.slug && x.stock && x.categoria === p.categoria)
    .slice(0, 4);
  const categoria = CATEGORIAS.find((c) => c.valor === p.categoria);

  const datos: [string, string][] = [
    ["Folio", folioVisible(p.lote)],
    ["Época", p.epoca],
    ["Talla", p.talla],
  ];
  if (p.medidas?.pecho) datos.push(["Pecho (axila a axila)", `${p.medidas.pecho}″`]);
  if (p.medidas?.cintura) datos.push(["Cintura", `${p.medidas.cintura}″`]);
  if (p.medidas?.largo) datos.push(["Largo", `${p.medidas.largo}″`]);
  if (p.origen) datos.push(["Origen", p.origen]);

  return (
    <div className="py-8">
      <nav className="tab-label mb-6 text-[11px] uppercase text-ink/55">
        <Link href="/catalogo" className="hover:text-stamp">
          Catálogo
        </Link>
        {categoria && (
          <>
            {" / "}
            <Link
              href={`/catalogo?categoria=${categoria.valor}`}
              className="hover:text-stamp"
            >
              {categoria.label}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
        <div className="manila-card self-start overflow-hidden p-2">
          <GaleriaFotos
            imagenes={p.imagenes}
            alt={p.nombre}
            vendida={!p.stock}
            miniaturas
            prioridad
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="tab-label text-xs text-ink/55">
              {p.epoca} · {folioVisible(p.lote)}
            </p>
            <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl">
              {p.nombre}
            </h1>
          </div>

          <Precio
            precio={p.precio}
            precioUSD={p.precioUSD}
            className={`text-2xl ${p.stock ? "" : "text-ink/40 line-through"}`}
          />
          <p className="tab-label -mt-3 text-[11px] uppercase text-ink/50">
            + envío al finalizar tu compra
          </p>

          <BotonAgregar producto={p} />

          <div className="perforated pt-5">
            <h2 className="tab-label mb-3 text-[11px] uppercase text-ink/55">
              Ficha de la pieza
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-serif text-[15px]">
              {datos.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink/60">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 whitespace-pre-line font-serif text-[15px] leading-relaxed">
              {p.descripcion}
            </p>
            <Link
              href="/guia-de-tallas"
              className="tab-label mt-3 inline-block text-xs uppercase text-stamp hover:underline"
            >
              ¿Cómo me queda? El fit perfecto →
            </Link>
          </div>

          <div className="border border-ink/20 bg-kraftlight p-4">
            <p className="tab-label mb-1 text-[11px] uppercase text-ink/55">
              Antes de comprar
            </p>
            <p className="font-serif text-sm leading-relaxed text-ink/80">
              {site.avisoVintage}
            </p>
          </div>
        </div>
      </div>

      {relacionadas.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-5 font-display text-3xl">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
            {relacionadas.map((r) => (
              <ProductCard key={r.slug} producto={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
