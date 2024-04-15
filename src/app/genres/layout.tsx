import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Genres | Otakudesu",
  description: "Genres Page Otakudesu. Build by Rizky Haksono",
};

export default function GenreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <BaseLayout>{children}</BaseLayout>;
}
