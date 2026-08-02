import Link from "next/link";
import { obtenerCatalogo } from "@/lib/products-store";
import ToggleVendida from "@/components/ToggleVendida";

export const dynamic = "force-dynamic";

const formatoMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default async function AdminPanel() {
  const productos = await obtenerCatalogo();

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Panel — catálogo</h1>
        <Link
          href="/admin/subir"
          className="tab-label text-xs uppercase px-4 py-2 bg-stamp text-paper rounded-sm hover:bg-stampdark"
        >
          + agregar pieza
        </Link>
      </div>

      <div className="manila-card rounded-sm divide-y divide-ink/15">
        {productos.map((p) => (
          <div
            key={p.slug}
            className="flex items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="font-serif">{p.nombre}</p>
              <p className="tab-label text-[11px] text-ink/50 mt-0.5">
                lote {p.lote} · {formatoMXN.format(p.precio)} ·{" "}
                {p.stock ? "disponible" : "vendida"}
              </p>
            </div>
            <ToggleVendida slug={p.slug} vendida={!p.stock} />
          </div>
        ))}
      </div>
    </div>
  );
}
