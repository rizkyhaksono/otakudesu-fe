import MovieSearchCardPage from "./_components/movie-search-card"
import Typography from "@/components/ui/typography"

export default function MovieSearchPage() {
  return (
    <div className="container mx-auto mt-10">
      <Typography.H3 className="mt-0">Search Movies</Typography.H3>
      <MovieSearchCardPage />
    </div>
  )
}