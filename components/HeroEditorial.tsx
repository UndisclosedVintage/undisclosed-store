import Image from "next/image";
import Link from "next/link";

export interface Tesela {
  src?: string;
  alt: string;
  href: string;
  pie?: string;
}

const COLORES = ["bg-rosa/40", "bg-azul/50", "bg-verde/60", "bg-rosa/25", "bg-azul/30"];

// Portada editorial: una foto grande y cuatro chicas, estilo revista.
export default function HeroEditorial({ teselas }: { teselas: Tesela[] }) {
  const lista = teselas.slice(0, 5);
  while (lista.length < 5) {
    lista.push({ alt: "Próximamente", href: "/catalogo" });
  }

  return (
    <section aria-label="Selección destacada" className="pt-6 sm:pt-8">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-2">
        {lista.map((t, i) => {
          const grande = i === 0;
          return (
            <Link
              key={`${t.href}-${i}`}
              href={t.href}
              className={`group relative block overflow-hidden ${COLORES[i]} ${
                grande
                  ? "col-span-2 aspect-[4/5] md:row-span-2 md:aspect-auto md:min-h-[34rem]"
                  : "aspect-[4/5]"
              }`}
            >
              {t.src ? (
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  priority={i < 2}
                  sizes={grande ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="tab-label text-[11px] uppercase text-ink/40">
                    foto pendiente
                  </span>
                </span>
              )}
              {t.pie && (
                <span className="tab-label absolute bottom-2 left-2 bg-kraft px-2 py-1 text-[11px] uppercase">
                  {t.pie}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
