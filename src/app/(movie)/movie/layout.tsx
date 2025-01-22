import { type Metadata } from "next";
import BaseLayout from "@/components/layout/base-layout";

export const metadata: Metadata = {
  title: "Movies | Otakudesu",
  description: "Movies Page Otakudesu. Build by Rizky Haksono",
};

export default function MoviesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}