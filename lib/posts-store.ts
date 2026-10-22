import { postsSemilla, type Post } from "./posts";
import { blobConfigurado, guardarJSON, leerJSON } from "./blob-json";

const POSTS = "data/posts.json";

async function todos(): Promise<Post[]> {
  const r = await leerJSON<Post[]>(POSTS);
  if (r === undefined) return postsSemilla;
  if (r === null) return [];
  return r;
}

export async function obtenerPosts(opciones?: { soloPublicados?: boolean }) {
  const lista = await todos();
  const filtrada = opciones?.soloPublicados
    ? lista.filter((p) => p.publicado)
    : lista;
  return [...filtrada].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function obtenerPost(slug: string) {
  const lista = await todos();
  return lista.find((p) => p.slug === slug);
}

function generarSlug(titulo: string) {
  const base = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${base || "articulo"}-${Date.now().toString(36)}`;
}

async function listaParaEscribir() {
  if (!blobConfigurado) {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN — ver README.md, sección del panel de administración."
    );
  }
  return todos();
}

export interface DatosPost {
  titulo: string;
  extracto: string;
  contenido: string;
  portada?: string;
  publicado: boolean;
}

export async function crearPost(datos: DatosPost): Promise<Post> {
  const lista = await listaParaEscribir();
  const nuevo: Post = {
    ...datos,
    slug: generarSlug(datos.titulo),
    fecha: new Date().toISOString(),
  };
  await guardarJSON(POSTS, [nuevo, ...lista]);
  return nuevo;
}

export async function actualizarPost(
  slug: string,
  datos: DatosPost
): Promise<boolean> {
  const lista = await listaParaEscribir();
  const existe = lista.some((p) => p.slug === slug);
  if (!existe) return false;
  await guardarJSON(
    POSTS,
    lista.map((p) => (p.slug === slug ? { ...p, ...datos } : p))
  );
  return true;
}

export async function publicarPost(slug: string, publicado: boolean) {
  const lista = await listaParaEscribir();
  await guardarJSON(
    POSTS,
    lista.map((p) => (p.slug === slug ? { ...p, publicado } : p))
  );
}
