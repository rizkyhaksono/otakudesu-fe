"use client";

import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useTheme } from "next-themes";

export default function GreetingLayout() {
  const { theme } = useTheme();

  return (
    <section className="bg-white pt-10 dark:bg-[#18191b]">
      <div className="mx-auto max-w-7xl px-12">
        <div className="mx-auto w-full text-left md:w-11/12 md:text-center xl:w-9/12">
          <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-foreground md:text-6xl md:tracking-tight">
            <span>Embark on a&nbsp;</span>
            <span className="leading-12 block w-full bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text py-2 text-transparent lg:inline">
              journey into the anime realm&nbsp;
            </span>
            <span>like never before!</span>
          </h1>
          <p className="mb-8 px-0 text-lg font-medium text-foreground md:text-xl lg:px-24">
            Start watching an anime without ads! From the{" "}
            <span className="leading-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text py-2 font-bold text-transparent">
              community
            </span>
            , for the{" "}
            <span className="leading-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text py-2 font-bold text-transparent">
              community
            </span>
            , by the{" "}
            <span className="leading-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text py-2 font-bold text-transparent">
              community
            </span>
            {""}.
          </p>
          <div className="mb-4 sm:space-x-2 md:mb-8 md:flex md:w-full md:justify-center md:space-x-2">
            <Link
              href="#started"
              className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400/50 px-6 py-3 text-lg font-medium text-foreground duration-300 hover:shadow-lg hover:shadow-blue-300/50 dark:bg-blue-400/20 hover:dark:shadow-blue-300/10 sm:mb-0 sm:w-auto"
            >
              Get Started
              <FaArrowRight />
            </Link>
            <Link
              href="/anime"
              className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 text-lg font-medium text-foreground duration-300 hover:shadow-lg hover:shadow-gray-300/50 dark:bg-gray-600/30 dark:text-white hover:dark:shadow-white/10 sm:mb-0 sm:w-auto"
            >
              Search Anime
              <FaSearch />
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-20 w-full text-center md:w-10/12">
          <div className="relative z-0 mt-8 w-full">
            <div className="relative overflow-hidden shadow-2xl shadow-gray-400 dark:shadow-blue-400/25">
              <div className="flex h-11 flex-none items-center rounded-xl rounded-b-none bg-blue-400 px-4">
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                  <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                  <div className="h-3 w-3 rounded-full border-2 border-white"></div>
                </div>
              </div>
              <Image
                width={1000}
                height={300}
                src={theme === "dark" ? "/dark-home.png" : "/light-home.png"}
                alt={"Hero"}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
