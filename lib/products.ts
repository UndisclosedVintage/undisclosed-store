// Fuente de datos del catálogo.
//
// Ahora mismo esto es un arreglo estático de ejemplo (14 piezas) para que el
// sitio funcione de inmediato. Con 100+ piezas y rotación constante, esto
// NO es donde debe vivir el catálogo real — ver el README para dos rutas
// para conectar una fuente real (Google Sheets o un panel/CMS) sin tocar
// el resto del código: cualquiera de las dos solo necesita devolver un
// arreglo de objetos con esta misma forma (Product[]).

export interface QC {
  concepto: number; // 0-10
  epoca: number; // 0-10
  rareza: number; // 0-10
  condicion: number; // 0-10
  estetica: number; // 0-10
}

export interface Product {
  slug: string;
  nombre: string;
  categoria: "playeras" | "chamarras" | "pantalones" | "accesorios";
  precio: number; // MXN
  talla: string;
  epoca: string;
  origen: string;
  descripcion: string;
  qc: QC;
  lote: string;
  stock: boolean; // true = disponible, false = vendida
  imagen?: string; // URL de la foto (Vercel Blob). Si falta, se muestra el marcador "foto pendiente".
}

function promedio(qc: QC) {
  return (
    (qc.concepto + qc.epoca + qc.rareza + qc.condicion + qc.estetica) / 5
  );
}

export const productos: Product[] = [
  {
    slug: "chamarra-varsity-bionicle-2003",
    nombre: "Chamarra varsity parche Bionicle",
    categoria: "chamarras",
    precio: 1850,
    talla: "M",
    epoca: "Años 2000",
    origen: "Manufactura americana",
    descripcion:
      "Varsity de lana y piel con parche bordado original de la línea Bionicle. Forro intacto, botones originales.",
    qc: { concepto: 9, epoca: 9, rareza: 10, condicion: 8, estetica: 9 },
    lote: "UD-0142",
    stock: true,
  },
  {
    slug: "playera-edward-scissorhands-promo",
    nombre: "Playera promocional Edward Scissorhands",
    categoria: "playeras",
    precio: 950,
    talla: "L",
    epoca: "1990",
    origen: "Estados Unidos",
    descripcion:
      "Playera promocional de la película, estampado single-stitch. Desgaste natural en cuello.",
    qc: { concepto: 8, epoca: 9, rareza: 8, condicion: 7, estetica: 8 },
    lote: "UD-0143",
    stock: true,
  },
  {
    slug: "pantalon-carpintero-dickies-90s",
    nombre: "Pantalón carpintero Dickies",
    categoria: "pantalones",
    precio: 780,
    talla: "32",
    epoca: "Años 90",
    origen: "Estados Unidos",
    descripcion:
      "Corte carpintero clásico, loop para martillo intacto. Tela con caída perfecta por años de uso.",
    qc: { concepto: 7, epoca: 8, rareza: 6, condicion: 8, estetica: 7 },
    lote: "UD-0144",
    stock: true,
  },
  {
    slug: "gorra-trucker-corduroy-70s",
    nombre: "Gorra trucker pana",
    categoria: "accesorios",
    precio: 480,
    talla: "Única",
    epoca: "Años 70",
    origen: "Manufactura americana",
    descripcion:
      "Frente de pana acanalada, malla trasera original. Broche de metal funcional.",
    qc: { concepto: 7, epoca: 9, rareza: 7, condicion: 7, estetica: 8 },
    lote: "UD-0145",
    stock: true,
  },
  {
    slug: "chamarra-denim-trucker-80s",
    nombre: "Chamarra denim trucker",
    categoria: "chamarras",
    precio: 1200,
    talla: "M",
    epoca: "Años 80",
    origen: "México",
    descripcion:
      "Mezclilla rígida con decoloración natural en pliegues. Botones de metal originales.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 8, estetica: 8 },
    lote: "UD-0146",
    stock: true,
  },
  {
    slug: "playera-mundial-corrupcion-graphic",
    nombre: "Playera gráfica edición mundial",
    categoria: "playeras",
    precio: 680,
    talla: "L",
    epoca: "Años 2000",
    origen: "México",
    descripcion:
      "Gráfico satírico deportivo, algodón grueso. Estampado con craquelado natural de época.",
    qc: { concepto: 8, epoca: 7, rareza: 7, condicion: 8, estetica: 7 },
    lote: "UD-0147",
    stock: true,
  },
  {
    slug: "sueter-lana-noruego-70s",
    nombre: "Suéter lana patrón nórdico",
    categoria: "chamarras",
    precio: 950,
    talla: "S",
    epoca: "Años 70",
    origen: "Europa",
    descripcion:
      "Lana gruesa tejida a máquina, patrón geométrico en pecho. Sin polillas, cuello reforzado.",
    qc: { concepto: 8, epoca: 9, rareza: 8, condicion: 8, estetica: 9 },
    lote: "UD-0148",
    stock: true,
  },
  {
    slug: "pantalon-cargo-militar-y2k",
    nombre: "Pantalón cargo militar",
    categoria: "pantalones",
    precio: 690,
    talla: "34",
    epoca: "Y2K",
    origen: "Manufactura militar",
    descripcion:
      "Seis bolsas funcionales, cintura ajustable. Etiqueta de talla original legible.",
    qc: { concepto: 7, epoca: 7, rareza: 6, condicion: 7, estetica: 7 },
    lote: "UD-0149",
    stock: true,
  },
  {
    slug: "cinturon-piel-hebilla-latón-80s",
    nombre: "Cinturón piel hebilla latón",
    categoria: "accesorios",
    precio: 420,
    talla: "34",
    epoca: "Años 80",
    origen: "México",
    descripcion:
      "Piel curtida a mano, hebilla de latón macizo con patina natural.",
    qc: { concepto: 7, epoca: 8, rareza: 7, condicion: 8, estetica: 8 },
    lote: "UD-0150",
    stock: true,
  },
  {
    slug: "playera-band-tour-single-stitch",
    nombre: "Playera de gira, single stitch",
    categoria: "playeras",
    precio: 1100,
    talla: "M",
    epoca: "Años 90",
    origen: "Estados Unidos",
    descripcion:
      "Costura sencilla en mangas confirma época. Estampado frente y espalda con desgaste parejo.",
    qc: { concepto: 9, epoca: 9, rareza: 9, condicion: 7, estetica: 8 },
    lote: "UD-0151",
    stock: true,
  },
  {
    slug: "chamarra-rompevientos-windbreaker-90s",
    nombre: "Rompevientos color block",
    categoria: "chamarras",
    precio: 890,
    talla: "L",
    epoca: "Años 90",
    origen: "Asia",
    descripcion:
      "Nylon ligero con bloques de color contrastantes, forro de malla, cierre funcional.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 8, estetica: 8 },
    lote: "UD-0152",
    stock: true,
  },
  {
    slug: "pantalon-mezclilla-recto-levis-90s",
    nombre: "Mezclilla recta Levi's",
    categoria: "pantalones",
    precio: 950,
    talla: "30",
    epoca: "Años 90",
    origen: "Estados Unidos",
    descripcion:
      "Corte recto original, remaches de cobre, resane discreto en rodilla izquierda documentado en la ficha.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 6, estetica: 8 },
    lote: "UD-0153",
    stock: true,
  },
  {
    slug: "bufanda-lana-artesanal-mx",
    nombre: "Bufanda de lana artesanal",
    categoria: "accesorios",
    precio: 380,
    talla: "Única",
    epoca: "Años 80",
    origen: "México",
    descripcion:
      "Tejido artesanal, flecos originales. Colores vivos sin decoloración.",
    qc: { concepto: 6, epoca: 7, rareza: 8, condicion: 9, estetica: 7 },
    lote: "UD-0154",
    stock: true,
  },
  {
    slug: "chamarra-cuero-motociclista-70s",
    nombre: "Chamarra de piel motociclista",
    categoria: "chamarras",
    precio: 2400,
    talla: "M",
    epoca: "Años 70",
    origen: "Estados Unidos",
    descripcion:
      "Piel gruesa curtida, cierres funcionales, forro reemplazado con material de época. Pieza insignia.",
    qc: { concepto: 10, epoca: 9, rareza: 10, condicion: 8, estetica: 10 },
    lote: "UD-0155",
    stock: true,
  },
];

export function obtenerProducto(slug: string) {
  return productos.find((p) => p.slug === slug);
}

export function calificacionGeneral(p: Product) {
  return promedio(p.qc);
}
