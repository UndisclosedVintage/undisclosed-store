"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const formatoMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function Carrito() {
  const { items, remove, subtotal, ready } = useCart();

  if (!ready) return null;

  return (
    <div className="py-10 max-w-2xl">
      <p className="tab-label text-xs uppercase text-ink/50 mb-2">
        expediente en proceso
      </p>
      <h1 className="font-serif text-3xl mb-6">Tu expediente</h1>

      {items.length === 0 ? (
        <div className="manila-card rounded-sm p-8 text-center">
          <p className="font-serif text-ink/70 mb-4">
            Todavía no has agregado piezas a tu expediente.
          </p>
          <Link
            href="/catalogo"
            className="tab-label text-xs uppercase text-stamp hover:underline"
          >
            explorar catálogo →
          </Link>
        </div>
      ) : (
        <div className="manila-card rounded-sm divide-y divide-ink/15">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div>
                <Link
                  href={`/catalogo/${item.slug}`}
                  className="font-serif hover:text-stamp"
                >
                  {item.nombre}
                </Link>
                <p className="tab-label text-[11px] text-ink/50 mt-0.5">
                  talla {item.talla} · lote {item.lote} · pieza única
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono">
                  {formatoMXN.format(item.precio)}
                </span>
                <button
                  onClick={() => remove(item.slug)}
                  className="tab-label text-[11px] uppercase text-stamp hover:underline"
                >
                  quitar
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-4">
            <span className="tab-label text-sm uppercase">Subtotal</span>
            <span className="font-mono text-xl">
              {formatoMXN.format(subtotal)}
            </span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Link
            href="/checkout"
            className="tab-label text-sm uppercase px-6 py-3 bg-stamp text-paper rounded-sm hover:bg-stampdark"
          >
            sellar compra →
          </Link>
        </div>
      )}
    </div>
  );
}
