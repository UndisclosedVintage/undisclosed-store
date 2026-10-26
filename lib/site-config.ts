// Datos generales del sitio. Lo que está vacío no se muestra en ningún lado,
// así que puedes ir llenándolo conforme lo tengas.

export const site = {
  nombre: "Undisclosed Vintage",
  ciudad: "Colonia Americana, Guadalajara",
  direccion: "Prisciliano Sánchez 1028, Colonia Americana, Guadalajara, Jalisco",
  dominio: "https://undisclosedvintage.com",

  // Canales de contacto (déjalos vacíos si todavía no los quieres mostrar)
  whatsapp: "", // formato internacional sin "+" ni espacios, ej. "523312345678"
  instagram: "undisclosedvintage", // usuario sin @
  tiktok: "", // usuario sin @
  email: "parishilt000n69@gmail.com",

  // Fotos editoriales para la portada. Sube los archivos a la carpeta
  // /public/editorial y escribe aquí sus rutas, ej. ["/editorial/01.jpg"].
  // Si está vacío, la portada usa las fotos de las piezas más recientes.
  editorial: [] as string[],

  // Cuántas piezas cuentan como "New arrivals"
  nuevosCantidad: 12,

  // Logos (archivos en /public/brand)
  logos: {
    cabecera: "/brand/logo-3d.png", // menú superior
    verde: "/brand/logo-verde.png",
    azulNube: "/brand/logo-azul-nube.png",
    pinchos: "/brand/logo-pinchos.png",
    azulExplosion: "/brand/logo-azul-explosion.png",
  },

  // Aviso que aparece en cada pieza. Redáctalo con calma y, antes de publicar,
  // que lo revise alguien que conozca derecho del consumidor en México.
  avisoVintage:
    "Al tratarse de piezas vintage, estas pueden mostrar desgaste propio de su época. Fotografiamos y describimos los detalles visibles de cada prenda. No hay devoluciones salvo que la pieza no corresponda a lo descrito o fotografiado.",
};

export function enlaceWhatsApp(mensaje: string) {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}
