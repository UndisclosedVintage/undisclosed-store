import Link from "next/link";

export default function NoEncontrada() {
  return (
    <div className="py-24 text-center">
      <p className="tab-label text-xs uppercase text-ink/55">Error 404</p>
      <h1 className="mt-2 font-display text-6xl">Esta página no existe</h1>
      <p className="mt-3 font-serif text-ink/65">
        Quizá la pieza ya se vendió o el enlace cambió.
      </p>
      <Link
        href="/catalogo"
        className="tab-label mt-6 inline-block rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark"
      >
        Ver el catálogo
      </Link>
    </div>
  );
}
