"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIAS, EPOCAS, type Product } from "@/lib/products";
import { LIMITE_TOTAL_BYTES, reducirImagen } from "@/lib/imagenes-cliente";

const campo =
  "w-full rounded-sm border border-ink/30 bg-paper px-3 py-2 font-serif text-[15px] outline-none focus:border-stamp";

export default function FormPieza({ pieza }: { pieza?: Product }) {
  const router = useRouter();
  const [fotos, setFotos] = useState<string[]>(pieza?.imagenes ?? []);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mover(i: number, d: -1 | 1) {
    setFotos((f) => {
      const j = i + d;
      if (j < 0 || j >= f.length) return f;
      const c = [...f];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const original = new FormData(e.currentTarget);
      const datos = new FormData();
      for (const [k, v] of original.entries()) {
        if (k !== "fotos") datos.append(k, v);
      }

      let total = 0;
      for (const v of original.getAll("fotos")) {
        if (v instanceof File && v.size > 0) {
          const chica = await reducirImagen(v);
          total += chica.size;
          datos.append("fotos", chica);
        }
      }
      if (total > LIMITE_TOTAL_BYTES) {
        throw new Error(
          "Las fotos nuevas pesan demasiado juntas. Guarda la pieza con algunas y agrega el resto editándola después."
        );
      }

      if (pieza) {
        datos.set("slug", pieza.slug);
        datos.set("mantener", JSON.stringify(fotos));
      }

      const r = await fetch("/api/productos", {
        method: pieza ? "PUT" : "POST",
        body: datos,
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(res.error || "No se pudo guardar.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="max-w-2xl space-y-6">
      <section className="space-y-3">
        <h2 className="tab-label text-[11px] uppercase text-ink/55">Fotos</h2>

        {fotos.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {fotos.map((url, i) => (
              <li key={url} className="space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="aspect-[4/5] w-full bg-paper object-contain"
                />
                <div className="tab-label flex justify-between text-[11px]">
                  <button type="button" onClick={() => mover(i, -1)} aria-label="Mover antes">
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setFotos((f) => f.filter((_, j) => j !== i))}
                    className="text-stamp"
                  >
                    quitar
                  </button>
                  <button type="button" onClick={() => mover(i, 1)} aria-label="Mover después">
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <input
          name="fotos"
          type="file"
          accept="image/*"
          multiple
          className="block w-full font-serif text-sm"
        />
        <p className="font-serif text-xs text-ink/55">
          La primera foto es la portada de la pieza. Con fondo blanco (Photoroom)
          se ven mejor. Se reducen automáticamente antes de subirlas.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nombre" className="sm:col-span-2">
          <input name="nombre" required defaultValue={pieza?.nombre} className={campo} />
        </Campo>
        <Campo label="Categoría">
          <select name="categoria" defaultValue={pieza?.categoria ?? "playeras"} className={campo}>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Talla">
          <input name="talla" required defaultValue={pieza?.talla} placeholder="M" className={campo} />
        </Campo>
        <Campo label="Época">
          <select name="epoca" defaultValue={pieza?.epoca ?? "1990s"} className={campo}>
            {EPOCAS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Origen (opcional)">
          <input name="origen" defaultValue={pieza?.origen} placeholder="USA" className={campo} />
        </Campo>
        <Campo label="Precio MXN">
          <input
            name="precio"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={pieza?.precio}
            className={campo}
          />
        </Campo>
        <Campo label="Precio USD (vacío = solo MXN)">
          <input
            name="precioUSD"
            type="number"
            min="1"
            step="1"
            defaultValue={pieza?.precioUSD}
            className={campo}
          />
        </Campo>
        <Campo label="Pecho, axila a axila (pulgadas, tops)">
          <input
            name="pecho"
            type="number"
            min="1"
            step="0.5"
            defaultValue={pieza?.medidas?.pecho}
            className={campo}
          />
        </Campo>
        <Campo label="Cintura (pulgadas, solo bottoms)">
          <input
            name="cintura"
            type="number"
            min="1"
            step="0.5"
            defaultValue={pieza?.medidas?.cintura}
            className={campo}
          />
        </Campo>
        <Campo label="Largo (pulgadas)">
          <input
            name="largo"
            type="number"
            min="1"
            step="0.5"
            defaultValue={pieza?.medidas?.largo}
            className={campo}
          />
        </Campo>
        <Campo label="Folio (vacío = automático)">
          <input name="lote" defaultValue={pieza?.lote} placeholder="UD0156" className={campo} />
        </Campo>
        <label className="flex items-center gap-2 self-end pb-2 font-serif text-sm">
          <input
            name="destacada"
            type="checkbox"
            defaultChecked={pieza?.destacada}
            className="accent-[rgb(var(--c-stamp))]"
          />
          Pieza destacada (sale primero en la portada)
        </label>
        <Campo label="Descripción (detalles, estado, defectos)" className="sm:col-span-2">
          <textarea
            name="descripcion"
            rows={5}
            defaultValue={pieza?.descripcion}
            className={campo}
          />
        </Campo>
      </section>

      <details className="border border-ink/20 p-4">
        <summary className="tab-label cursor-pointer text-[11px] uppercase text-ink/60">
          QC interno (0–10, nunca se muestra al público)
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(
            [
              ["qc_concepto", "Concepto", pieza?.qc.concepto],
              ["qc_epoca", "Época", pieza?.qc.epoca],
              ["qc_rareza", "Rareza", pieza?.qc.rareza],
              ["qc_condicion", "Condición", pieza?.qc.condicion],
              ["qc_estetica", "Estética", pieza?.qc.estetica],
            ] as const
          ).map(([n, l, v]) => (
            <Campo key={n} label={l}>
              <input name={n} type="number" min="0" max="10" step="0.5" defaultValue={v} className={campo} />
            </Campo>
          ))}
        </div>
      </details>

      {error && (
        <p role="alert" className="font-serif text-sm text-stamp">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="tab-label rounded-sm border border-stamp bg-stamp px-6 py-3 text-sm uppercase text-paper hover:bg-stampdark disabled:opacity-50"
      >
        {guardando ? "Guardando…" : pieza ? "Guardar cambios" : "Publicar pieza"}
      </button>
    </form>
  );
}

function Campo({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">
        {label}
      </span>
      {children}
    </label>
  );
}
