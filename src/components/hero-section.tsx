"use client"

import Image from "next/image"
import Link from "next/link"
import { FaSearch } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa6"
import { useTheme } from "next-themes"

export default function HeroSection() {
  const { theme } = useTheme()

  return (
    <>
      <section className="pt-24 bg-white dark:bg-[#0c0c0d]">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-foreground md:text-6xl md:tracking-tight">
              <span>Embark on a</span> <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-blue-500 lg:inline">journey into the anime realm</span> <span>like never before!</span>
            </h1>
            <p className="px-0 mb-8 text-lg font-medium text-foreground md:text-xl lg:px-24">
              Start watching an anime without ads! For you from the <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-orange-400 to-red-500 lg:inline">community</span>, for the
              <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-orange-400 to-red-500 lg:inline"> community</span>, by the
              <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-orange-400 to-red-500 lg:inline"> community</span>.
            </p>
            <div className="mb-4 space-x-2 md:space-x-2 md:mb-8">
              <Link href="#started" className="gap-2 hover:shadow-blue-300/30 duration-300 hover:shadow-lg inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-foreground bg-blue-400 rounded-2xl sm:w-auto sm:mb-0">
                Get Started
                <FaArrowRight />
              </Link>
              <Link href="/anime" className="gap-2 inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-foreground dark:text-white bg-gray-100 dark:bg-gray-600 rounded-2xl sm:w-auto sm:mb-0">
                Search Anime
                <FaSearch />
              </Link>
            </div>
          </div>
          <div className="w-full mx-auto mt-20 text-center md:w-10/12">
            <div className="relative z-0 w-full mt-8">
              <div className="relative overflow-hidden shadow-2xl shadow-gray-300 dark:shadow-blue-400/25">
                <div className="flex items-center flex-none px-4 bg-blue-400 rounded-b-none h-11 rounded-xl">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <Image width={1000} height={300} src={theme === "dark" ? "/dark-home.png" : "/light-home.png"} alt={"Hero"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
