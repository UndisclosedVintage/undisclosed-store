import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <span className="stamp text-stamp text-lg inline-block mb-6">
        expediente no encontrado
      </span>
      <p className="font-serif text-ink/70 mb-8">
        Esta página no existe o la pieza ya fue archivada en otro lado.
      </p>
      <Link
        href="/catalogo"
        className="tab-label text-xs uppercase text-stamp hover:underline"
      >
        volver al catálogo →
      </Link>
    </div>
  );
}
