import type { Metadata, Viewport } from "next";
import "./globals.css";
import { clasesFuentes } from "@/lib/fuentes";
import { site } from "@/lib/site-config";
import { MonedaProvider } from "@/lib/moneda-context";
import { CartProvider } from "@/lib/cart-context";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CursorPersonalizado from "@/components/CursorPersonalizado";

const urlBase = process.env.NEXT_PUBLIC_SITE_URL || site.dominio;

export const metadata: Metadata = {
  metadataBase: new URL(urlBase),
  title: {
    default: `${site.nombre} — ropa vintage seleccionada`,
    template: `%s — ${site.nombre}`,
  },
  description:
    "Ropa vintage seleccionada pieza por pieza desde Colonia Americana, Guadalajara. Envíos a todo México y a Estados Unidos.",
  openGraph: {
    siteName: site.nombre,
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F1EEE7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={clasesFuentes}>
      <body className="min-h-screen font-serif antialiased">
        <MonedaProvider>
          <CartProvider>
            <Nav />
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              {children}
            </main>
            <Footer />
            <CursorPersonalizado />
          </CartProvider>
        </MonedaProvider>
      </body>
    </html>
  );
}
