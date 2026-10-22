import { notFound } from "next/navigation";
import FormPost from "@/components/FormPost";
import { obtenerPost } from "@/lib/posts-store";

export default async function EditarPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await obtenerPost(slug);
  if (!post) notFound();
  return (
    <>
      <h1 className="mb-6 font-display text-4xl">Editar artículo</h1>
      <FormPost post={post} />
    </>
  );
}
