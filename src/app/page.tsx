import * as React from "react";
import BaseLayout from "@/components/layout/base-layout";
import HomeCard from "@/components/layout/home-card";
import HeroSection from "@/components/layout/hero-section";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Home | Otakudesu",
  description: "Home Page Otakudesu. Build by Rizky Haksono",
};

export default function Home() {
  return (
    <BaseLayout>
      <HeroSection />

      <HomeCard />
    </BaseLayout>
  );
}
