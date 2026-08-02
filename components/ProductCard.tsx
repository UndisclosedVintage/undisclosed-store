"use client";

import Link from "next/link";
import FotoPendiente from "./FotoPendiente";
import SellosQC from "./SellosQC";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

const formatoMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function ProductCard({ producto }: { producto: Product }) {
  const { add, remove, has, ready } = useCart();
  const enExpediente = ready && has(producto.slug);

  return (
    <div className="manila-card rounded-sm overflow-hidden flex flex-col">
      <Link href={`/catalogo/${producto.slug}`} className="block">
        <FotoPendiente
          lote={producto.lote}
          epoca={producto.epoca}
          imagen={producto.imagen}
          alt={producto.nombre}
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <Link
            href={`/catalogo/${producto.slug}`}
            className="font-serif text-base leading-snug hover:text-stamp"
          >
            {producto.nombre}
          </Link>
          <p className="tab-label text-[11px] text-ink/60 mt-0.5">
            talla {producto.talla} · lote {producto.lote}
          </p>
        </div>
        <SellosQC qc={producto.qc} compact />
        <div className="mt-auto pt-2 flex items-center justify-between perforated">
          <span className="font-mono text-lg pt-2">
            {formatoMXN.format(producto.precio)}
          </span>
          {producto.stock ? (
            <button
              onClick={() =>
                enExpediente
                  ? remove(producto.slug)
                  : add({
                      slug: producto.slug,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      talla: producto.talla,
                      lote: producto.lote,
                      categoria: producto.categoria,
                    })
              }
              className={`mt-2 tab-label text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                enExpediente
                  ? "border-brass bg-brass/15 text-brass"
                  : "border-stamp text-stamp hover:bg-stamp hover:text-paper"
              }`}
            >
              {enExpediente ? "en tu expediente ✓" : "agregar"}
            </button>
          ) : (
            <span className="mt-2 tab-label text-xs px-3 py-1.5 rounded-sm border border-ink/20 text-ink/40">
              vendida
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
