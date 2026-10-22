import { notFound } from "next/navigation";
import FormPieza from "@/components/FormPieza";
import { obtenerProductoPorSlug } from "@/lib/products-store";

export default async function Editar({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pieza = await obtenerProductoPorSlug(slug);
  if (!pieza) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-4xl">Editar pieza</h1>
      <FormPieza pieza={pieza} />
    </>
  );
}
