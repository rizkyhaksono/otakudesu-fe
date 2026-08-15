import { redirect } from "next/navigation";

/** Canonical form is `/genres/<slug>/page/1`; the bare slug redirects to it. */
export default async function GenreIndex({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/genres/${slug}/page/1`);
}
