import BaseLayout from "@/components/base-layout";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <BaseLayout>
        <div className="relative">
          <Image src={"/home.jpg"} alt="Image Anime" width={2000} height={300} className="xl:w-full xl:h-96 object-cover object-center" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full">
            <p className="font-semibold text-foreground xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl max-[640px]:text-2xl">About Page</p>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="mt-10">Hai</div>
        </div>
      </BaseLayout>
    </>
  );
}
