import CatalogoClient from "@/components/CatalogoClient";
import { obtenerCatalogo } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export default async function Catalogo() {
  const productos = await obtenerCatalogo();

  return (
    <div className="py-10">
      <p className="tab-label text-xs uppercase text-ink/50 mb-2">
        expediente de inventario
      </p>
      <h1 className="font-serif text-3xl mb-6">Catálogo</h1>
      <CatalogoClient productos={productos} />
    </div>
  );
}
