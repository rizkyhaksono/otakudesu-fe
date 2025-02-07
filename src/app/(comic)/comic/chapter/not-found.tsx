import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChapterSlugNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-4xl font-semibold">Chapter not found</p>
        <p className="text-lg text-center">The comic chapter you are looking for is not available</p>
        <Link href="/comic">
          <Button>Back to Comic</Button>
        </Link>
      </div>
    </main>
  )
}