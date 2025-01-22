import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Movie({
  links,
  defaultLink,
  title,
}: Readonly<{
  links: Array<{ quality: string; links: Array<{ name: string; url: string }> }>;
  defaultLink: string;
  title: string;
}>) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <iframe
            title="Anime Movie"
            className="h-[200px] w-full rounded-xl sm:h-[300px] sm:w-full md:h-[400px] md:w-full lg:h-[500px] lg:w-full xl:h-[600px] xl:w-full"
            src={defaultLink}
            allowFullScreen
          />
        </div>
        <div className="mt-4 flex flex-col items-center justify-between gap-2 w-full max-w-full min-w-full">
          {links.map((linkGroup) => (
            <div key={linkGroup.quality} className="w-full">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={`Choose ${linkGroup.quality}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{linkGroup.quality}</SelectLabel>
                    {linkGroup.links.map((link) => (
                      <SelectItem key={link.url} value={link.url}>
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full hover:underline"
                        >
                          {link.name}
                        </Link>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
