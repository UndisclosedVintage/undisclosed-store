export interface Post {
  slug: string;
  titulo: string;
  extracto: string;
  contenido: string; // texto con formato sencillo (ver components/Prosa.tsx)
  portada?: string;
  publicado: boolean;
  fecha: string; // ISO
}

// Artículo de ejemplo: solo aparece cuando el sitio no tiene Blob configurado.
export const postsSemilla: Post[] = [
  {
    slug: "asi-se-ve-un-articulo",
    titulo: "Así se ve un artículo del blog",
    extracto:
      "Un post de ejemplo para ver cómo luce el blog. Desaparece en cuanto publiques el primero desde el panel.",
    contenido:
      "Este es un artículo de muestra. Desde el panel (/admin/blog) escribes el título, un extracto, el texto y, si quieres, una foto de portada.\n\n## Subtítulos\n\nPuedes usar subtítulos con dos signos de gato al inicio de una línea.\n\nTambién **negritas**, *cursivas* y [enlaces](https://undisclosedvintage.com).\n\n- Listas con guion\n- Una pieza por renglón\n\n> Y citas, para destacar una frase.",
    publicado: true,
    fecha: "2026-10-20T12:00:00.000Z",
  },
];
