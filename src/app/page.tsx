import * as React from "react";
import BaseLayout from "@/components/base-layout";
import HomeCard from "@/components/home-card";

export default function Home() {
  return (
    <>
      <BaseLayout>
        <div className="container mx-auto">
          <HomeCard />
        </div>
      </BaseLayout>
    </>
  );
}
