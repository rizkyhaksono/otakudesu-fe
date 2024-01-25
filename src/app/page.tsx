"use client";

import * as React from "react";
import BaseLayout from "@/components/base-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      <BaseLayout>
        <div className="flex justify-center container">Home Page</div>
      </BaseLayout>
    </>
  );
}
