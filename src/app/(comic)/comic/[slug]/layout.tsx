import { type Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | Otakudesu`,
    description: `Comics Page for ${formattedTitle} | Otakudesu. Build by Rizky Haksono`,
  };
}

export default function ComicSlugLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
