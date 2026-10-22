// Reduce las fotos en el navegador antes de subirlas. Vercel limita el cuerpo
// de cada petición a ~4.5 MB, y las fotos de celular pesan mucho más.

export const LIMITE_TOTAL_BYTES = 4 * 1024 * 1024;

export async function reducirImagen(
  archivo: File,
  ladoMax = 1600,
  calidad = 0.85
): Promise<File> {
  if (!archivo.type.startsWith("image/")) return archivo;

  try {
    const bitmap = await createImageBitmap(archivo);
    const escala = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);

    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return archivo;
    // Fondo blanco: los PNG con transparencia no se vuelven negros en JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ancho, alto);
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();

    const blob = await new Promise<Blob | null>((res) =>
      lienzo.toBlob(res, "image/jpeg", calidad)
    );
    if (!blob || blob.size >= archivo.size) return archivo;

    const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nombre, { type: "image/jpeg" });
  } catch {
    return archivo;
  }
}
