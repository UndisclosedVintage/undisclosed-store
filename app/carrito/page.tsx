"use client";

import Image from "next/image";
import Link from "next/link";
import Precio from "@/components/Precio";
import { useCart } from "@/lib/cart-context";
import { useMoneda } from "@/lib/moneda-context";
import { calcularEnvio, etiquetaEnvio } from "@/lib/envio";
import { formatear, precioEn } from "@/lib/moneda";
import { folioVisible } from "@/lib/products";

export default function Carrito() {
  const { items, remove, subtotal, sinPrecio, ready } = useCart();
  const { moneda } = useMoneda();

  if (!ready) return <div className="min-h-[50vh] py-12" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-5xl">Tu selección está vacía</h1>
        <p className="mt-3 font-serif text-ink/65">
          Cuando agregues piezas aparecerán aquí.
        </p>
        <Link
          href="/catalogo?coleccion=nuevos"
          className="tab-label mt-6 inline-block rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark"
        >
          Ver New arrivals
        </Link>
      </div>
    );
  }

  const faltantes = sinPrecio(moneda);
  const sub = subtotal(moneda);
  const envio = calcularEnvio(moneda, items.length);
  const total = sub + envio;

  return (
    <div className="py-10">
      <h1 className="font-display text-5xl">Tu selección</h1>
      <p className="tab-label mt-1 text-xs uppercase text-ink/55">
        {items.length} {items.length === 1 ? "pieza" : "piezas"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-ink/15 border-y border-ink/15">
          {items.map((i) => {
            const falta = precioEn(i, moneda) === null;
            return (
              <li key={i.slug} className="flex gap-4 py-4">
                <Link
                  href={`/catalogo/${i.slug}`}
                  className="relative block h-28 w-24 shrink-0 bg-paper"
                >
                  {i.imagen && (
                    <Image
                      src={i.imagen}
                      alt={i.nombre}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <p className="tab-label text-[11px] uppercase text-ink/55">
                    {folioVisible(i.lote)} · talla {i.talla}
                  </p>
                  <Link
                    href={`/catalogo/${i.slug}`}
                    className="font-serif leading-snug hover:text-stamp"
                  >
                    {i.nombre}
                  </Link>
                  {falta && (
                    <p className="mt-1 font-serif text-sm text-stamp">
                      Esta pieza no tiene precio en {moneda}. Cambia a MXN o
                      quítala.
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Precio precio={i.precio} precioUSD={i.precioUSD} />
                    <button
                      type="button"
                      onClick={() => remove(i.slug)}
                      className="tab-label text-xs uppercase text-ink/55 hover:text-stamp"
                    >
                      quitar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="manila-card h-fit p-5">
          <h2 className="tab-label mb-4 text-[11px] uppercase text-ink/55">
            Resumen
          </h2>
          <dl className="space-y-2 font-serif text-[15px]">
            <div className="flex justify-between">
              <dt>Piezas</dt>
              <dd className="font-mono">{formatear(sub, moneda)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{etiquetaEnvio(moneda)}</dt>
              <dd className="font-mono">{formatear(envio, moneda)}</dd>
            </div>
            <div className="perforated flex justify-between pt-3 text-lg">
              <dt>Total</dt>
              <dd className="font-mono">{formatear(total, moneda)}</dd>
            </div>
          </dl>
          <p className="mt-3 font-serif text-xs text-ink/55">
            {moneda === "MXN"
              ? "Pago con tarjeta, transferencia o efectivo vía Mercado Pago."
              : "Pago con tarjeta vía Stripe. Envío internacional."}
          </p>
          {faltantes.length > 0 ? (
            <p className="mt-4 font-serif text-sm text-stamp">
              Quita o cambia las piezas sin precio en {moneda} para continuar.
            </p>
          ) : (
            <Link
              href="/checkout"
              className="tab-label mt-4 block rounded-sm border border-stamp bg-stamp px-6 py-3 text-center text-sm uppercase text-paper hover:bg-stampdark"
            >
              Continuar al pago
            </Link>
          )}
          <Link
            href="/catalogo"
            className="tab-label mt-3 block text-center text-xs uppercase text-ink/60 hover:text-stamp"
          >
            ← Seguir viendo piezas
          </Link>
        </aside>
      </div>
    </div>
  );
}
