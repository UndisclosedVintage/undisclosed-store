import Image from "next/image";
import Link from "next/link";
import HeroEditorial, { type Tesela } from "@/components/HeroEditorial";
import ProductCard from "@/components/ProductCard";
import { obtenerCatalogo } from "@/lib/products-store";
import { obtenerPosts } from "@/lib/posts-store";
import { CATEGORIAS, folioVisible } from "@/lib/products";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const catalogo = await obtenerCatalogo();
  const posts = (await obtenerPosts({ soloPublicados: true })).slice(0, 3);

  const disponibles = catalogo
    .filter((p) => p.stock)
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  const nuevos = disponibles.slice(0, Math.min(site.nuevosCantidad, 8));

  // Fotos editoriales: las que subas a /public/editorial; si no hay, las de las
  // piezas destacadas o más recientes.
  let teselas: Tesela[];
  if (site.editorial.length) {
    teselas = site.editorial.map((src, i) => ({
      src,
      alt: `${site.nombre} — editorial ${i + 1}`,
      href: "/catalogo?coleccion=nuevos",
    }));
  } else {
    const base = [
      ...disponibles.filter((p) => p.destacada),
      ...disponibles.filter((p) => !p.destacada),
    ].filter((p) => p.imagenes?.[0]);
    teselas = base.slice(0, 5).map((p) => ({
      src: p.imagenes![0],
      alt: p.nombre,
      href: `/catalogo/${p.slug}`,
      pie: `${p.epoca} · ${folioVisible(p.lote)}`,
    }));
  }

  return (
    <>
      <HeroEditorial teselas={teselas} />

      <section className="py-14 text-center">
        <h1 className="font-display text-5xl leading-none sm:text-7xl">
          Ropa vintage,
          <br />
          pieza por pieza
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-serif text-ink/70">
          Cada prenda es única. Seleccionada, medida y fotografiada desde{" "}
          {site.ciudad}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogo?coleccion=nuevos"
            className="tab-label rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark"
          >
            Ver New arrivals
          </Link>
          <Link
            href="/catalogo"
            className="tab-label rounded-sm border border-ink px-6 py-3 text-sm uppercase hover:bg-ink hover:text-paper"
          >
            Todo el catálogo
          </Link>
        </div>
      </section>

      {nuevos.length > 0 && (
        <section className="py-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl">New arrivals</h2>
            <Link
              href="/catalogo?coleccion=nuevos"
              className="tab-label text-xs uppercase text-stamp hover:underline"
            >
              ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
            {nuevos.map((p, i) => (
              <ProductCard key={p.slug} producto={p} prioridad={i < 4} />
            ))}
          </div>
        </section>
      )}

      <section className="py-14">
        <h2 className="mb-5 font-display text-4xl">Explora por categoría</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIAS.map((c, i) => (
            <Link
              key={c.valor}
              href={`/catalogo?categoria=${c.valor}`}
              className={`group flex aspect-[4/3] items-end p-4 ${
                ["bg-rosa/40", "bg-azul/50", "bg-verde/60", "bg-ink/10"][i % 4]
              }`}
            >
              <span className="font-display text-3xl transition-transform group-hover:translate-x-1">
                {c.label} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Link
          href="/guia-de-tallas"
          className="manila-card group relative block overflow-hidden p-6 sm:p-8"
        >
          <p className="tab-label text-[11px] uppercase text-ink/55">Guía</p>
          <h2 className="mt-1 font-display text-4xl">The perfect fit</h2>
          <p className="mt-2 max-w-sm font-serif text-ink/70">
            La talla vintage no es la talla de hoy. Mide una playera que te
            quede bien y encuentra piezas con esa medida exacta.
          </p>
          <span className="tab-label mt-4 inline-block text-xs uppercase text-stamp">
            Encuentra tu medida →
          </span>
          <Image
            src={site.logos.azulNube}
            alt=""
            width={900}
            height={461}
            className="pointer-events-none absolute -bottom-4 -right-6 h-28 w-auto opacity-90 transition-transform duration-500 group-hover:rotate-3"
          />
        </Link>
        <Link
          href="/consigna"
          className="manila-card group relative block overflow-hidden p-6 sm:p-8"
        >
          <p className="tab-label text-[11px] uppercase text-ink/55">Consigna</p>
          <h2 className="mt-1 font-display text-4xl">Sell your shirts</h2>
          <p className="mt-2 max-w-sm font-serif text-ink/70">
            ¿Tienes piezas vintage guardadas? Cuéntanos qué tienes y vemos si
            encajan en la tienda.
          </p>
          <span className="tab-label mt-4 inline-block text-xs uppercase text-stamp">
            Cómo funciona →
          </span>
          <Image
            src={site.logos.pinchos}
            alt=""
            width={900}
            height={552}
            className="pointer-events-none absolute -bottom-4 -right-6 h-28 w-auto opacity-90 transition-transform duration-500 group-hover:-rotate-3"
          />
        </Link>
      </section>

      {posts.length > 0 && (
        <section className="py-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl">Del blog</h2>
            <Link
              href="/blog"
              className="tab-label text-xs uppercase text-stamp hover:underline"
            >
              todos los artículos →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                {p.portada && (
                  <div className="relative mb-3 aspect-[4/3] overflow-hidden bg-ink/5">
                    <Image
                      src={p.portada}
                      alt={p.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <p className="tab-label text-[11px] uppercase text-ink/55">
                  {new Date(p.fecha).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-1 font-display text-2xl leading-tight group-hover:text-stamp">
                  {p.titulo}
                </h3>
                <p className="mt-1 font-serif text-sm text-ink/70">{p.extracto}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
