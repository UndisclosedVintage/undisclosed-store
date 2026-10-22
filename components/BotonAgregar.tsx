"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useMoneda } from "@/lib/moneda-context";
import { precioEn } from "@/lib/moneda";
import type { Product } from "@/lib/products";

export default function BotonAgregar({ producto }: { producto: Product }) {
  const { add, remove, has, ready } = useCart();
  const { moneda } = useMoneda();
  const enSeleccion = ready && has(producto.slug);
  const disponibleEnMoneda = precioEn(producto, moneda) !== null;

  if (!producto.stock) {
    return (
      <span className="stamp inline-block border-ink/40 text-ink/50">
        pieza vendida
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
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
          className={`tab-label rounded-sm border px-6 py-3 text-sm uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            enSeleccion
              ? "border-brass bg-brass/15 text-brass"
              : "border-stamp bg-stamp text-paper hover:bg-stampdark"
          }`}
        >
          {enSeleccion ? "en tu selección ✓" : "agregar a tu selección"}
        </button>
        {enSeleccion && (
          <Link
            href="/carrito"
            className="tab-label text-xs uppercase text-stamp hover:underline"
          >
            ver tu selección →
          </Link>
        )}
      </div>
      {!disponibleEnMoneda && (
        <p className="font-serif text-sm text-ink/60">
          Esta pieza está disponible solo en pesos mexicanos (MXN). Cambia la
          moneda arriba a la derecha para comprarla.
        </p>
      )}
    </div>
  );
}
