"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = ["playeras", "chamarras", "pantalones", "accesorios"];
const CRITERIOS_QC: { clave: string; label: string }[] = [
  { clave: "qc_concepto", label: "Concepto" },
  { clave: "qc_epoca", label: "Época" },
  { clave: "qc_rareza", label: "Rareza" },
  { clave: "qc_condicion", label: "Condición" },
  { clave: "qc_estetica", label: "Estética" },
];

export default function SubirPieza() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      formRef.current?.reset();
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="py-10 max-w-xl">
      <p className="tab-label text-xs uppercase text-ink/50 mb-2">
        nueva ficha
      </p>
      <h1 className="font-serif text-3xl mb-6">Agregar pieza</h1>

      <form ref={formRef} onSubmit={enviar} className="space-y-4">
        <div>
          <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
            Foto (fondo blanco)
          </label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Nombre
            </label>
            <input
              required
              name="nombre"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
          <div>
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Categoría
            </label>
            <select
              name="categoria"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Precio (MXN)
            </label>
            <input
              required
              type="number"
              min={0}
              name="precio"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
          <div>
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Talla
            </label>
            <input
              required
              name="talla"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
          <div>
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Época
            </label>
            <input
              required
              name="epoca"
              placeholder="ej. Años 90"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
          <div className="col-span-2">
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Origen
            </label>
            <input
              name="origen"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
          <div className="col-span-2">
            <label className="tab-label text-[11px] uppercase text-ink/60 block mb-1">
              Descripción
            </label>
            <textarea
              required
              rows={3}
              name="descripcion"
              className="w-full bg-paper border border-ink/25 rounded-sm px-3 py-2 font-serif"
            />
          </div>
        </div>

        <div className="perforated pt-4">
          <p className="tab-label text-[11px] uppercase text-ink/60 mb-2">
            Control de calidad (0–10, como en el grupo)
          </p>
          <div className="grid grid-cols-5 gap-2">
            {CRITERIOS_QC.map((c) => (
              <div key={c.clave}>
                <label className="tab-label text-[10px] uppercase text-ink/50 block mb-1">
                  {c.label}
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  max={10}
                  defaultValue={7}
                  name={c.clave}
                  className="w-full bg-paper border border-ink/25 rounded-sm px-2 py-2 font-mono text-center"
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-stamp font-serif text-sm border border-stamp rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="tab-label text-sm uppercase px-6 py-3 bg-stamp text-paper rounded-sm hover:bg-stampdark disabled:opacity-50"
        >
          {enviando ? "guardando…" : "agregar al catálogo"}
        </button>
      </form>
    </div>
  );
}
