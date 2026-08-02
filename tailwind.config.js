/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: "#DCD1B4",
        kraftlight: "#EDE6D3",
        paper: "#F4EFE1",
        ink: "#221F19",
        blackout: "#15130F",
        stamp: "#A23B27",
        stampdark: "#7D2C1B",
        brass: "#5C6E52",
        brasslight: "#8A9A7C",
      },
      fontFamily: {
        stamp: ["var(--font-stamp)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 1px 1px, rgba(34,31,25,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
