"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const ENLACES = [
  { href: "/catalogo", label: "catálogo" },
  { href: "/nosotros", label: "nosotros" },
  { href: "/contacto", label: "contacto" },
];

export default function Nav() {
  const { items, ready } = useCart();

  return (
    <header className="bg-blackout text-paper sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="tab-label text-lg tracking-wide">
          undisclosed<span className="text-stamp">.</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="folder-tab tab-label text-xs uppercase px-4 pt-2.5 pb-2 bg-kraft text-ink hover:bg-kraftlight"
            >
              {e.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/carrito"
          className="tab-label text-xs uppercase border border-paper/40 rounded-sm px-3 py-1.5 hover:border-stamp hover:text-stamp"
        >
          expediente {ready && items.length > 0 ? `(${items.length})` : ""}
        </Link>
      </div>
      <nav className="sm:hidden flex px-4 gap-1 pb-2">
        {ENLACES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="folder-tab tab-label text-xs uppercase px-3 pt-2 pb-1.5 bg-kraft text-ink"
          >
            {e.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
