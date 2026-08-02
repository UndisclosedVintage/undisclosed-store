import { put, head } from "@vercel/blob";
import { productos as semilla, type Product } from "./products";

const CATALOGO_PATHNAME = "data/products.json";

// Sin BLOB_READ_WRITE_TOKEN (ej. en desarrollo local sin configurar) el
// sitio sigue funcionando mostrando el catálogo de ejemplo, para que nunca
// se rompa por falta de configuración.
const blobConfigurado = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function leerCatalogoRemoto(): Promise<Product[] | null> {
  if (!blobConfigurado) return null;
  try {
    const info = await head(CATALOGO_PATHNAME);
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Product[];
  } catch {
    // Todavía no existe el archivo (primera vez que se usa el panel)
    return null;
  }
}

async function guardarCatalogoRemoto(productos: Product[]) {
  await put(CATALOGO_PATHNAME, JSON.stringify(productos, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function obtenerCatalogo(): Promise<Product[]> {
  const remoto = await leerCatalogoRemoto();
  return remoto ?? semilla;
}

export async function obtenerProductoPorSlug(
  slug: string
): Promise<Product | undefined> {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((p) => p.slug === slug);
}

function generarSlug(nombre: string) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

function siguienteLote(catalogo: Product[]) {
  const numeros = catalogo
    .map((p) => parseInt(p.lote.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const siguiente = (numeros.length ? Math.max(...numeros) : 141) + 1;
  return `UD-${String(siguiente).padStart(4, "0")}`;
}

export async function subirFotoProducto(archivo: File) {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  const extension = archivo.name.split(".").pop() || "jpg";
  const resultado = await put(
    `fotos/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`,
    archivo,
    { access: "public" }
  );
  return resultado.url;
}

export interface NuevoProducto {
  nombre: string;
  categoria: Product["categoria"];
  precio: number;
  talla: string;
  epoca: string;
  origen: string;
  descripcion: string;
  qc: Product["qc"];
  imagen?: string;
}

export async function agregarProducto(datos: NuevoProducto): Promise<Product> {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  const catalogo = await obtenerCatalogo();
  const nuevo: Product = {
    ...datos,
    slug: generarSlug(datos.nombre),
    lote: siguienteLote(catalogo),
    stock: true,
  };
  const actualizado = [nuevo, ...catalogo];
  await guardarCatalogoRemoto(actualizado);
  return nuevo;
}

export async function marcarVendida(slug: string, vendida: boolean) {
  const catalogo = await obtenerCatalogo();
  const actualizado = catalogo.map((p) =>
    p.slug === slug ? { ...p, stock: !vendida } : p
  );
  await guardarCatalogoRemoto(actualizado);
}
