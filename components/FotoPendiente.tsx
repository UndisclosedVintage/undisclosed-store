import Image from "next/image";

export default function FotoPendiente({
  lote,
  epoca,
  imagen,
  alt,
}: {
  lote: string;
  epoca: string;
  imagen?: string;
  alt?: string;
}) {
  if (imagen) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper">
        <Image
          src={imagen}
          alt={alt || `Fotografía de la pieza, lote ${lote}`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-3 py-1.5 bg-blackout/80 font-mono text-[10px] text-paper/80 tracking-wide">
          <span>{lote}</span>
          <span>{epoca}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(244,239,225,0.06) 0px, rgba(244,239,225,0.06) 2px, transparent 2px, transparent 10px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="stamp text-paper text-xs rotate-[-8deg] border-paper">
          foto pendiente
        </span>
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-3 py-1.5 bg-blackout/80 font-mono text-[10px] text-paper/80 tracking-wide">
        <span>{lote}</span>
        <span>{epoca}</span>
      </div>
    </div>
  );
}
