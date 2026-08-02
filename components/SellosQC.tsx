import type { QC } from "@/lib/products";

const ETIQUETAS: { clave: keyof QC; label: string }[] = [
  { clave: "concepto", label: "Concepto" },
  { clave: "epoca", label: "Época" },
  { clave: "rareza", label: "Rareza" },
  { clave: "condicion", label: "Condición" },
  { clave: "estetica", label: "Estética" },
];

export default function SellosQC({ qc, compact = false }: { qc: QC; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
        {ETIQUETAS.map(({ clave, label }) => (
          <span
            key={clave}
            className="border border-ink/25 rounded-sm px-1.5 py-0.5 bg-paper/60"
            title={label}
          >
            {label.slice(0, 3).toUpperCase()} {qc[clave]}
          </span>
        ))}
      </div>
    );
  }

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {ETIQUETAS.map(({ clave, label }) => (
        <div
          key={clave}
          className="manila-card rounded-sm px-3 py-2 text-center"
        >
          <dt className="tab-label text-[10px] uppercase text-ink/60">
            {label}
          </dt>
          <dd className="font-mono text-xl mt-1">{qc[clave]}</dd>
        </div>
      ))}
    </dl>
  );
}
