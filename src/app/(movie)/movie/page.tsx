import MovieHome from "./_components/movie-home";

export default function MoviesPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
      <MovieHome />
    </div>
  );
}