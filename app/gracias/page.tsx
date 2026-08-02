"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Gracias() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-16 max-w-lg text-center mx-auto">
      <span className="stamp text-brass border-brass text-lg inline-block mb-6">
        expediente sellado
      </span>
      <h1 className="font-serif text-3xl mb-4">Gracias por tu compra</h1>
      <p className="font-serif text-ink/75 leading-relaxed mb-8">
        Recibimos tu pago y ya estamos preparando tu pieza. Te avisamos por
        correo y WhatsApp en cuanto salga hacia tu domicilio.
      </p>
      <Link
        href="/catalogo"
        className="tab-label text-xs uppercase text-stamp hover:underline"
      >
        seguir explorando el catálogo →
      </Link>
    </div>
  );
}
