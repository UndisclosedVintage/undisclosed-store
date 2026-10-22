"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GaleriaFotos({
  imagenes,
  alt,
  href,
  vendida = false,
  miniaturas = false,
  prioridad = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  imagenes?: string[];
  alt: string;
  href?: string; // si se pasa, tocar la foto lleva a la pieza
  vendida?: boolean;
  miniaturas?: boolean;
  prioridad?: boolean;
  sizes?: string;
}) {
  const fotos = (imagenes ?? []).filter(Boolean);
  const [indice, setIndice] = useState(0);
  const inicioToque = useRef<number | null>(null);
  const hayVarias = fotos.length > 1;

  function siguiente() {
    setIndice((i) => (i + 1) % fotos.length);
  }

  function anterior() {
    setIndice((i) => (i - 1 + fotos.length) % fotos.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    inicioToque.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (inicioToque.current === null) return;
    const delta = e.changedTouches[0].clientX - inicioToque.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) siguiente();
      else anterior();
    }
    inicioToque.current = null;
  }

  const etiquetaVendida = vendida ? (
    <span className="stamp absolute right-2 top-2 z-10 bg-paper text-xs text-stamp">
      vendida
    </span>
  ) : null;

  if (fotos.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-azul/25">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="tab-label text-[11px] uppercase text-ink/45">
            foto pendiente
          </span>
        </div>
        {href && (
          <Link href={href} aria-label={alt} className="absolute inset-0 z-0" />
        )}
        {etiquetaVendida}
      </div>
    );
  }

  return (
    <div>
      <div
        className="group relative aspect-[3/4] w-full select-none overflow-hidden bg-white"
        style={{ touchAction: "pan-y" }}
        onTouchStart={hayVarias ? onTouchStart : undefined}
        onTouchEnd={hayVarias ? onTouchEnd : undefined}
      >
        <Image
          src={fotos[indice]}
          alt={alt}
          fill
          sizes={sizes}
          priority={prioridad && indice === 0}
          className={`object-contain ${vendida ? "opacity-60" : ""}`}
        />

        {href && (
          <Link href={href} aria-label={alt} className="absolute inset-0 z-0" />
        )}

        {hayVarias && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={anterior}
              className="absolute left-0 top-0 z-10 flex h-full w-1/5 items-center justify-start pl-1 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blackout/50 text-lg text-paper">
                ‹
              </span>
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={siguiente}
              className="absolute right-0 top-0 z-10 flex h-full w-1/5 items-center justify-end pr-1 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blackout/50 text-lg text-paper">
                ›
              </span>
            </button>
            <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1">
              {fotos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === indice ? "w-4 bg-ink/70" : "w-1.5 bg-ink/25"
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {etiquetaVendida}
      </div>

      {miniaturas && hayVarias && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {fotos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border bg-white ${
                i === indice ? "border-stamp" : "border-ink/20"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
