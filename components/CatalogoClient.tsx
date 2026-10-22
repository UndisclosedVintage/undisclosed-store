"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { useMoneda } from "@/lib/moneda-context";
import { precioEn } from "@/lib/moneda";
import {
  CATEGORIAS,
  EPOCAS,
  compararTallas,
  type Categoria,
  type Product,
} from "@/lib/products";
import { site } from "@/lib/site-config";

export type Orden =
  | "destacadas"
  | "relevantes"
  | "az"
  | "za"
  | "precio-asc"
  | "precio-desc"
  | "fecha-asc"
  | "fecha-desc";

export interface FiltrosIniciales {
  coleccion?: "nuevos";
  categoria?: Categoria;
  q?: string;
  tallas?: string[];
  epocas?: string[];
  pecho?: [number, number];
  orden?: Orden;
  vendidas?: boolean;
}

const ORDENES: { valor: Orden; label: string }[] = [
  { valor: "destacadas", label: "Destacadas" },
  { valor: "relevantes", label: "Más relevantes" },
  { valor: "az", label: "Alfabético (A–Z)" },
  { valor: "za", label: "Alfabético (Z–A)" },
  { valor: "precio-asc", label: "Precio: menor a mayor" },
  { valor: "precio-desc", label: "Precio: mayor a menor" },
  { valor: "fecha-desc", label: "Fecha: nuevas primero" },
  { valor: "fecha-asc", label: "Fecha: antiguas primero" },
];

// Clases completas (Tailwind no detecta clases armadas con texto suelto)
const COLS_ESC = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
} as const;
const COLS_MOV = { 1: "grid-cols-1", 2: "grid-cols-2" } as const;

const PAGINA = 24;
const KEY_COLS = "undisclosed:columnas";
const CHIPS_PECHO = [18, 19, 20, 21, 22, 23, 24];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function puntaje(p: Product, tokens: string[]) {
  const nombre = norm(p.nombre);
  const resto = norm(
    `${p.descripcion} ${p.categoria} ${p.epoca} ${p.talla} ${p.origen} ${p.lote}`
  );
  let total = 0;
  for (const t of tokens) {
    if (nombre.includes(t)) total += 3;
    else if (resto.includes(t)) total += 1;
    else return 0;
  }
  return total;
}

function serializarPecho([a, b]: [number, number]) {
  const centro = (a + b) / 2;
  if (b - a === 1 && Number.isInteger(centro)) return String(centro);
  return `${a}-${b}`;
}

function etiquetaPecho([a, b]: [number, number]) {
  const centro = (a + b) / 2;
  if (b - a === 1 && Number.isInteger(centro)) return `Pecho ${centro}″`;
  return `Pecho ${a}″–${b}″`;
}

const chipBase =
  "tab-label rounded-sm border px-2.5 py-1 text-xs transition-colors";
const chipOn = "border-stamp bg-stamp text-paper";
const chipOff = "border-ink/25 hover:border-ink";

export default function CatalogoClient({
  productos,
  inicial,
}: {
  productos: Product[];
  inicial: FiltrosIniciales;
}) {
  const { moneda } = useMoneda();

  const ordenPorDefecto: Orden =
    inicial.coleccion === "nuevos" ? "fecha-desc" : "destacadas";

  const [coleccion, setColeccion] = useState<"nuevos" | null>(
    inicial.coleccion ?? null
  );
  const [categoria, setCategoria] = useState<Categoria | "todas">(
    inicial.categoria ?? "todas"
  );
  const [q, setQ] = useState(inicial.q ?? "");
  const [tallas, setTallas] = useState<string[]>(inicial.tallas ?? []);
  const [epocas, setEpocas] = useState<string[]>(inicial.epocas ?? []);
  const [pecho, setPecho] = useState<[number, number] | null>(
    inicial.pecho ?? null
  );
  const [vendidas, setVendidas] = useState(inicial.vendidas ?? false);
  const [orden, setOrden] = useState<Orden>(inicial.orden ?? ordenPorDefecto);

  const [colsEsc, setColsEsc] = useState<2 | 3 | 4>(4);
  const [colsMov, setColsMov] = useState<1 | 2>(2);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [visibles, setVisibles] = useState(PAGINA);

  // Preferencia de columnas guardada en el navegador
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY_COLS);
      if (!raw) return;
      const v = JSON.parse(raw) as { esc?: number; mov?: number };
      if (v.esc === 2 || v.esc === 3 || v.esc === 4) setColsEsc(v.esc);
      if (v.mov === 1 || v.mov === 2) setColsMov(v.mov);
    } catch {
      // ignorar
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        KEY_COLS,
        JSON.stringify({ esc: colsEsc, mov: colsMov })
      );
    } catch {
      // ignorar
    }
  }, [colsEsc, colsMov]);

  // Mantiene la URL al día para poder compartir/volver a una vista filtrada
  useEffect(() => {
    const p = new URLSearchParams();
    if (coleccion) p.set("coleccion", coleccion);
    if (categoria !== "todas") p.set("categoria", categoria);
    if (q.trim()) p.set("q", q.trim());
    if (tallas.length) p.set("talla", tallas.join(","));
    if (epocas.length) p.set("epoca", epocas.join(","));
    if (pecho) p.set("pecho", serializarPecho(pecho));
    if (vendidas) p.set("vendidas", "1");
    if (orden !== ordenPorDefecto) p.set("orden", orden);
    const qs = p.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname
    );
  }, [coleccion, categoria, q, tallas, epocas, pecho, vendidas, orden, ordenPorDefecto]);

  useEffect(() => {
    setVisibles(PAGINA);
  }, [coleccion, categoria, q, tallas, epocas, pecho, vendidas, orden]);

  // Piezas de partida (New arrivals = las N más recientes disponibles)
  const base = useMemo(() => {
    if (coleccion === "nuevos") {
      return productos
        .filter((p) => p.stock)
        .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
        .slice(0, site.nuevosCantidad);
    }
    return productos.filter((p) => vendidas || p.stock);
  }, [productos, coleccion, vendidas]);

  const baseCategoria = useMemo(
    () =>
      categoria === "todas" ? base : base.filter((p) => p.categoria === categoria),
    [base, categoria]
  );

  const opcionesTalla = useMemo(() => {
    const cuenta = new Map<string, number>();
    baseCategoria.forEach((p) => cuenta.set(p.talla, (cuenta.get(p.talla) ?? 0) + 1));
    return Array.from(cuenta.entries()).sort((a, b) => compararTallas(a[0], b[0]));
  }, [baseCategoria]);

  const opcionesEpoca = useMemo(() => {
    const cuenta = new Map<string, number>();
    baseCategoria.forEach((p) => cuenta.set(p.epoca, (cuenta.get(p.epoca) ?? 0) + 1));
    const conocidas = EPOCAS.filter((e) => cuenta.has(e));
    const otras = Array.from(cuenta.keys()).filter((e) => !EPOCAS.includes(e));
    return [...conocidas, ...otras].map((e) => [e, cuenta.get(e) ?? 0] as const);
  }, [baseCategoria]);

  const lista = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean);
    const conPuntaje = baseCategoria
      .filter((p) => (tallas.length ? tallas.includes(p.talla) : true))
      .filter((p) => (epocas.length ? epocas.includes(p.epoca) : true))
      .filter((p) => {
        if (!pecho) return true;
        const v = p.medidas?.pecho;
        return typeof v === "number" && v >= pecho[0] && v <= pecho[1];
      })
      .map((p) => ({ p, s: tokens.length ? puntaje(p, tokens) : 1 }))
      .filter((x) => x.s > 0);

    const porFechaDesc = (a: Product, b: Product) =>
      b.creadoEn.localeCompare(a.creadoEn);

    conPuntaje.sort((x, y) => {
      const a = x.p;
      const b = y.p;
      switch (orden) {
        case "az":
          return a.nombre.localeCompare(b.nombre, "es");
        case "za":
          return b.nombre.localeCompare(a.nombre, "es");
        case "precio-asc":
        case "precio-desc": {
          const pa = precioEn(a, moneda);
          const pb = precioEn(b, moneda);
          if (pa === null && pb === null) return 0;
          if (pa === null) return 1;
          if (pb === null) return -1;
          return orden === "precio-asc" ? pa - pb : pb - pa;
        }
        case "fecha-asc":
          return -porFechaDesc(a, b);
        case "fecha-desc":
          return porFechaDesc(a, b);
        case "relevantes":
          if (y.s !== x.s) return y.s - x.s;
          return porFechaDesc(a, b);
        case "destacadas":
        default:
          if (Boolean(b.destacada) !== Boolean(a.destacada)) {
            return Number(Boolean(b.destacada)) - Number(Boolean(a.destacada));
          }
          return porFechaDesc(a, b);
      }
    });

    return conPuntaje.map((x) => x.p);
  }, [baseCategoria, tallas, epocas, pecho, q, orden, moneda]);

  const titulo =
    coleccion === "nuevos"
      ? "New arrivals"
      : categoria !== "todas"
        ? (CATEGORIAS.find((c) => c.valor === categoria)?.label ?? "Catálogo")
        : "Catálogo";

  const chips: { clave: string; label: string; quitar: () => void }[] = [];
  if (coleccion) {
    chips.push({ clave: "col", label: "New arrivals", quitar: () => setColeccion(null) });
  }
  if (categoria !== "todas") {
    chips.push({
      clave: "cat",
      label: CATEGORIAS.find((c) => c.valor === categoria)?.label ?? categoria,
      quitar: () => setCategoria("todas"),
    });
  }
  tallas.forEach((t) =>
    chips.push({
      clave: `t-${t}`,
      label: `Talla ${t}`,
      quitar: () => setTallas((prev) => prev.filter((x) => x !== t)),
    })
  );
  epocas.forEach((e) =>
    chips.push({
      clave: `e-${e}`,
      label: e,
      quitar: () => setEpocas((prev) => prev.filter((x) => x !== e)),
    })
  );
  if (pecho) {
    chips.push({ clave: "pecho", label: etiquetaPecho(pecho), quitar: () => setPecho(null) });
  }

  function limpiarTodo() {
    setColeccion(null);
    setCategoria("todas");
    setTallas([]);
    setEpocas([]);
    setPecho(null);
    setQ("");
  }

  function alternar(
    valor: string,
    set: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    set((prev) =>
      prev.includes(valor) ? prev.filter((x) => x !== valor) : [...prev, valor]
    );
  }

  const pechoUnico = pecho && pecho[1] - pecho[0] === 1 ? (pecho[0] + pecho[1]) / 2 : null;

  return (
    <div>
      <div className="mb-5">
        <p className="tab-label text-xs uppercase text-ink/50">
          {coleccion === "nuevos" ? "lo más reciente" : "la tienda"}
        </p>
        <h1 className="font-display text-5xl leading-none">{titulo}</h1>
        <p className="tab-label mt-1 text-xs text-ink/55">
          {lista.length} {lista.length === 1 ? "pieza" : "piezas"}
        </p>
      </div>

      {/* Barra de herramientas */}
      <div className="perforated mb-4 flex flex-wrap items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          aria-expanded={filtrosAbiertos}
          className={`${chipBase} ${chipOff} lg:hidden`}
        >
          Filtros{chips.length ? ` (${chips.length})` : ""}
        </button>

        <label htmlFor="buscar" className="sr-only">
          Buscar piezas
        </label>
        <input
          id="buscar"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar: dickies, 1990s, M…"
          className="w-full min-w-0 flex-1 rounded-sm border border-ink/25 bg-paper px-3 py-1.5 font-serif text-sm sm:w-auto sm:max-w-xs"
        />

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="orden"
              className="tab-label text-[11px] uppercase text-ink/60"
            >
              Ordenar por
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="rounded-sm border border-ink/25 bg-paper px-2 py-1.5 font-serif text-sm"
            >
              {ORDENES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Densidad: escritorio (2/3/4) y celular (1/2) */}
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Columnas">
            <span className="tab-label mr-1 text-[11px] uppercase text-ink/60">Vista</span>
            {([2, 3, 4] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={colsEsc === n}
                aria-label={`${n} columnas`}
                onClick={() => setColsEsc(n)}
                className={`${chipBase} ${colsEsc === n ? chipOn : chipOff} w-8 px-0 text-center`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 md:hidden" role="group" aria-label="Columnas">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={colsMov === n}
                aria-label={`${n} ${n === 1 ? "columna" : "columnas"}`}
                onClick={() => setColsMov(n)}
                className={`${chipBase} ${colsMov === n ? chipOn : chipOff} w-8 px-0 text-center`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.clave}
              type="button"
              onClick={c.quitar}
              className={`${chipBase} ${chipOn}`}
              aria-label={`Quitar filtro ${c.label}`}
            >
              {c.label} ×
            </button>
          ))}
          <button
            type="button"
            onClick={limpiarTodo}
            className="tab-label text-xs uppercase text-stamp hover:underline"
          >
            limpiar todo
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
        <aside
          className={`${filtrosAbiertos ? "block" : "hidden"} space-y-6 lg:block`}
          aria-label="Filtros"
        >
          <fieldset>
            <legend className="tab-label mb-2 text-[11px] uppercase text-ink/60">
              Categoría
            </legend>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                aria-pressed={categoria === "todas"}
                onClick={() => setCategoria("todas")}
                className={`${chipBase} ${categoria === "todas" ? chipOn : chipOff}`}
              >
                Todas
              </button>
              {CATEGORIAS.map((c) => (
                <button
                  key={c.valor}
                  type="button"
                  aria-pressed={categoria === c.valor}
                  onClick={() => setCategoria(c.valor)}
                  className={`${chipBase} ${categoria === c.valor ? chipOn : chipOff}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="tab-label mb-2 text-[11px] uppercase text-ink/60">
              Talla
            </legend>
            {opcionesTalla.length === 0 ? (
              <p className="font-serif text-sm text-ink/50">Sin opciones</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {opcionesTalla.map(([t, n]) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tallas.includes(t)}
                    onClick={() => alternar(t, setTallas)}
                    className={`${chipBase} ${tallas.includes(t) ? chipOn : chipOff}`}
                  >
                    {t} <span className="opacity-60">({n})</span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="tab-label mb-2 text-[11px] uppercase text-ink/60">
              Época
            </legend>
            {opcionesEpoca.length === 0 ? (
              <p className="font-serif text-sm text-ink/50">Sin opciones</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {opcionesEpoca.map(([e, n]) => (
                  <button
                    key={e}
                    type="button"
                    aria-pressed={epocas.includes(e)}
                    onClick={() => alternar(e, setEpocas)}
                    className={`${chipBase} ${epocas.includes(e) ? chipOn : chipOff}`}
                  >
                    {e} <span className="opacity-60">({n})</span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="tab-label mb-2 text-[11px] uppercase text-ink/60">
              Pecho (axila a axila)
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {CHIPS_PECHO.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={pechoUnico === n}
                  onClick={() =>
                    setPecho(pechoUnico === n ? null : [n - 0.5, n + 0.5])
                  }
                  className={`${chipBase} ${pechoUnico === n ? chipOn : chipOff}`}
                >
                  {n}″
                </button>
              ))}
            </div>
            <a
              href="/guia-de-tallas"
              className="tab-label mt-2 inline-block text-[11px] uppercase text-stamp hover:underline"
            >
              ¿cuál es mi medida? →
            </a>
          </fieldset>

          {coleccion !== "nuevos" && (
            <label className="flex items-center gap-2 font-serif text-sm">
              <input
                type="checkbox"
                checked={vendidas}
                onChange={(e) => setVendidas(e.target.checked)}
              />
              Mostrar piezas vendidas
            </label>
          )}
        </aside>

        <div>
          {lista.length === 0 ? (
            <div className="manila-card rounded-sm p-8 text-center">
              <p className="mb-3 font-serif text-ink/70">
                {productos.length === 0
                  ? "Todavía no hay piezas en el catálogo."
                  : "No encontramos piezas con esos filtros."}
              </p>
              {chips.length > 0 || q ? (
                <button
                  type="button"
                  onClick={limpiarTodo}
                  className="tab-label text-xs uppercase text-stamp hover:underline"
                >
                  limpiar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className={`grid gap-x-3 gap-y-6 sm:gap-x-4 ${COLS_MOV[colsMov]} ${COLS_ESC[colsEsc]}`}>
                {lista.slice(0, visibles).map((p, i) => (
                  <ProductCard key={p.slug} producto={p} prioridad={i < 4} />
                ))}
              </div>
              {visibles < lista.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibles((v) => v + PAGINA)}
                    className="tab-label rounded-sm border border-ink/30 px-6 py-3 text-xs uppercase hover:border-ink"
                  >
                    ver más ({lista.length - visibles})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
