"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Botón del panel que cambia un estado (vendida / publicado) con PATCH.
export default function ToggleAdmin({
  endpoint,
  slug,
  campo,
  activo,
  etiquetaActivo,
  etiquetaInactivo,
}: {
  endpoint: "/api/productos" | "/api/posts";
  slug: string;
  campo: "vendida" | "publicado";
  activo: boolean;
  etiquetaActivo: string;
  etiquetaInactivo: string;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cambiar() {
    setCargando(true);
    setError(null);
    try {
      const r = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, [campo]: !activo }),
      });
      if (!r.ok) {
        const res = await r.json().catch(() => ({}));
        throw new Error(res.error || "No se pudo cambiar.");
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
        onClick={cambiar}
        disabled={cargando}
        className={`tab-label rounded-sm border px-2 py-1 text-[11px] uppercase disabled:opacity-50 ${
          activo ? "border-ink/40 bg-ink/10" : "border-stamp text-stamp"
        }`}
      >
        {activo ? etiquetaActivo : etiquetaInactivo}
      </button>
      {error && <span className="text-[11px] text-stamp">{error}</span>}
    </span>
  );
}
