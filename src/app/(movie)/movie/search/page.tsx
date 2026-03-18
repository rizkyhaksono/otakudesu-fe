import MovieSearchCardPage from "./_components/movie-search-card";
import Typography from "@/components/ui/typography";

export default function MovieSearchPage() {
  return (
    <div className="container mx-auto mt-10 px-4 pb-10 sm:px-6 lg:px-8">
      <Typography.H3 className="mt-0">Search Movies</Typography.H3>
      <MovieSearchCardPage />
    </div>
  );
}
