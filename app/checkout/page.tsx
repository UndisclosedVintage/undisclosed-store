"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useMoneda } from "@/lib/moneda-context";
import { calcularEnvio, etiquetaEnvio } from "@/lib/envio";
import { formatear } from "@/lib/moneda";
import { site } from "@/lib/site-config";

const campo =
  "w-full rounded-sm border border-ink/30 bg-paper px-3 py-2 font-serif text-[15px] outline-none focus:border-stamp";

export default function Checkout() {
  const { items, sinPrecio, subtotal, ready } = useCart();
  const { moneda } = useMoneda();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <div className="min-h-[50vh] py-12" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-5xl">No hay nada que pagar</h1>
        <Link
          href="/catalogo"
          className="tab-label mt-6 inline-block text-sm uppercase text-stamp hover:underline"
        >
          Ver el catálogo →
        </Link>
      </div>
    );
  }

  const faltantes = sinPrecio(moneda);
  const sub = subtotal(moneda);
  const envio = calcularEnvio(moneda, items.length);
  const total = sub + envio;
  const esMXN = moneda === "MXN";

  async function pagar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const slugs = items.map((i) => i.slug);
    try {
      let cuerpo: Record<string, unknown> = { slugs };
      if (esMXN) {
        const f = new FormData(e.currentTarget);
        cuerpo = {
          slugs,
          nombre: String(f.get("nombre") ?? ""),
          email: String(f.get("email") ?? ""),
          telefono: String(f.get("telefono") ?? ""),
          direccion: String(f.get("direccion") ?? ""),
          ciudad: String(f.get("ciudad") ?? ""),
          estado: String(f.get("estado") ?? ""),
          cp: String(f.get("cp") ?? ""),
        };
      }
      const r = await fetch(
        esMXN ? "/api/crear-preferencia" : "/api/crear-sesion-stripe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpo),
        }
      );
      const datos = await r.json().catch(() => ({}));
      if (!r.ok || !datos.url) {
        throw new Error(datos.error || "No pudimos iniciar el pago. Intenta de nuevo.");
      }
      window.location.href = datos.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <div className="py-10">
      <h1 className="font-display text-5xl">Finalizar compra</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={pagar} className="space-y-6">
          {esMXN ? (
            <fieldset className="space-y-4">
              <legend className="tab-label mb-1 text-[11px] uppercase text-ink/55">
                Datos de envío (México)
              </legend>
              <Campo label="Nombre completo">
                <input name="nombre" required autoComplete="name" className={campo} />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Correo">
                  <input name="email" type="email" required autoComplete="email" className={campo} />
                </Campo>
                <Campo label="Teléfono / WhatsApp">
                  <input name="telefono" type="tel" required autoComplete="tel" className={campo} />
                </Campo>
              </div>
              <Campo label="Calle, número y colonia">
                <input name="direccion" required autoComplete="street-address" className={campo} />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-3">
                <Campo label="Ciudad">
                  <input name="ciudad" required autoComplete="address-level2" className={campo} />
                </Campo>
                <Campo label="Estado">
                  <input name="estado" required autoComplete="address-level1" className={campo} />
                </Campo>
                <Campo label="Código postal">
                  <input
                    name="cp"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    title="5 dígitos"
                    autoComplete="postal-code"
                    className={campo}
                  />
                </Campo>
              </div>
            </fieldset>
          ) : (
            <div className="manila-card p-5 font-serif text-[15px]">
              Pagarás en dólares con tarjeta. Te pediremos tu dirección de envío
              y tu teléfono en la siguiente pantalla, en la página segura de
              Stripe.
            </div>
          )}

          {faltantes.length > 0 && (
            <p className="font-serif text-sm text-stamp">
              Hay piezas sin precio en {moneda}. Vuelve a{" "}
              <Link href="/carrito" className="underline">
                tu selección
              </Link>{" "}
              para ajustarlas.
            </p>
          )}

          <div className="border border-ink/20 bg-kraftlight p-4 font-serif text-sm leading-relaxed text-ink/80">
            {site.avisoVintage}
          </div>

          <label className="flex items-start gap-3 font-serif text-sm">
            <input type="checkbox" required className="mt-1 accent-[rgb(var(--c-stamp))]" />
            <span>
              Entiendo que son piezas vintage únicas y acepto las condiciones de
              compra descritas arriba.
            </span>
          </label>

          {error && (
            <p role="alert" className="font-serif text-sm text-stamp">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || faltantes.length > 0}
            className="tab-label w-full rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {enviando
              ? "Redirigiendo al pago…"
              : `Pagar ${formatear(total, moneda)} con ${esMXN ? "Mercado Pago" : "Stripe"}`}
          </button>
        </form>

        <aside className="manila-card h-fit p-5">
          <h2 className="tab-label mb-4 text-[11px] uppercase text-ink/55">
            Tu pedido
          </h2>
          <ul className="space-y-1.5 font-serif text-sm">
            {items.map((i) => (
              <li key={i.slug} className="leading-snug">
                {i.nombre}{" "}
                <span className="text-ink/55">· talla {i.talla}</span>
              </li>
            ))}
          </ul>
          <dl className="perforated mt-4 space-y-2 pt-4 font-serif text-[15px]">
            <div className="flex justify-between">
              <dt>Piezas</dt>
              <dd className="font-mono">{formatear(sub, moneda)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{etiquetaEnvio(moneda)}</dt>
              <dd className="font-mono">{formatear(envio, moneda)}</dd>
            </div>
            <div className="flex justify-between text-lg">
              <dt>Total</dt>
              <dd className="font-mono">{formatear(total, moneda)}</dd>
            </div>
          </dl>
          <p className="mt-3 font-serif text-xs text-ink/55">
            El total final se confirma en el servidor al pagar.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">
        {label}
      </span>
      {children}
    </label>
  );
}
