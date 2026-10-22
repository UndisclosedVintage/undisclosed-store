/** @type {import('tailwindcss').Config} */

// Los colores viven como variables CSS en app/globals.css (sección :root).
// Para cambiar la paleta del sitio solo hay que editar esos valores.
const c = (nombre) => `rgb(var(--c-${nombre}) / <alpha-value>)`;

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: c("kraft"),
        kraftlight: c("kraftlight"),
        paper: c("paper"),
        ink: c("ink"),
        blackout: c("blackout"),
        stamp: c("stamp"),
        stampdark: c("stampdark"),
        brass: c("brass"),
        brasslight: c("brasslight"),
        rosa: c("rosa"),
        azul: c("azul"),
        verde: c("verde"),
      },
      // display = títulos · serif = texto corrido (Inter Tight) ·
      // stamp/mono = etiquetas, folios y precios (IBM Plex Mono)
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "system-ui", "sans-serif"],
        stamp: ["var(--font-mono)", "ui-monospace", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
