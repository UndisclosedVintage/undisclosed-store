import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-8">
      <header className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-ink/15 pb-4">
        <Link href="/admin" className="font-display text-3xl">
          Panel
        </Link>
        <Link href="/admin/subir" className="tab-label text-xs uppercase hover:text-stamp">
          + Subir pieza
        </Link>
        <Link href="/admin/blog/nuevo" className="tab-label text-xs uppercase hover:text-stamp">
          + Nuevo artículo
        </Link>
        <Link href="/admin/pedidos" className="tab-label text-xs uppercase hover:text-stamp">
          Pedidos
        </Link>
        <Link href="/" className="tab-label ml-auto text-xs uppercase text-ink/55 hover:text-stamp">
          Ver el sitio →
        </Link>
      </header>
      {children}
    </div>
  );
}
