import { NextRequest, NextResponse } from "next/server";
import {
  agregarProducto,
  marcarVendida,
  subirFotoProducto,
} from "@/lib/products-store";
import type { Product } from "@/lib/products";

function numero(valor: FormDataEntryValue | null, porDefecto = 0) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : porDefecto;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const foto = form.get("foto");

    let imagen: string | undefined;
    if (foto instanceof File && foto.size > 0) {
      imagen = await subirFotoProducto(foto);
    }

    const nuevo = await agregarProducto({
      nombre: String(form.get("nombre") || "").trim(),
      categoria: (form.get("categoria") ||
        "playeras") as Product["categoria"],
      precio: numero(form.get("precio")),
      talla: String(form.get("talla") || "").trim(),
      epoca: String(form.get("epoca") || "").trim(),
      origen: String(form.get("origen") || "").trim(),
      descripcion: String(form.get("descripcion") || "").trim(),
      qc: {
        concepto: numero(form.get("qc_concepto")),
        epoca: numero(form.get("qc_epoca")),
        rareza: numero(form.get("qc_rareza")),
        condicion: numero(form.get("qc_condicion")),
        estetica: numero(form.get("qc_estetica")),
      },
      imagen,
    });

    if (!nuevo.nombre || !nuevo.precio) {
      return NextResponse.json(
        { error: "Nombre y precio son obligatorios." },
        { status: 400 }
      );
    }

    return NextResponse.json({ producto: nuevo });
  } catch (err) {
    console.error("Error agregando producto:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "No se pudo guardar la pieza.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { slug, vendida } = (await req.json()) as {
      slug: string;
      vendida: boolean;
    };
    await marcarVendida(slug, vendida);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error actualizando producto:", err);
    return NextResponse.json(
      { error: "No se pudo actualizar la pieza." },
      { status: 500 }
    );
  }
}
