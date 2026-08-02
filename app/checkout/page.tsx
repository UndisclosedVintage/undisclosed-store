"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const formatoMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const { items, subtotal, ready } = useCart();
  const [comprador, setComprador] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="py-10 max-w-lg">
        <p className="font-serif text-ink/70 mb-4">
          Tu expediente está vacío, no hay nada que sellar todavía.
        </p>
        <Link
          href="/catalogo"
          className="tab-label text-xs uppercase text-stamp hover:underline"
        >
          explorar catálogo →
        </Link>
      </div>
    );
  }

  async function iniciarPago(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch("/api/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug })),
          comprador,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Algo salió mal.");
      window.location.href = data.init_point;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar el pago."
      );
      setEnviando(false);
    }
  }

  return (
    <div className="py-10 grid sm:grid-cols-5 gap-8 max-w-3xl">
      <form onSubmit={iniciarPago} className="sm:col-span-3 space-y-4">
        <p className="tab-label text-xs uppercase text-ink/50 mb-1">
          datos para el envío
        </p>
        <div>
          <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
            Nombre completo
          </label>
          <input
            required
            value={comprador.nombre}
            onChange={(e) =>
              setComprador({ ...comprador, nombre: e.target.value })
            }
            className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
          />
        </div>
        <div>
          <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
            Correo
          </label>
          <input
            required
            type="email"
            value={comprador.email}
            onChange={(e) =>
              setComprador({ ...comprador, email: e.target.value })
            }
            className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
          />
        </div>
        <div>
          <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
            Teléfono
          </label>
          <input
            required
            type="tel"
            value={comprador.telefono}
            onChange={(e) =>
              setComprador({ ...comprador, telefono: e.target.value })
            }
            className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
          />
        </div>
        <div>
          <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
            Dirección de envío
          </label>
          <textarea
            required
            rows={3}
            value={comprador.direccion}
            onChange={(e) =>
              setComprador({ ...comprador, direccion: e.target.value })
            }
            className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
          />
        </div>

        {error && (
          <p className="text-stamp font-serif text-sm border border-stamp rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="tab-label text-sm uppercase px-6 py-3 bg-stamp text-paper rounded-sm hover:bg-stampdark disabled:opacity-50 w-full sm:w-auto"
        >
          {enviando ? "abriendo Mercado Pago…" : "pagar con Mercado Pago →"}
        </button>
      </form>

      <div className="sm:col-span-2">
        <div className="manila-card rounded-sm p-4">
          <p className="tab-label text-xs uppercase text-ink/50 mb-3">
            resumen del expediente
          </p>
          <ul className="space-y-2 mb-3">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between text-sm font-serif">
                <span>{i.nombre}</span>
                <span className="font-mono">{formatoMXN.format(i.precio)}</span>
              </li>
            ))}
          </ul>
          <div className="perforated pt-3 flex justify-between">
            <span className="tab-label text-sm uppercase">Total</span>
            <span className="font-mono text-lg">{formatoMXN.format(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
