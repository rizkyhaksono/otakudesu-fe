import { type Metadata } from "next";

type Params = Promise<{ chapter: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { chapter } = await params;

  const formattedTitle = chapter
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Read - ${formattedTitle} | Otakudesu`,
    description: `Comics Page for ${formattedTitle} | Otakudesu. Build by Rizky Haksono`,
  };
}

export default function ComicChapterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
