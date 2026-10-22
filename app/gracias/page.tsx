"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { enlaceWhatsApp, site } from "@/lib/site-config";

export default function Gracias() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const wa = enlaceWhatsApp("Hola, acabo de hacer un pedido en Undisclosed Vintage.");

  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <Image
        src={site.logos.verde}
        alt=""
        width={900}
        height={486}
        className="mx-auto h-28 w-auto"
      />
      <h1 className="mt-6 font-display text-5xl">¡Gracias por tu compra!</h1>
      <p className="mt-3 font-serif text-ink/70">
        Recibimos tu pedido. En cuanto confirmemos el pago, te escribimos con los
        detalles del envío. Si ves algo mal, contáctanos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/catalogo"
          className="tab-label rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark"
        >
          Seguir viendo piezas
        </Link>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="tab-label rounded-sm border border-ink px-6 py-3 text-sm uppercase hover:bg-ink hover:text-paper"
          >
            Escríbenos por WhatsApp
          </a>
        ) : (
          <Link
            href="/contacto"
            className="tab-label rounded-sm border border-ink px-6 py-3 text-sm uppercase hover:bg-ink hover:text-paper"
          >
            Contacto
          </Link>
        )}
      </div>
    </div>
  );
}
