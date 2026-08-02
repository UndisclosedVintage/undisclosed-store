import { notFound } from "next/navigation";
import { calificacionGeneral } from "@/lib/products";
import { obtenerProductoPorSlug } from "@/lib/products-store";
import FotoPendiente from "@/components/FotoPendiente";
import SellosQC from "@/components/SellosQC";
import BotonAgregar from "@/components/BotonAgregar";

export const dynamic = "force-dynamic";

const formatoMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default async function FichaProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) notFound();

  const general = calificacionGeneral(producto).toFixed(1);

  return (
    <div className="py-10">
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="relative">
          <FotoPendiente
            lote={producto.lote}
            epoca={producto.epoca}
            imagen={producto.imagen}
            alt={producto.nombre}
          />
          <span className="stamp text-stamp bg-paper text-sm absolute -top-3 -left-3 rotate-[-6deg]">
            calificación {general}/10
          </span>
        </div>

        <div>
          <p className="tab-label text-xs uppercase text-ink/50 mb-1">
            ficha de autenticación · lote {producto.lote}
          </p>
          <h1 className="font-serif text-3xl mb-2">{producto.nombre}</h1>
          <p className="font-mono text-2xl mb-6">
            {formatoMXN.format(producto.precio)}
          </p>

          <dl className="grid grid-cols-2 gap-4 mb-6 font-serif text-sm">
            <div>
              <dt className="tab-label text-[11px] uppercase text-ink/50">
                Talla
              </dt>
              <dd>{producto.talla}</dd>
            </div>
            <div>
              <dt className="tab-label text-[11px] uppercase text-ink/50">
                Época
              </dt>
              <dd>{producto.epoca}</dd>
            </div>
            <div>
              <dt className="tab-label text-[11px] uppercase text-ink/50">
                Origen
              </dt>
              <dd>{producto.origen}</dd>
            </div>
            <div>
              <dt className="tab-label text-[11px] uppercase text-ink/50">
                Categoría
              </dt>
              <dd className="capitalize">{producto.categoria}</dd>
            </div>
          </dl>

          <p className="font-serif text-ink/80 leading-relaxed mb-6 perforated pt-4">
            {producto.descripcion}
          </p>

          <BotonAgregar producto={producto} />
        </div>
      </div>

      <div className="mt-12">
        <p className="tab-label text-xs uppercase text-ink/50 mb-3">
          desglose de control de calidad
        </p>
        <SellosQC qc={producto.qc} />
      </div>
    </div>
  );
}
