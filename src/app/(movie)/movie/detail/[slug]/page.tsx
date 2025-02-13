import MovieDetailCard from "./_components/movie-detail-card";

type Params = Promise<{ slug: string }>;

export default async function MovieDetailPage({ params }: Readonly<{ params: Params }>) {
  const { slug } = await params;

  return (
    <div className="container mx-auto mt-10">
      <MovieDetailCard slug={slug} />
    </div>
  )
}