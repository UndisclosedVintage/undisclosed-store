import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { obtenerPosts } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Noticias, tendencias, comunidad y un espacio de reflexión desde Undisclosed Vintage.",
};

export default async function Blog() {
  const posts = await obtenerPosts({ soloPublicados: true });

  return (
    <div className="py-12">
      <h1 className="font-display text-6xl">Blog</h1>
      <p className="mt-2 max-w-xl font-serif text-ink/70">
        Noticias, tendencias, comunidad y un espacio de reflexión sobre todo tipo
        de cosas que despiertan el interés de nuestro equipo.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 font-serif text-ink/60">
          Todavía no hay artículos publicados.
        </p>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
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
              <h2 className="mt-1 font-display text-3xl leading-tight group-hover:text-stamp">
                {p.titulo}
              </h2>
              <p className="mt-1 font-serif text-sm text-ink/70">{p.extracto}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
