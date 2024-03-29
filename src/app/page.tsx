import * as React from "react";
import BaseLayout from "@/components/base-layout";
import HomeCard from "@/components/home-card";
import HeroSection from "@/components/hero-section";
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
