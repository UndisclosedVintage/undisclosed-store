import { obtenerCatalogo } from "./products-store";
import { folioVisible, type Product } from "./products";
import { calcularEnvio } from "./envio";
import { precioEn, type Moneda } from "./moneda";

// Los precios y la disponibilidad SIEMPRE se resuelven aquí, en el servidor,
// a partir del catálogo. Nunca se confía en lo que manda el navegador.

export interface LineaPedido {
  producto: Product;
  precio: number;
  titulo: string;
}

export type ResultadoCarrito =
  | {
      ok: true;
      lineas: LineaPedido[];
      subtotal: number;
      envio: number;
      total: number;
    }
  | { ok: false; error: string; status: number };

export async function resolverCarrito(
  slugs: string[],
  moneda: Moneda
): Promise<ResultadoCarrito> {
  const unicos = Array.from(new Set(slugs.filter(Boolean)));
  if (unicos.length === 0) {
    return { ok: false, error: "Tu selección está vacía.", status: 400 };
  }
  if (unicos.length > 30) {
    return { ok: false, error: "Demasiadas piezas en un solo pedido.", status: 400 };
  }

  const catalogo = await obtenerCatalogo();
  const lineas: LineaPedido[] = [];

  for (const slug of unicos) {
    const producto = catalogo.find((p) => p.slug === slug);
    if (!producto) {
      return {
        ok: false,
        error: "Una de las piezas ya no está en el catálogo. Revisa tu selección.",
        status: 400,
      };
    }
    if (!producto.stock) {
      return {
        ok: false,
        error: `"${producto.nombre}" ya se vendió. Quítala de tu selección para continuar.`,
        status: 409,
      };
    }
    const precio = precioEn(producto, moneda);
    if (precio === null) {
      return {
        ok: false,
        error: `"${producto.nombre}" no está disponible en ${moneda}.`,
        status: 400,
      };
    }
    lineas.push({
      producto,
      precio,
      titulo: `${producto.nombre} (talla ${producto.talla}, ${folioVisible(producto.lote)})`,
    });
  }

  const subtotal = lineas.reduce((s, l) => s + l.precio, 0);
  const envio = calcularEnvio(moneda, lineas.length);
  return { ok: true, lineas, subtotal, envio, total: subtotal + envio };
}
