"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Borra una pieza del catálogo (para errores o piezas de prueba).
// Para piezas vendidas NO uses esto: márcalas como vendidas y quedan en el archivo.
export default function EliminarPieza({
  slug,
  nombre,
  vendida,
}: {
  slug: string;
  nombre: string;
  vendida: boolean;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function eliminar() {
    const aviso = vendida
      ? `"${nombre}" está marcada como vendida y forma parte del archivo. Si la eliminas, también se borra del archivo y se pierden sus fotos. ¿Eliminar de todos modos?`
      : `¿Eliminar "${nombre}"? Se borran la pieza y sus fotos. No se puede deshacer.`;
    if (!window.confirm(aviso)) return;

    setCargando(true);
    setError(null);
    try {
      const r = await fetch("/api/productos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!r.ok) {
        const res = await r.json().catch(() => ({}));
        throw new Error(res.error || "No se pudo eliminar.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={eliminar}
        disabled={cargando}
        className="tab-label rounded-sm border border-ink/30 px-2 py-1 text-[11px] uppercase text-ink/60 hover:border-stamp hover:text-stamp disabled:opacity-50"
      >
        eliminar
      </button>
      {error && <span className="text-[11px] text-stamp">{error}</span>}
    </span>
  );
}
