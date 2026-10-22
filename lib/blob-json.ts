import { put, head, BlobNotFoundError } from "@vercel/blob";

export const blobConfigurado = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// La URL pública de cada archivo no cambia, así que se recuerda después de la
// primera consulta para no pagar una llamada extra en cada visita.
const urls = new Map<string, string>();

/**
 * Lee un archivo JSON guardado en Vercel Blob.
 *  - undefined → el sitio no tiene Blob configurado
 *  - null      → Blob está configurado pero el archivo aún no existe
 *  - T         → los datos
 */
export async function leerJSON<T>(
  pathname: string
): Promise<T | null | undefined> {
  if (!blobConfigurado) return undefined;
  try {
    let url = urls.get(pathname);
    if (!url) {
      const info = await head(pathname);
      url = info.url;
      urls.set(pathname, url);
    }
    // El parámetro ?t= evita que la CDN entregue una copia vieja del archivo
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) {
      urls.delete(pathname);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    urls.delete(pathname);
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

export async function guardarJSON(pathname: string, datos: unknown) {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  const r = await put(pathname, JSON.stringify(datos, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  urls.set(pathname, r.url);
}

export async function subirArchivo(archivo: File, carpeta: string) {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  const extension = (archivo.name.split(".").pop() || "jpg").toLowerCase();
  const r = await put(
    `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`,
    archivo,
    { access: "public" }
  );
  return r.url;
}
