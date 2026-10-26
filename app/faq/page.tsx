import type { Metadata } from "next";
import Link from "next/link";
import { TARIFAS } from "@/lib/envio";
import { formatear } from "@/lib/moneda";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Envíos, pagos, tallas y devoluciones en Undisclosed Vintage.",
};

const PREGUNTAS: { p: string; r: React.ReactNode }[] = [
  {
    p: "¿No la tienen en otra talla?",
    r: "No. Cada pieza es vintage y, por lo tanto, única. Cuando se vende, desaparece del catálogo o queda marcada como vendida.",
  },
  {
    p: "¿Cómo sé si me va a quedar?",
    r: (
      <>
        Medimos cada pieza en pulgadas (ancho y largo). Mide una pieza que ya
        te quede bien y compárala con la medida de la ficha. Más detalle en{" "}
        <Link href="/guia-de-tallas" className="text-stamp underline">
          El fit perfecto
        </Link>
        .
      </>
    ),
  },
  {
    p: "¿Cuánto cuesta el envío?",
    r: (
      <>
        Envío nacional: {formatear(TARIFAS.MXN[0].monto, "MXN")} por pieza.
        Envío internacional: {formatear(TARIFAS.USD[0].monto, "USD")} por pieza.
        El total exacto lo ves en tu selección antes de pagar. El costo puede
        cambiar dependiendo del peso de “Tu selección” final.
      </>
    ),
  },
  {
    p: "¿Qué formas de pago aceptan?",
    r: "En pesos (MXN) pagas con Mercado Pago. En dólares (USD), con tarjeta a través de Stripe. Puedes cambiar de moneda arriba a la derecha.",
  },
  {
    p: "¿Envían fuera de México?",
    r: "Sí, a los países que aparecen al pagar en USD.",
  },
  {
    p: "¿Aceptan devoluciones?",
    r: site.avisoVintage,
  },
  {
    p: "¿Puedo apartar una pieza?",
    r: (
      <>
        Escríbenos desde la página de{" "}
        <Link href="/contacto" className="text-stamp underline">
          contacto
        </Link>{" "}
        y lo platicamos.
      </>
    ),
  },
  {
    p: "¿Puedo vender mi ropa vintage con ustedes?",
    r: (
      <>
        Sí, tenemos consigna. Mira cómo funciona en{" "}
        <Link href="/consigna" className="text-stamp underline">
          Vende tus piezas
        </Link>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="font-display text-6xl">FAQ</h1>
      <div className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
        {PREGUNTAS.map((q) => (
          <details key={q.p} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl">
              {q.p}
              <span className="tab-label text-xl transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-2 max-w-2xl font-serif leading-relaxed text-ink/80">
              {q.r}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
