import Link from "next/link";
import type { ReactNode } from "react";

// Renderizador mínimo de texto con formato, para el blog. No usa
// dangerouslySetInnerHTML: todo se convierte en elementos de React.
//
// Sintaxis:  ## Título   ### Subtítulo   - lista   > cita
//            ![texto](https://…/foto.jpg)   **negrita**   *cursiva*   [texto](url)

function enlaceSeguro(url: string) {
  return /^(https?:\/\/|\/(?!\/)|mailto:)/i.test(url);
}

function enLinea(texto: string, clave: string): ReactNode[] {
  const nodos: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let ultimo = 0;
  let i = 0;
  for (const m of texto.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > ultimo) nodos.push(texto.slice(ultimo, idx));
    const t = m[0];
    const k = `${clave}-${i++}`;
    if (t.startsWith("**")) {
      nodos.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    } else if (t.startsWith("*")) {
      nodos.push(<em key={k}>{t.slice(1, -1)}</em>);
    } else {
      const partes = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t);
      if (partes && enlaceSeguro(partes[2])) {
        const externo = /^https?:/i.test(partes[2]);
        nodos.push(
          externo ? (
            <a
              key={k}
              href={partes[2]}
              target="_blank"
              rel="noreferrer noopener"
              className="text-stamp underline underline-offset-2"
            >
              {partes[1]}
            </a>
          ) : (
            <Link
              key={k}
              href={partes[2]}
              className="text-stamp underline underline-offset-2"
            >
              {partes[1]}
            </Link>
          )
        );
      } else {
        nodos.push(t);
      }
    }
    ultimo = idx + t.length;
  }
  if (ultimo < texto.length) nodos.push(texto.slice(ultimo));
  return nodos;
}

export default function Prosa({ texto }: { texto: string }) {
  const bloques = texto.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const salida: ReactNode[] = [];

  bloques.forEach((bloque, i) => {
    const b = bloque.trim();
    if (!b) return;
    const k = `b${i}`;

    if (b.startsWith("### ")) {
      salida.push(
        <h3 key={k} className="mt-8 font-display text-2xl">
          {enLinea(b.slice(4), k)}
        </h3>
      );
    } else if (b.startsWith("## ")) {
      salida.push(
        <h2 key={k} className="mt-10 font-display text-3xl">
          {enLinea(b.slice(3), k)}
        </h2>
      );
    } else if (/^- /.test(b)) {
      const lineas = b.split("\n").filter((l) => l.startsWith("- "));
      salida.push(
        <ul key={k} className="list-disc space-y-1 pl-6">
          {lineas.map((l, j) => (
            <li key={j}>{enLinea(l.slice(2), `${k}-${j}`)}</li>
          ))}
        </ul>
      );
    } else if (b.startsWith("> ")) {
      salida.push(
        <blockquote
          key={k}
          className="border-l-4 border-stamp pl-4 font-display text-xl italic text-ink/80"
        >
          {enLinea(b.replace(/^> ?/gm, ""), k)}
        </blockquote>
      );
    } else {
      const img = /^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)$/.exec(b);
      if (img) {
        salida.push(
          <figure key={k} className="my-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img[2]} alt={img[1]} className="w-full" loading="lazy" />
            {img[1] && (
              <figcaption className="tab-label mt-2 text-[11px] uppercase text-ink/55">
                {img[1]}
              </figcaption>
            )}
          </figure>
        );
      } else {
        const lineas = b.split("\n");
        salida.push(
          <p key={k}>
            {lineas.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {enLinea(l, `${k}-${j}`)}
              </span>
            ))}
          </p>
        );
      }
    }
  });

  return (
    <div className="space-y-5 font-serif text-[17px] leading-relaxed">
      {salida}
    </div>
  );
}
