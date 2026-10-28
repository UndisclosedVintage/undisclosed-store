import { list } from "@vercel/blob";
import { blobConfigurado, guardarJSON, leerJSON } from "./blob-json";
import { marcarVendidas } from "./products-store";
import { avisarPedido } from "./avisos";
import type { Moneda } from "./moneda";

// Un pedido = un archivo JSON en Vercel Blob (pedidos/<referencia>.json).
// Así dos pedidos simultáneos nunca se pisan entre sí.

export type EstadoPedido =
  | "pendiente" // el comprador fue a pagar, aún sin confirmación
  | "pagado" // pago aprobado, pieza(s) marcadas como vendidas
  | "revisar"; // pagado, pero alguna pieza ya estaba vendida: hay que reembolsar o resolver

export interface PiezaPedido {
  slug: string;
  nombre: string;
  folio: string;
  precio: number;
}

export interface Pedido {
  referencia: string;
  metodo: "mercadopago" | "stripe";
  moneda: Moneda;
  estado: EstadoPedido;
  creadoEn: string;
  pagadoEn?: string;
  pagoId?: string;
  comprador: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    estado: string;
    cp: string;
    pais?: string;
  };
  piezas: PiezaPedido[];
  envio: number;
  total: number;
  nota?: string;
}

const ruta = (referencia: string) => `pedidos/${referencia}.json`;
const REFERENCIA_VALIDA = /^[A-Za-z0-9_-]{8,80}$/;

export async function guardarPedido(p: Pedido) {
  if (!blobConfigurado) return;
  await guardarJSON(ruta(p.referencia), p);
}

export async function obtenerPedido(referencia: string): Promise<Pedido | null> {
  if (!REFERENCIA_VALIDA.test(referencia)) return null;
  const r = await leerJSON<Pedido>(ruta(referencia));
  return r ?? null;
}

export async function listarPedidos(): Promise<Pedido[]> {
  if (!blobConfigurado) return [];
  const urls: string[] = [];
  let cursor: string | undefined;
  do {
    const pagina = await list({ prefix: "pedidos/", cursor, limit: 500 });
    urls.push(...pagina.blobs.map((b) => b.url));
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);

  const pedidos = await Promise.all(
    urls.map(async (u) => {
      try {
        const res = await fetch(`${u}?t=${Date.now()}`, { cache: "no-store" });
        return res.ok ? ((await res.json()) as Pedido) : null;
      } catch {
        return null;
      }
    })
  );
  return pedidos
    .filter((p): p is Pedido => p !== null)
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

/**
 * Se llama cuando el procesador de pagos confirma que el dinero entró.
 * Es seguro llamarla varias veces para el mismo pago (Mercado Pago reintenta
 * y a veces avisa dos veces): solo la primera vez hace algo.
 */
export async function confirmarPago(
  referencia: string,
  pagoId: string
): Promise<{ ok: true; yaProcesado: boolean } | { ok: false; error: string }> {
  const pedido = await obtenerPedido(referencia);
  if (!pedido) {
    return { ok: false, error: `No existe el pedido ${referencia}.` };
  }
  if (pedido.estado !== "pendiente") {
    return { ok: true, yaProcesado: true };
  }

  const { yaVendidas } = await marcarVendidas(
    pedido.piezas.map((p) => p.slug),
    referencia
  );

  const conflicto = yaVendidas.length > 0;
  const actualizado: Pedido = {
    ...pedido,
    estado: conflicto ? "revisar" : "pagado",
    pagadoEn: new Date().toISOString(),
    pagoId,
    nota: conflicto
      ? `Pago recibido, pero estas piezas ya estaban vendidas: ${yaVendidas.join(", ")}. Hay que resolverlo con el comprador (reembolso o alternativa).`
      : undefined,
  };
  await guardarPedido(actualizado);

  // El aviso por correo nunca debe hacer fallar la confirmación del pago
  try {
    await avisarPedido(actualizado);
  } catch (err) {
    console.error("No se pudo enviar el aviso por correo:", err);
  }
  return { ok: true, yaProcesado: false };
}
