import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { chapter: string } }): Promise<Metadata> {
  const formattedTitle = params.chapter
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Read - ${formattedTitle} | Otakudesu`,
    description: `Comics Page for ${formattedTitle} | Otakudesu. Build by Rizky Haksono`,
  };
}

export default function ComicChapterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}
