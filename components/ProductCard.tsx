"use client";

import Link from "next/link";
import GaleriaFotos from "./GaleriaFotos";
import Precio from "./Precio";
import { useCart } from "@/lib/cart-context";
import { useMoneda } from "@/lib/moneda-context";
import { precioEn } from "@/lib/moneda";
import { folioVisible, type Product } from "@/lib/products";

export default function ProductCard({
  producto,
  prioridad = false,
}: {
  producto: Product;
  prioridad?: boolean;
}) {
  const { add, remove, has, ready } = useCart();
  const { moneda } = useMoneda();
  const enSeleccion = ready && has(producto.slug);
  const disponibleEnMoneda = precioEn(producto, moneda) !== null;
  const href = `/catalogo/${producto.slug}`;
  const m = producto.medidas;

  return (
    <article className="flex flex-col">
      <div className="manila-card overflow-hidden">
        <GaleriaFotos
          imagenes={producto.imagenes}
          alt={producto.nombre}
          href={href}
          vendida={!producto.stock}
          prioridad={prioridad}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-2.5">
        <p className="tab-label text-[11px] uppercase text-ink/55">
          {producto.epoca} · {folioVisible(producto.lote)}
        </p>
        <Link
          href={href}
          className="font-serif text-[15px] leading-snug hover:text-stamp"
        >
          {producto.nombre}
        </Link>
        <p className="tab-label text-[11px] text-ink/60">
          talla {producto.talla}
          {m?.pecho ? ` · pecho ${m.pecho}″` : ""}
          {m?.largo ? ` · largo ${m.largo}″` : ""}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <Precio
            precio={producto.precio}
            precioUSD={producto.precioUSD}
            className={`text-base ${producto.stock ? "" : "text-ink/40 line-through"}`}
          />
          {producto.stock ? (
            <button
              disabled={!disponibleEnMoneda}
              onClick={() =>
                enSeleccion
                  ? remove(producto.slug)
                  : add({
                      slug: producto.slug,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      precioUSD: producto.precioUSD,
                      talla: producto.talla,
                      lote: producto.lote,
                      categoria: producto.categoria,
                      imagen: producto.imagenes?.[0],
                    })
              }
              className={`tab-label rounded-sm border px-2.5 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                enSeleccion
                  ? "border-brass bg-brass/15 text-brass"
                  : "border-stamp text-stamp hover:bg-stamp hover:text-paper"
              }`}
            >
              {enSeleccion ? "en tu selección ✓" : "agregar"}
            </button>
          ) : (
            <span className="tab-label text-xs text-ink/40">vendida</span>
          )}
        </div>
      </div>
    </article>
  );
}
