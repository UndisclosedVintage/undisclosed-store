"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SelectorMoneda from "./SelectorMoneda";
import { useCart } from "@/lib/cart-context";
import { site } from "@/lib/site-config";
import { CATEGORIAS, EPOCAS } from "@/lib/products";

const INFO = [
  { href: "/guia-de-tallas", label: "El fit perfecto" },
  { href: "/consigna", label: "Vende tus piezas" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export default function Nav() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const { items, ready } = useCart();
  const cantidad = ready ? items.length : 0;

  // Cierra el panel móvil al cambiar de página
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  // El panel de administración tiene su propio encabezado
  if (pathname?.startsWith("/admin")) return null;

  const enlaceColeccion =
    "tab-label whitespace-nowrap text-xs uppercase tracking-wider hover:text-stamp";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-kraft/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" aria-label={`${site.nombre} — inicio`} className="shrink-0">
          <Image
            src={site.logos.cabecera}
            alt={site.nombre}
            width={900}
            height={599}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav
          aria-label="Colecciones"
          className="hidden items-center gap-5 lg:flex"
        >
          <Link href="/catalogo?coleccion=nuevos" className={`${enlaceColeccion} text-stamp`}>
            New arrivals
          </Link>
          <Link href="/catalogo" className={enlaceColeccion}>
            Catálogo
          </Link>
          {CATEGORIAS.map((c) => (
            <Link
              key={c.valor}
              href={`/catalogo?categoria=${c.valor}`}
              className={enlaceColeccion}
            >
              {c.label}
            </Link>
          ))}
          <div className="group relative">
            <button type="button" className={`${enlaceColeccion} py-2`}>
              Época ▾
            </button>
            <div className="invisible absolute left-0 top-full min-w-[9rem] border border-ink/20 bg-kraftlight py-1 opacity-0 shadow-md transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {EPOCAS.map((e) => (
                <Link
                  key={e}
                  href={`/catalogo?epoca=${encodeURIComponent(e)}`}
                  className="tab-label block px-4 py-1.5 text-xs hover:bg-ink/5 hover:text-stamp"
                >
                  {e}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <SelectorMoneda />
          <Link
            href="/carrito"
            className="tab-label whitespace-nowrap text-xs uppercase tracking-wider hover:text-stamp"
          >
            Tu selección
            <span
              className={`ml-1.5 inline-flex min-w-[1.4rem] justify-center rounded-full px-1.5 py-0.5 text-[11px] ${
                cantidad ? "bg-stamp text-paper" : "bg-ink/10 text-ink/60"
              }`}
            >
              {cantidad}
            </span>
          </Link>
          <button
            type="button"
            className="tab-label text-xs uppercase lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {/* Segunda barra: páginas de información (escritorio) */}
      <div className="hidden border-t border-ink/10 lg:block">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-1.5">
          {INFO.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="tab-label text-[11px] uppercase tracking-wider text-ink/65 hover:text-stamp"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Menú"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink/15 bg-kraft px-6 py-6 lg:hidden"
        >
          <ul className="space-y-1">
            <li>
              <Link
                href="/catalogo?coleccion=nuevos"
                className="block py-2 font-display text-3xl text-stamp"
              >
                New arrivals
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="block py-2 font-display text-3xl">
                Catálogo
              </Link>
            </li>
            {CATEGORIAS.map((c) => (
              <li key={c.valor}>
                <Link
                  href={`/catalogo?categoria=${c.valor}`}
                  className="block py-2 font-display text-3xl"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="tab-label mb-2 mt-6 text-[11px] uppercase text-ink/55">
            Época
          </p>
          <div className="flex flex-wrap gap-2">
            {EPOCAS.map((e) => (
              <Link
                key={e}
                href={`/catalogo?epoca=${encodeURIComponent(e)}`}
                className="tab-label rounded-sm border border-ink/30 px-2.5 py-1 text-xs"
              >
                {e}
              </Link>
            ))}
          </div>

          <div className="perforated mt-6 pt-4">
            <ul className="space-y-2">
              {INFO.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="tab-label text-sm uppercase">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contacto" className="tab-label text-sm uppercase">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
