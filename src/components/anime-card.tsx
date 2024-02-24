import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface AnimeCardProps {
  anime: {
    title: string
    poster: string
    synopsis: string
    rating: string
    episode_lists: Array<{
      episode: string
      slug: string
      otakudesu_url: string
    }>
  }
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Card className="container mx-auto">
      <CardHeader>
        <CardTitle>{anime.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image width={200} height={400} src={anime.poster} alt={anime.title} />
        <p>{anime.synopsis}</p>
        <div>
          <h3>Episode Lists:</h3>
          <ul>
            {anime.episode_lists.map((episode) => (
              <li key={episode.slug}>
                <p>{episode.episode}</p>
                <a href={episode.otakudesu_url} target="_blank" rel="noopener noreferrer">
                  Watch Episode
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <p>Rating: {anime.rating}</p>
      </CardFooter>
    </Card>
  )
}

export default AnimeCard
