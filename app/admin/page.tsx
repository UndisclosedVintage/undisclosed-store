import Link from "next/link";
import ToggleAdmin from "@/components/ToggleAdmin";
import EliminarPieza from "@/components/EliminarPieza";
import { blobConfigurado } from "@/lib/blob-json";
import { obtenerCatalogo } from "@/lib/products-store";
import { obtenerPosts } from "@/lib/posts-store";
import { folioVisible } from "@/lib/products";
import { formatear } from "@/lib/moneda";

export default async function Panel() {
  const [catalogo, posts] = await Promise.all([
    obtenerCatalogo(),
    obtenerPosts(),
  ]);

  return (
    <div className="space-y-12">
      {!blobConfigurado && (
        <p className="border border-stamp bg-stamp/10 p-4 font-serif text-sm">
          Falta conectar Vercel Blob (variable <code>BLOB_READ_WRITE_TOKEN</code>).
          Mientras tanto ves piezas de ejemplo y no se puede guardar nada. Pasos
          en el README.
        </p>
      )}

      <section>
        <h2 className="mb-3 font-display text-3xl">
          Piezas <span className="tab-label text-sm text-ink/50">({catalogo.length})</span>
        </h2>
        {catalogo.length === 0 ? (
          <p className="font-serif text-ink/65">
            Todavía no hay piezas.{" "}
            <Link href="/admin/subir" className="text-stamp underline">
              Sube la primera
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {catalogo.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imagenes?.[0] || ""}
                  alt=""
                  className="h-14 w-12 shrink-0 bg-paper object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif">{p.nombre}</p>
                  <p className="tab-label text-[11px] uppercase text-ink/55">
                    {folioVisible(p.lote)} · talla {p.talla} · {formatear(p.precio, "MXN")}
                    {p.precioUSD ? ` · ${formatear(p.precioUSD, "USD")}` : " · sin USD"}
                  </p>
                </div>
                <Link
                  href={`/admin/editar/${p.slug}`}
                  className="tab-label text-xs uppercase text-stamp hover:underline"
                >
                  editar
                </Link>
                <ToggleAdmin
                  endpoint="/api/productos"
                  slug={p.slug}
                  campo="vendida"
                  activo={!p.stock}
                  etiquetaActivo="vendida ✓"
                  etiquetaInactivo="marcar vendida"
                />
                <EliminarPieza slug={p.slug} nombre={p.nombre} vendida={!p.stock} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-3xl">
          Blog <span className="tab-label text-sm text-ink/50">({posts.length})</span>
        </h2>
        {posts.length === 0 ? (
          <p className="font-serif text-ink/65">Todavía no hay artículos.</p>
        ) : (
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {posts.map((p) => (
              <li key={p.slug} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif">{p.titulo}</p>
                  <p className="tab-label text-[11px] uppercase text-ink/55">
                    {new Date(p.fecha).toLocaleDateString("es-MX")}
                  </p>
                </div>
                <Link
                  href={`/admin/blog/${p.slug}`}
                  className="tab-label text-xs uppercase text-stamp hover:underline"
                >
                  editar
                </Link>
                <ToggleAdmin
                  endpoint="/api/posts"
                  slug={p.slug}
                  campo="publicado"
                  activo={p.publicado}
                  etiquetaActivo="publicado ✓"
                  etiquetaInactivo="borrador"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
