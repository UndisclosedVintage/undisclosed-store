import { Inter_Tight, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";

// Sistema tipográfico (el mismo de las historias de Instagram + la etiqueta):
//  - display: serif condensada y alta, para títulos. Recuerda la etiqueta 4x8.
//  - serif (cuerpo): Inter Tight. El nombre de la variable es histórico; es la
//    letra del texto corrido.
//  - stamp/mono: IBM Plex Mono, para etiquetas pequeñas, folios y precios.
//
// Para cambiar una fuente: reemplaza el nombre importado (cualquiera de
// Google Fonts) y deja el mismo "variable".
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const cuerpo = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const clasesFuentes = `${display.variable} ${cuerpo.variable} ${mono.variable}`;
