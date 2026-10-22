import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Prosa from "@/components/Prosa";
import { obtenerPost } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await obtenerPost(slug);
  if (!p || !p.publicado) return { title: "Artículo no encontrado" };
  return {
    title: p.titulo,
    description: p.extracto,
    openGraph: p.portada ? { images: [p.portada] } : undefined,
  };
}

export default async function Articulo({ params }: Props) {
  const { slug } = await params;
  const p = await obtenerPost(slug);
  if (!p || !p.publicado) notFound();

  return (
    <article className="mx-auto max-w-2xl py-12">
      <Link
        href="/blog"
        className="tab-label text-[11px] uppercase text-ink/55 hover:text-stamp"
      >
        ← Blog
      </Link>
      <p className="tab-label mt-6 text-[11px] uppercase text-ink/55">
        {new Date(p.fecha).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-1 font-display text-5xl leading-tight sm:text-6xl">
        {p.titulo}
      </h1>
      {p.portada && (
        <div className="relative my-8 aspect-[4/3] overflow-hidden bg-ink/5">
          <Image
            src={p.portada}
            alt={p.titulo}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      )}
      <div className="mt-8">
        <Prosa texto={p.contenido} />
      </div>
    </article>
  );
}
