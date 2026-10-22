// Contenido de la página "The perfect fit".
// Los rangos son una REFERENCIA general (ancho de axila a axila, en pulgadas).
// Ajústalos con las medidas reales de las piezas que ustedes manejan.

export const AJUSTES = [
  {
    clave: "ajustada",
    titulo: "Ajustada",
    pecho: [17, 19] as [number, number],
    descripcion:
      "Cae pegada al cuerpo. Playeras chicas, cortes de mujer y piezas de los años 70 y 80.",
  },
  {
    clave: "regular",
    titulo: "Regular",
    pecho: [19, 21] as [number, number],
    descripcion:
      "El corte clásico de una playera de uso diario: ni apretada ni suelta.",
  },
  {
    clave: "holgada",
    titulo: "Holgada",
    pecho: [21, 23] as [number, number],
    descripcion:
      "Un poco de aire en el torso. Se ve bien sola o con una capa encima.",
  },
  {
    clave: "oversized",
    titulo: "Oversized",
    pecho: [23, 26] as [number, number],
    descripcion:
      "Caída ancha y larga, el look de playera de banda de los 90.",
  },
];

export const TABLA_TALLAS = [
  { talla: "S", pecho: "18–19″" },
  { talla: "M", pecho: "20–21″" },
  { talla: "L", pecho: "22–23″" },
  { talla: "XL", pecho: "24–25″" },
];

export const PASOS_MEDIR = [
  "Extiende una playera que ya te quede como te gusta, bien plana sobre una mesa.",
  "Mide de axila a axila, de costura a costura, sin estirar la tela. Ese es el ancho de pecho.",
  "Mide el largo desde la costura del cuello (hombro) hasta el borde inferior.",
  "Busca piezas con esas medidas aquí abajo: la talla de la etiqueta importa menos que la medida real.",
];
