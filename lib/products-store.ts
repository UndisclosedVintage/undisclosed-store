import {
  productos as semilla,
  type Product,
  type Categoria,
  type Medidas,
  type QC,
} from "./products";
import { blobConfigurado, guardarJSON, leerJSON } from "./blob-json";

const CATALOGO = "data/products.json";

// Acepta catálogos guardados con una versión anterior del sitio
function normalizar(p: Product): Product {
  return {
    ...p,
    imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
    creadoEn: p.creadoEn || "2026-01-01T00:00:00.000Z",
  };
}

export async function obtenerCatalogo(): Promise<Product[]> {
  const r = await leerJSON<Product[]>(CATALOGO);
  if (r === undefined) return semilla; // sin Blob: catálogo de ejemplo
  if (r === null) return []; // Blob listo, todavía no hay piezas
  return r.map(normalizar);
}

export async function obtenerProductoPorSlug(slug: string) {
  const catalogo = await obtenerCatalogo();
  return catalogo.find((p) => p.slug === slug);
}

function generarSlug(nombre: string) {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${base || "pieza"}-${Date.now().toString(36)}`;
}

function siguienteFolio(catalogo: Product[]) {
  const numeros = catalogo
    .map((p) => parseInt(p.lote.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `UD${String(siguiente).padStart(4, "0")}`;
}

export interface DatosPieza {
  nombre: string;
  categoria: Categoria;
  precio: number;
  precioUSD?: number;
  talla: string;
  epoca: string;
  origen: string;
  descripcion: string;
  qc: QC;
  lote?: string; // folio; si va vacío se genera solo
  destacada?: boolean;
  medidas?: Medidas;
  imagenes: string[];
}

async function catalogoParaEscribir(): Promise<Product[]> {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  return obtenerCatalogo();
}

export async function agregarProducto(datos: DatosPieza): Promise<Product> {
  const catalogo = await catalogoParaEscribir();
  const nuevo: Product = {
    ...datos,
    lote: datos.lote?.trim() || siguienteFolio(catalogo),
    slug: generarSlug(datos.nombre),
    stock: true,
    creadoEn: new Date().toISOString(),
  };
  await guardarJSON(CATALOGO, [nuevo, ...catalogo]);
  return nuevo;
}

export async function actualizarProducto(
  slug: string,
  datos: DatosPieza
): Promise<Product | null> {
  const catalogo = await catalogoParaEscribir();
  const anterior = catalogo.find((p) => p.slug === slug);
  if (!anterior) return null;
  const actualizado: Product = {
    ...anterior,
    ...datos,
    lote: datos.lote?.trim() || anterior.lote,
  };
  await guardarJSON(
    CATALOGO,
    catalogo.map((p) => (p.slug === slug ? actualizado : p))
  );
  return actualizado;
}

export async function marcarVendida(slug: string, vendida: boolean) {
  const catalogo = await catalogoParaEscribir();
  const nuevo = catalogo.map((p) =>
    p.slug === slug ? { ...p, stock: !vendida } : p
  );
  await guardarJSON(CATALOGO, nuevo);
}
