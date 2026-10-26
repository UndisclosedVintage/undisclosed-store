import type { Metadata } from "next";
import { enlaceWhatsApp, site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos o visítanos: dudas sobre piezas, envíos o consigna.",
};

export default function Contacto() {
  const wa = enlaceWhatsApp("Hola, tengo una duda sobre Undisclosed Vintage.");
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.direccion}`
  )}`;

  const canales = [
    wa && { nombre: "WhatsApp", detalle: "Respuesta más rápida", href: wa },
    site.instagram && {
      nombre: "Instagram",
      detalle: `@${site.instagram}`,
      href: `https://instagram.com/${site.instagram}`,
    },
    site.tiktok && {
      nombre: "TikTok",
      detalle: `@${site.tiktok}`,
      href: `https://tiktok.com/@${site.tiktok}`,
    },
    site.email && {
      nombre: "Email",
      detalle: site.email,
      href: `mailto:${site.email}`,
    },
    site.direccion && {
      nombre: "Visítanos",
      detalle: site.direccion,
      href: mapa,
    },
  ].filter(Boolean) as { nombre: string; detalle: string; href: string }[];

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="font-display text-6xl">Contacto</h1>
      <p className="mt-3 font-serif text-lg text-ink/75">
        Dudas sobre una pieza, un envío o la consigna: escríbenos o pasa a la
        tienda.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {canales.map((c) => (
          <li key={c.nombre}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="manila-card block h-full p-5 hover:border-stamp"
            >
              <p className="tab-label text-[11px] uppercase text-ink/55">{c.nombre}</p>
              <p className="break-words font-display text-2xl">{c.detalle}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
