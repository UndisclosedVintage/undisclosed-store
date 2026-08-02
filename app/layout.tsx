import type { Metadata } from "next";
import { Special_Elite, PT_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

const stamp = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-stamp",
});

const serif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Undisclosed Vintage — Guadalajara",
  description:
    "Ropa vintage seleccionada pieza por pieza en Colonia Americana, Guadalajara. Cada prenda pasa por nuestro sistema de control de calidad de 5 criterios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${stamp.variable} ${serif.variable} ${mono.variable} font-serif`}
      >
        <CartProvider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 sm:px-6">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
