import { NextResponse } from "next/server";
import {
  actualizarPost,
  crearPost,
  publicarPost,
  type DatosPost,
} from "@/lib/posts-store";
import { subirArchivo } from "@/lib/blob-json";

// Protegido por middleware.ts (usuario y contraseña de administrador).

const MAX_BYTES = 8 * 1024 * 1024;

function texto(f: FormData, k: string, max: number) {
  const v = f.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function leer(
  f: FormData
): Promise<{ datos: DatosPost } | { error: string }> {
  const titulo = texto(f, "titulo", 160);
  const contenido = texto(f, "contenido", 60000);
  if (!titulo) return { error: "Falta el título." };
  if (!contenido) return { error: "El artículo está vacío." };

  let portada = texto(f, "portadaActual", 1000);
  if (portada && !/^https:\/\//.test(portada)) portada = "";
  if (f.get("quitarPortada") === "on") portada = "";

  const archivo = f.get("portada");
  if (archivo instanceof File && archivo.size > 0) {
    if (!archivo.type.startsWith("image/"))
      return { error: "La portada debe ser una imagen." };
    if (archivo.size > MAX_BYTES) return { error: "La portada pesa más de 8 MB." };
    portada = await subirArchivo(archivo, "blog");
  }

  return {
    datos: {
      titulo,
      extracto: texto(f, "extracto", 400),
      contenido,
      portada: portada || undefined,
      publicado: f.get("publicado") === "on",
    },
  };
}

function fallo(err: unknown) {
  console.error(err);
  return NextResponse.json(
    { error: err instanceof Error ? err.message : "Error al guardar." },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  try {
    const r = await leer(await req.formData());
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
    const p = await crearPost(r.datos);
    return NextResponse.json({ ok: true, slug: p.slug });
  } catch (err) {
    return fallo(err);
  }
}

export async function PUT(req: Request) {
  try {
    const f = await req.formData();
    const slug = texto(f, "slug", 200);
    if (!slug) return NextResponse.json({ error: "Falta el artículo." }, { status: 400 });
    const r = await leer(f);
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
    const ok = await actualizarPost(slug, r.datos);
    if (!ok) return NextResponse.json({ error: "No existe ese artículo." }, { status: 404 });
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    return fallo(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const { slug, publicado } = await req.json();
    if (typeof slug !== "string" || typeof publicado !== "boolean")
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    await publicarPost(slug, publicado);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fallo(err);
  }
}
