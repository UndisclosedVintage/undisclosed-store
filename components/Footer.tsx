import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site-config";

export default function Footer() {
  const redes = [
    site.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${site.instagram}`,
    },
    site.tiktok && {
      label: "TikTok",
      href: `https://tiktok.com/@${site.tiktok}`,
    },
    site.whatsapp && { label: "WhatsApp", href: `https://wa.me/${site.whatsapp}` },
    site.email && { label: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 border-t border-ink/15 bg-kraftlight">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image
            src={site.logos.verde}
            alt={site.nombre}
            width={900}
            height={486}
            className="h-20 w-auto"
          />
          <p className="mt-3 font-serif text-sm text-ink/65">
            Ropa vintage seleccionada pieza por pieza. {site.ciudad}.
          </p>
        </div>

        <FooterCol titulo="Tienda">
          <Link href="/catalogo?coleccion=nuevos">New arrivals</Link>
          <Link href="/catalogo">Todo el catálogo</Link>
          <Link href="/carrito">Tu selección</Link>
          <Link href="/guia-de-tallas">The perfect fit</Link>
        </FooterCol>

        <FooterCol titulo="Info">
          <Link href="/consigna">Sell your shirts</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/nosotros">Nosotros</Link>
          <Link href="/contacto">Contacto</Link>
        </FooterCol>

        <FooterCol titulo="Síguenos">
          {redes.length ? (
            redes.map((r) => (
              <a key={r.href} href={r.href} target="_blank" rel="noreferrer">
                {r.label}
              </a>
            ))
          ) : (
            <Link href="/contacto">Contacto</Link>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-ink/10">
        <p className="tab-label mx-auto max-w-6xl px-4 py-4 text-[11px] uppercase text-ink/50 sm:px-6">
          © {new Date().getFullYear()} {site.nombre} · Cada pieza es única y
          vintage.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="tab-label mb-3 text-[11px] uppercase text-ink/50">{titulo}</p>
      <div className="flex flex-col gap-2 font-serif text-sm [&_a:hover]:text-stamp">
        {children}
      </div>
    </div>
  );
}
