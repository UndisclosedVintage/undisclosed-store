import type { Metadata } from "next";
import CatalogoClient, {
  type FiltrosIniciales,
  type Orden,
} from "@/components/CatalogoClient";
import { obtenerCatalogo } from "@/lib/products-store";
import { CATEGORIAS, type Categoria } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo — Undisclosed Vintage",
  description:
    "Ropa vintage seleccionada pieza por pieza desde Colonia Americana, Guadalajara. Filtra por talla, época y medida.",
};

type Params = Record<string, string | string[] | undefined>;

const ORDENES_VALIDOS: Orden[] = [
  "destacadas",
  "relevantes",
  "az",
  "za",
  "precio-asc",
  "precio-desc",
  "fecha-asc",
  "fecha-desc",
];

function unico(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function lista(v: string | string[] | undefined) {
  const t = unico(v);
  return t
    ? t
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];
}

function leerPecho(v: string | string[] | undefined): [number, number] | undefined {
  const t = unico(v);
  if (!t) return undefined;
  const rango = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(t);
  if (rango) {
    const a = Number(rango[1]);
    const b = Number(rango[2]);
    return a <= b ? [a, b] : [b, a];
  }
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? [n - 0.5, n + 0.5] : undefined;
}

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const productos = await obtenerCatalogo();

  const categoria = unico(sp.categoria);
  const orden = unico(sp.orden) as Orden | undefined;

  const inicial: FiltrosIniciales = {
    coleccion: unico(sp.coleccion) === "nuevos" ? "nuevos" : undefined,
    categoria: CATEGORIAS.some((c) => c.valor === categoria)
      ? (categoria as Categoria)
      : undefined,
    q: unico(sp.q),
    tallas: lista(sp.talla),
    epocas: lista(sp.epoca),
    pecho: leerPecho(sp.pecho),
    vendidas: unico(sp.vendidas) === "1",
    orden: orden && ORDENES_VALIDOS.includes(orden) ? orden : undefined,
  };

  return (
    <div className="py-10">
      {/* key: al navegar desde el menú entre vistas, se reinician los filtros */}
      <CatalogoClient
        key={JSON.stringify(sp)}
        productos={productos}
        inicial={inicial}
      />
    </div>
  );
}
