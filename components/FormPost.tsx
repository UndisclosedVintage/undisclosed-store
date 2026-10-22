"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { reducirImagen } from "@/lib/imagenes-cliente";
import type { Post } from "@/lib/posts";

const campo =
  "w-full rounded-sm border border-ink/30 bg-paper px-3 py-2 font-serif text-[15px] outline-none focus:border-stamp";

export default function FormPost({ post }: { post?: Post }) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const original = new FormData(e.currentTarget);
      const datos = new FormData();
      for (const [k, v] of original.entries()) {
        if (k === "portada" && v instanceof File) {
          if (v.size > 0) datos.append("portada", await reducirImagen(v, 2000));
        } else {
          datos.append(k, v);
        }
      }
      if (post) {
        datos.set("slug", post.slug);
        datos.set("portadaActual", post.portada ?? "");
      }
      const r = await fetch("/api/posts", {
        method: post ? "PUT" : "POST",
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
    <form onSubmit={enviar} className="max-w-2xl space-y-5">
      <label className="block">
        <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">Título</span>
        <input name="titulo" required defaultValue={post?.titulo} className={campo} />
      </label>

      <label className="block">
        <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">
          Extracto (una o dos frases para la lista del blog)
        </span>
        <textarea name="extracto" rows={2} defaultValue={post?.extracto} className={campo} />
      </label>

      <div>
        <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">Portada</span>
        {post?.portada && (
          <div className="mb-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.portada} alt="" className="h-20 w-auto" />
            <label className="flex items-center gap-2 font-serif text-sm">
              <input type="checkbox" name="quitarPortada" className="accent-[rgb(var(--c-stamp))]" />
              Quitar portada
            </label>
          </div>
        )}
        <input name="portada" type="file" accept="image/*" className="block font-serif text-sm" />
      </div>

      <label className="block">
        <span className="tab-label mb-1 block text-[11px] uppercase text-ink/60">Texto</span>
        <textarea
          name="contenido"
          rows={18}
          required
          defaultValue={post?.contenido}
          className={`${campo} font-mono text-sm`}
        />
        <span className="mt-1 block font-serif text-xs text-ink/55">
          Formato: <code>## Subtítulo</code>, <code>- lista</code>, <code>&gt; cita</code>,{" "}
          <code>**negrita**</code>, <code>*cursiva*</code>, <code>[texto](https://…)</code>,{" "}
          <code>![descripción](https://…/foto.jpg)</code>. Deja una línea en blanco entre
          párrafos.
        </span>
      </label>

      <label className="flex items-center gap-2 font-serif text-sm">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={post?.publicado}
          className="accent-[rgb(var(--c-stamp))]"
        />
        Publicado (visible en el sitio)
      </label>

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
        {guardando ? "Guardando…" : post ? "Guardar cambios" : "Crear artículo"}
      </button>
    </form>
  );
}
