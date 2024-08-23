import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Schedules | Otakudesu",
  description: "Schedules Page Otakudesu. Build by Rizky Haksono",
};

export default function SchedulesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout>{children}</BaseLayout>;
}