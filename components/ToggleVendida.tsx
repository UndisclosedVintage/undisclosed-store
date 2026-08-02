"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleVendida({
  slug,
  vendida,
}: {
  slug: string;
  vendida: boolean;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  async function alternar() {
    setCargando(true);
    try {
      await fetch("/api/productos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, vendida: !vendida }),
      });
      router.refresh();
    } finally {
      setCargando(false);
    }
  }

  return (
    <button
      onClick={alternar}
      disabled={cargando}
      className={`tab-label text-[11px] uppercase px-3 py-1.5 rounded-sm border disabled:opacity-50 ${
        vendida
          ? "border-brass text-brass hover:bg-brass/15"
          : "border-stamp text-stamp hover:bg-stamp hover:text-paper"
      }`}
    >
      {vendida ? "marcar disponible" : "marcar vendida"}
    </button>
  );
}
