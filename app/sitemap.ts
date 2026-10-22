import type { MetadataRoute } from "next";
import { obtenerCatalogo } from "@/lib/products-store";
import { obtenerPosts } from "@/lib/posts-store";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || site.dominio).replace(/\/$/, "");
  const [catalogo, posts] = await Promise.all([
    obtenerCatalogo(),
    obtenerPosts({ soloPublicados: true }),
  ]);

  const fijas = [
    "",
    "/catalogo",
    "/guia-de-tallas",
    "/consigna",
    "/blog",
    "/faq",
    "/nosotros",
    "/contacto",
  ].map((p) => ({ url: `${base}${p}` }));

  return [
    ...fijas,
    ...catalogo
      .filter((p) => p.stock)
      .map((p) => ({ url: `${base}/catalogo/${p.slug}` })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}` })),
  ];
}
