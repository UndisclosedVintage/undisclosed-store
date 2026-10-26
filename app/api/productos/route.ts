import { NextResponse } from "next/server";
import {
  actualizarProducto,
  agregarProducto,
  eliminarProducto,
  marcarVendida,
  type DatosPieza,
} from "@/lib/products-store";
import { borrarArchivos, subirArchivo } from "@/lib/blob-json";
import { CATEGORIAS, type Categoria } from "@/lib/products";

// Protegido por middleware.ts (usuario y contraseña de administrador).

const MAX_FOTOS = 12;
const MAX_BYTES = 8 * 1024 * 1024;

function texto(f: FormData, k: string, max = 2000) {
  const v = f.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function numero(f: FormData, k: string) {
  const v = texto(f, k, 20);
  if (!v) return undefined;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function nota(f: FormData, k: string) {
  const n = numero(f, k);
  return n === undefined ? 0 : Math.min(10, n);
}

async function leerFormulario(
  f: FormData,
  esEdicion: boolean
): Promise<{ datos: DatosPieza } | { error: string }> {
  const nombre = texto(f, "nombre", 140);
  const categoria = texto(f, "categoria") as Categoria;
  const talla = texto(f, "talla", 20);
  const precio = numero(f, "precio");
  const precioUSD = numero(f, "precioUSD");

  if (!nombre) return { error: "Falta el nombre de la pieza." };
  if (!CATEGORIAS.some((c) => c.valor === categoria))
    return { error: "Categoría inválida." };
  if (!talla) return { error: "Falta la talla." };
  if (precio === undefined || precio <= 0)
    return { error: "El precio en MXN es obligatorio." };

  // Fotos que se conservan (solo URLs https, en el orden recibido)
  let mantener: string[] = [];
  if (esEdicion) {
    try {
      const m = JSON.parse(texto(f, "mantener", 20000) || "[]");
      if (Array.isArray(m))
        mantener = m.filter(
          (u): u is string => typeof u === "string" && /^https:\/\//.test(u)
        );
    } catch {
      return { error: "No se pudo leer la lista de fotos." };
    }
  }

  const archivos = f
    .getAll("fotos")
    .filter((a): a is File => a instanceof File && a.size > 0);

  if (mantener.length + archivos.length > MAX_FOTOS)
    return { error: `Máximo ${MAX_FOTOS} fotos por pieza.` };
  for (const a of archivos) {
    if (!a.type.startsWith("image/"))
      return { error: `"${a.name}" no es una imagen.` };
    if (a.size > MAX_BYTES)
      return { error: `"${a.name}" pesa más de 8 MB.` };
  }
  if (mantener.length + archivos.length === 0)
    return { error: "Sube al menos una foto." };

  const nuevas: string[] = [];
  for (const a of archivos) nuevas.push(await subirArchivo(a, "piezas"));

  const pecho = numero(f, "pecho");
  const largo = numero(f, "largo");
  const cintura = numero(f, "cintura");

  return {
    datos: {
      nombre,
      categoria,
      precio,
      precioUSD: precioUSD && precioUSD > 0 ? precioUSD : undefined,
      talla,
      epoca: texto(f, "epoca", 20),
      origen: texto(f, "origen", 80),
      descripcion: texto(f, "descripcion"),
      qc: {
        concepto: nota(f, "qc_concepto"),
        epoca: nota(f, "qc_epoca"),
        rareza: nota(f, "qc_rareza"),
        condicion: nota(f, "qc_condicion"),
        estetica: nota(f, "qc_estetica"),
      },
      lote: texto(f, "lote", 20) || undefined,
      destacada: f.get("destacada") === "on",
      medidas: pecho || largo || cintura ? { pecho, largo, cintura } : undefined,
      imagenes: [...mantener, ...nuevas],
    },
  };
}

export async function POST(req: Request) {
  try {
    const r = await leerFormulario(await req.formData(), false);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
    const p = await agregarProducto(r.datos);
    return NextResponse.json({ ok: true, slug: p.slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al guardar la pieza." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const f = await req.formData();
    const slug = texto(f, "slug", 200);
    if (!slug) return NextResponse.json({ error: "Falta la pieza." }, { status: 400 });
    const r = await leerFormulario(f, true);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
    const p = await actualizarProducto(slug, r.datos);
    if (!p) return NextResponse.json({ error: "No existe esa pieza." }, { status: 404 });
    return NextResponse.json({ ok: true, slug: p.slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al guardar la pieza." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { slug, vendida } = await req.json();
    if (typeof slug !== "string" || typeof vendida !== "boolean")
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    await marcarVendida(slug, vendida);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { slug } = await req.json();
    if (typeof slug !== "string" || !slug)
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    const pieza = await eliminarProducto(slug);
    if (!pieza)
      return NextResponse.json({ error: "No existe esa pieza." }, { status: 404 });
    // Las fotos se borran después; si falla, la pieza ya no está en el catálogo
    try {
      await borrarArchivos(pieza.imagenes ?? []);
    } catch (err) {
      console.error("No se pudieron borrar las fotos:", err);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error." },
      { status: 500 }
    );
  }
}
