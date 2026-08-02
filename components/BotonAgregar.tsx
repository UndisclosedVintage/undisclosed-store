"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function BotonAgregar({ producto }: { producto: Product }) {
  const { add, remove, has, ready } = useCart();
  const enExpediente = ready && has(producto.slug);

  if (!producto.stock) {
    return (
      <span className="stamp text-ink/50 border-ink/40 inline-block">
        pieza vendida
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
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
        className={`tab-label text-sm uppercase px-6 py-3 rounded-sm border transition-colors ${
          enExpediente
            ? "border-brass bg-brass/15 text-brass"
            : "border-stamp bg-stamp text-paper hover:bg-stampdark"
        }`}
      >
        {enExpediente ? "en tu expediente ✓" : "agregar al expediente"}
      </button>
      {enExpediente && (
        <Link
          href="/carrito"
          className="tab-label text-xs uppercase text-stamp hover:underline"
        >
          ir al expediente →
        </Link>
      )}
    </div>
  );
}
