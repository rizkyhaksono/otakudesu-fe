import MovieDetailCard from "./_components/movie-detail-card";
import MovieBoxDetailCard from "./_components/moviebox-detail-card";

type Params = Promise<{ slug: string }>;

export default async function MovieDetailPage({ params }: Readonly<{ params: Params }>) {
  const { slug } = await params;

  // Check if slug is a MovieBox subjectId (numeric ID)
  const isMovieBoxId = /^\d+$/.test(slug);

  return (
    <div className="container mx-auto mt-10 px-4 pb-10 sm:px-6 lg:px-8">
      {isMovieBoxId ? <MovieBoxDetailCard subjectId={slug} /> : <MovieDetailCard slug={slug} />}
    </div>
  );
}
