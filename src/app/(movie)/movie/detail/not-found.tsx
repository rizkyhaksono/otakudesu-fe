import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MovieDetailSlugNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-4xl font-semibold">Movie detail not found</p>
        <p className="text-lg text-center">The movie detail you are looking for is not available</p>
        <Link href="/movie">
          <Button>Back to Movie</Button>
        </Link>
      </div>
    </main>
  )
}