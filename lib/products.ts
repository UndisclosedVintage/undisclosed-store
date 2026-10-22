// Tipos del catálogo y catálogo de ejemplo.
//
// El catálogo de ejemplo SOLO se muestra cuando el sitio no tiene Vercel Blob
// configurado (desarrollo local o demo). En cuanto conectas Blob, el sitio
// muestra únicamente las piezas que subas desde /admin.

export interface QC {
  concepto: number; // 0-10 — uso interno, nunca se muestra al público
  epoca: number;
  rareza: number;
  condicion: number;
  estetica: number;
}

export type Categoria = "playeras" | "chamarras" | "pantalones" | "accesorios";

export const CATEGORIAS: { valor: Categoria; label: string }[] = [
  { valor: "playeras", label: "Playeras" },
  { valor: "chamarras", label: "Chamarras" },
  { valor: "pantalones", label: "Pantalones" },
  { valor: "accesorios", label: "Accesorios" },
];

export const EPOCAS = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
];

// Medidas en pulgadas
export interface Medidas {
  pecho?: number; // ancho de axila a axila
  largo?: number; // del cuello al borde inferior
}

export interface Product {
  slug: string;
  nombre: string;
  categoria: Categoria;
  precio: number; // MXN
  precioUSD?: number; // USD, escrito a mano por pieza
  talla: string;
  epoca: string; // "1990s"
  origen: string;
  descripcion: string;
  qc: QC; // interno
  lote: string; // folio, ej. "UD0142"
  stock: boolean; // true = disponible, false = vendida
  imagenes?: string[];
  creadoEn: string; // ISO
  destacada?: boolean;
  medidas?: Medidas;
}

export function folioVisible(lote: string) {
  return lote.replace(/-/g, "");
}

const ORDEN_TALLAS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export function compararTallas(a: string, b: string) {
  const ia = ORDEN_TALLAS.indexOf(a.toUpperCase());
  const ib = ORDEN_TALLAS.indexOf(b.toUpperCase());
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b, "es");
}

const base = (n: number) => `2026-10-${String(22 - n).padStart(2, "0")}T12:00:00.000Z`;

export const productos: Product[] = [
  {
    slug: "chamarra-varsity-bionicle",
    nombre: "Chamarra varsity parche Bionicle",
    categoria: "chamarras",
    precio: 1850,
    precioUSD: 119,
    talla: "M",
    epoca: "2000s",
    origen: "Manufactura americana",
    descripcion:
      "Varsity de lana y piel con parche bordado de la línea Bionicle. Forro intacto, botones originales.",
    qc: { concepto: 9, epoca: 9, rareza: 10, condicion: 8, estetica: 9 },
    lote: "UD0142",
    stock: true,
    creadoEn: base(0),
    destacada: true,
    medidas: { pecho: 22, largo: 26 },
  },
  {
    slug: "playera-edward-scissorhands-promo",
    nombre: "Playera promocional Edward Scissorhands",
    categoria: "playeras",
    precio: 950,
    precioUSD: 65,
    talla: "L",
    epoca: "1990s",
    origen: "Estados Unidos",
    descripcion:
      "Playera promocional de la película, estampado single-stitch. Desgaste natural en el cuello.",
    qc: { concepto: 8, epoca: 9, rareza: 8, condicion: 7, estetica: 8 },
    lote: "UD0143",
    stock: true,
    creadoEn: base(1),
    destacada: true,
    medidas: { pecho: 22, largo: 29 },
  },
  {
    slug: "pantalon-carpintero-dickies",
    nombre: "Pantalón carpintero Dickies",
    categoria: "pantalones",
    precio: 780,
    precioUSD: 55,
    talla: "32",
    epoca: "1990s",
    origen: "Estados Unidos",
    descripcion:
      "Corte carpintero clásico, loop para martillo intacto. Tela con caída perfecta por años de uso.",
    qc: { concepto: 7, epoca: 8, rareza: 6, condicion: 8, estetica: 7 },
    lote: "UD0144",
    stock: true,
    creadoEn: base(2),
  },
  {
    slug: "gorra-trucker-pana",
    nombre: "Gorra trucker pana",
    categoria: "accesorios",
    precio: 480,
    precioUSD: 35,
    talla: "Única",
    epoca: "1970s",
    origen: "Manufactura americana",
    descripcion:
      "Frente de pana acanalada, malla trasera original. Broche de metal funcional.",
    qc: { concepto: 7, epoca: 9, rareza: 7, condicion: 7, estetica: 8 },
    lote: "UD0145",
    stock: true,
    creadoEn: base(3),
  },
  {
    slug: "chamarra-denim-trucker",
    nombre: "Chamarra denim trucker",
    categoria: "chamarras",
    precio: 1200,
    precioUSD: 79,
    talla: "M",
    epoca: "1980s",
    origen: "México",
    descripcion:
      "Mezclilla rígida con decoloración natural en pliegues. Botones de metal originales.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 8, estetica: 8 },
    lote: "UD0146",
    stock: true,
    creadoEn: base(4),
    medidas: { pecho: 21, largo: 25 },
  },
  {
    slug: "playera-mundial-grafica",
    nombre: "Playera gráfica edición mundial",
    categoria: "playeras",
    precio: 680,
    precioUSD: 45,
    talla: "L",
    epoca: "2000s",
    origen: "México",
    descripcion:
      "Gráfico satírico deportivo, algodón grueso. Estampado con craquelado natural.",
    qc: { concepto: 8, epoca: 7, rareza: 7, condicion: 8, estetica: 7 },
    lote: "UD0147",
    stock: true,
    creadoEn: base(5),
    medidas: { pecho: 23, largo: 29 },
  },
  {
    slug: "sueter-lana-nordico",
    nombre: "Suéter lana patrón nórdico",
    categoria: "chamarras",
    precio: 950,
    precioUSD: 65,
    talla: "S",
    epoca: "1970s",
    origen: "Europa",
    descripcion:
      "Lana gruesa tejida a máquina, patrón geométrico en pecho. Sin polillas, cuello reforzado.",
    qc: { concepto: 8, epoca: 9, rareza: 8, condicion: 8, estetica: 9 },
    lote: "UD0148",
    stock: true,
    creadoEn: base(6),
    medidas: { pecho: 19, largo: 25 },
  },
  {
    slug: "pantalon-cargo-militar",
    nombre: "Pantalón cargo militar",
    categoria: "pantalones",
    precio: 690,
    precioUSD: 49,
    talla: "34",
    epoca: "2000s",
    origen: "Manufactura militar",
    descripcion:
      "Seis bolsas funcionales, cintura ajustable. Etiqueta de talla original legible.",
    qc: { concepto: 7, epoca: 7, rareza: 6, condicion: 7, estetica: 7 },
    lote: "UD0149",
    stock: true,
    creadoEn: base(7),
  },
  {
    slug: "cinturon-piel-hebilla-laton",
    nombre: "Cinturón piel hebilla latón",
    categoria: "accesorios",
    precio: 420,
    precioUSD: 29,
    talla: "34",
    epoca: "1980s",
    origen: "México",
    descripcion:
      "Piel curtida a mano, hebilla de latón macizo con pátina natural.",
    qc: { concepto: 7, epoca: 8, rareza: 7, condicion: 8, estetica: 8 },
    lote: "UD0150",
    stock: true,
    creadoEn: base(8),
  },
  {
    slug: "playera-gira-single-stitch",
    nombre: "Playera de gira, single stitch",
    categoria: "playeras",
    precio: 1100,
    precioUSD: 75,
    talla: "M",
    epoca: "1990s",
    origen: "Estados Unidos",
    descripcion:
      "Costura sencilla en mangas. Estampado frente y espalda con desgaste parejo.",
    qc: { concepto: 9, epoca: 9, rareza: 9, condicion: 7, estetica: 8 },
    lote: "UD0151",
    stock: true,
    creadoEn: base(9),
    medidas: { pecho: 20, largo: 28 },
  },
  {
    slug: "rompevientos-color-block",
    nombre: "Rompevientos color block",
    categoria: "chamarras",
    precio: 890,
    precioUSD: 59,
    talla: "L",
    epoca: "1990s",
    origen: "Asia",
    descripcion:
      "Nylon ligero con bloques de color contrastantes, forro de malla, cierre funcional.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 8, estetica: 8 },
    lote: "UD0152",
    stock: true,
    creadoEn: base(10),
    medidas: { pecho: 24, largo: 28 },
  },
  {
    slug: "mezclilla-recta-90s",
    nombre: "Mezclilla recta",
    categoria: "pantalones",
    precio: 950,
    precioUSD: 65,
    talla: "30",
    epoca: "1990s",
    origen: "Estados Unidos",
    descripcion:
      "Corte recto, remaches de cobre, resane discreto en rodilla izquierda.",
    qc: { concepto: 8, epoca: 8, rareza: 6, condicion: 6, estetica: 8 },
    lote: "UD0153",
    stock: true,
    creadoEn: base(11),
  },
  {
    slug: "bufanda-lana-artesanal",
    nombre: "Bufanda de lana artesanal",
    categoria: "accesorios",
    precio: 380,
    precioUSD: 29,
    talla: "Única",
    epoca: "1980s",
    origen: "México",
    descripcion:
      "Tejido artesanal, flecos originales. Colores vivos sin decoloración.",
    qc: { concepto: 6, epoca: 7, rareza: 8, condicion: 9, estetica: 7 },
    lote: "UD0154",
    stock: true,
    creadoEn: base(12),
  },
  {
    slug: "chamarra-piel-motociclista",
    nombre: "Chamarra de piel motociclista",
    categoria: "chamarras",
    precio: 2400,
    precioUSD: 159,
    talla: "M",
    epoca: "1970s",
    origen: "Estados Unidos",
    descripcion:
      "Piel gruesa curtida, cierres funcionales, forro reemplazado con material de época. Pieza insignia.",
    qc: { concepto: 10, epoca: 9, rareza: 10, condicion: 8, estetica: 10 },
    lote: "UD0155",
    stock: true,
    creadoEn: base(13),
    destacada: true,
    medidas: { pecho: 21, largo: 25 },
  },
];
